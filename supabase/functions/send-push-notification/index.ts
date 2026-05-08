import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

interface PushMessage {
  to: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  sound?: string;
  priority?: string;
  badge?: number;
  channelId?: string;
}

interface OrderRecord {
  id: string;
  store_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  total_amount: number;
  order_type: string | null;
  status: string;
  delivery_address: string | null;
  created_at: string;
}

Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    const record = payload.record as OrderRecord;

    // Only send push for new orders (INSERT event)
    if (!record || !record.store_id) {
      return new Response(JSON.stringify({ error: "No record in payload" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Only notify for pending orders (new orders)
    if (record.status !== "pending") {
      return new Response(JSON.stringify({ message: "Not a new order, skipping" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get all device tokens for this store
    const { data: tokens, error: tokensError } = await supabase
      .from("device_tokens")
      .select("expo_push_token")
      .eq("store_id", record.store_id);

    if (tokensError) {
      console.error("Error fetching tokens:", tokensError);
      return new Response(JSON.stringify({ error: "Failed to fetch tokens" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!tokens || tokens.length === 0) {
      return new Response(JSON.stringify({ message: "No registered devices" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Build notification message based on order type
    const orderTypeEmoji: Record<string, string> = {
      delivery: "🚚",
      pickup: "🏪",
      digital_menu: "🍽️",
      dine_in: "🍽️",
    };

    const orderTypeLabel: Record<string, string> = {
      delivery: "DELIVERY",
      pickup: "ENTREGA EN TIENDA",
      digital_menu: "MESA",
      dine_in: "EN TIENDA",
    };

    const emoji = orderTypeEmoji[record.order_type ?? ""] ?? "🛒";
    const typeLabel = orderTypeLabel[record.order_type ?? ""] ?? "NUEVO";
    const amount = record.total_amount?.toFixed(2) ?? "0.00";

    let body = `${record.customer_name} - $${amount}`;
    if (record.order_type === "delivery" && record.delivery_address) {
      body += `\n📍 ${record.delivery_address}`;
    }

    // Get pending orders count for badge
    const { count: pendingCount } = await supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("store_id", record.store_id)
      .in("status", ["pending", "confirmed"]);

    // Build messages for all devices
    const messages: PushMessage[] = tokens.map((t) => ({
      to: t.expo_push_token,
      title: `${emoji} ¡Nuevo pedido ${typeLabel}!`,
      body,
      data: { orderId: record.id, storeId: record.store_id },
      sound: "default",
      priority: "high",
      badge: pendingCount ?? 1,
      channelId: "orders",
    }));

    // Send to Expo Push API (supports batch)
    const response = await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(messages),
    });

    const result = await response.json();

    // Log any failed sends
    if (result.data) {
      const failures = result.data.filter(
        (r: { status: string }) => r.status === "error"
      );
      if (failures.length > 0) {
        console.error("Push failures:", JSON.stringify(failures));
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        sent: messages.length,
        orderId: record.id,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Push notification error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
