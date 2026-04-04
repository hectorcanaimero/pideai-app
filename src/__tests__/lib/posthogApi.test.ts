describe("posthogApi", () => {
  const originalFetch = global.fetch;
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    process.env = originalEnv;
  });

  describe("getCatalogViewsByStore", () => {
    it("returns zero stats when no API key configured", async () => {
      delete process.env.EXPO_PUBLIC_POSTHOG_PERSONAL_KEY;
      const { getCatalogViewsByStore } = require("@/lib/posthogApi");

      const result = await getCatalogViewsByStore("store-123");
      expect(result).toEqual({
        totalViews: 0,
        uniqueVisitors: 0,
        viewsPerVisitor: 0,
      });
    });

    it("returns zero stats on fetch error", async () => {
      process.env = { ...originalEnv, EXPO_PUBLIC_POSTHOG_PERSONAL_KEY: "test-key" };
      const { getCatalogViewsByStore } = require("@/lib/posthogApi");

      global.fetch = jest.fn().mockRejectedValue(new Error("Network error")) as any;

      const result = await getCatalogViewsByStore("store-123");
      expect(result).toEqual({
        totalViews: 0,
        uniqueVisitors: 0,
        viewsPerVisitor: 0,
      });
    });

    it("returns zero stats on non-ok response", async () => {
      process.env = { ...originalEnv, EXPO_PUBLIC_POSTHOG_PERSONAL_KEY: "test-key" };
      const { getCatalogViewsByStore } = require("@/lib/posthogApi");

      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
      }) as any;

      const result = await getCatalogViewsByStore("store-123");
      expect(result).toEqual({
        totalViews: 0,
        uniqueVisitors: 0,
        viewsPerVisitor: 0,
      });
    });

    it("parses successful response correctly", async () => {
      process.env = { ...originalEnv, EXPO_PUBLIC_POSTHOG_PERSONAL_KEY: "test-key" };
      const { getCatalogViewsByStore } = require("@/lib/posthogApi");

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ results: [[277, 159, 1.74]] }),
      }) as any;

      const result = await getCatalogViewsByStore("store-123", 30);
      expect(result).toEqual({
        totalViews: 277,
        uniqueVisitors: 159,
        viewsPerVisitor: 1.74,
      });
    });

    it("returns zero stats when results array is empty", async () => {
      process.env = { ...originalEnv, EXPO_PUBLIC_POSTHOG_PERSONAL_KEY: "test-key" };
      const { getCatalogViewsByStore } = require("@/lib/posthogApi");

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ results: [] }),
      }) as any;

      const result = await getCatalogViewsByStore("store-123");
      expect(result).toEqual({
        totalViews: 0,
        uniqueVisitors: 0,
        viewsPerVisitor: 0,
      });
    });
  });
});
