// src/lib/posthogApi.ts

const POSTHOG_HOST = "https://us.i.posthog.com";
const POSTHOG_PROJECT_ID = process.env.EXPO_PUBLIC_POSTHOG_PROJECT_ID || "88656";
const POSTHOG_API_KEY = process.env.EXPO_PUBLIC_POSTHOG_PERSONAL_KEY;

interface PostHogQueryResponse {
  results: any[];
  columns?: string[];
  error?: string;
}

async function executeHogQLQuery(query: string): Promise<PostHogQueryResponse> {
  if (!POSTHOG_API_KEY) {
    console.warn("[PostHog API] No API key configured. Set EXPO_PUBLIC_POSTHOG_PERSONAL_KEY in .env");
    return { results: [], error: "No API key configured" };
  }

  try {
    const response = await fetch(
      `${POSTHOG_HOST}/api/projects/${POSTHOG_PROJECT_ID}/query`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${POSTHOG_API_KEY}`,
        },
        body: JSON.stringify({
          query: {
            kind: "HogQLQuery",
            query: query,
          },
        }),
      }
    );

    if (!response.ok) {
      console.error("[PostHog API] Query failed:", response.status);
      throw new Error(`PostHog API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("[PostHog API] Error:", error);
    return { results: [], error: String(error) };
  }
}

export interface CatalogViewsStats {
  totalViews: number;
  uniqueVisitors: number;
  viewsPerVisitor: number;
}

export async function getCatalogViewsByStore(
  storeId: string,
  days: number = 30
): Promise<CatalogViewsStats> {
  const query = `
    SELECT
      count(*) as total_views,
      count(DISTINCT person_id) as unique_visitors,
      round(count(*) * 1.0 / count(DISTINCT person_id), 2) as views_per_visitor
    FROM events
    WHERE event = 'catalog_page_view'
      AND properties.store_id = '${storeId}'
      AND timestamp >= now() - INTERVAL ${days} DAY
  `;

  const response = await executeHogQLQuery(query);

  if (response.error || !response.results || response.results.length === 0) {
    return { totalViews: 0, uniqueVisitors: 0, viewsPerVisitor: 0 };
  }

  const result = response.results[0];
  return {
    totalViews: result[0] || 0,
    uniqueVisitors: result[1] || 0,
    viewsPerVisitor: result[2] || 0,
  };
}
