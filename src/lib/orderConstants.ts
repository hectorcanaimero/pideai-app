export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "out_for_delivery",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "#EAB308",
  confirmed: "#3B82F6",
  preparing: "#A855F7",
  ready: "#22C55E",
  out_for_delivery: "#F97316",
  delivered: "#6B7280",
  cancelled: "#EF4444",
};

export const STATUS_BG_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-500/20",
  confirmed: "bg-blue-500/20",
  preparing: "bg-purple-500/20",
  ready: "bg-green-500/20",
  out_for_delivery: "bg-orange-500/20",
  delivered: "bg-gray-500/20",
  cancelled: "bg-red-500/20",
};

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  preparing: "Preparando",
  ready: "Listo",
  out_for_delivery: "En camino",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

export const ORDER_TYPE_LABELS: Record<string, string> = {
  delivery: "Delivery",
  pickup: "Entrega en Tienda",
  digital_menu: "Mesa",
  dine_in: "En tienda",
};

export const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: "confirmed",
  confirmed: "preparing",
  preparing: "ready",
  ready: "out_for_delivery",
  out_for_delivery: "delivered",
};

export interface OrderWithItems {
  id: string;
  store_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  order_type: string | null;
  delivery_address: string | null;
  delivery_price: number | null;
  status: OrderStatus;
  payment_method: string | null;
  total_amount: number;
  notes: string | null;
  coupon_code: string | null;
  coupon_discount: number | null;
  tracking_code: string | null;
  assigned_driver_id: string | null;
  created_at: string | null;
  updated_at: string | null;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  item_name: string;
  quantity: number;
  price_at_time: number;
  extras: Array<{ name: string; price: number }> | null;
  created_at: string | null;
}
