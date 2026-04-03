import { ORDER_TYPE_LABELS } from "@/lib/orderConstants";

export function useOrderTypeLabels() {
  const getLabel = (type: string | null): string => {
    if (!type) return "Orden";
    return ORDER_TYPE_LABELS[type] ?? type;
  };

  return { getLabel };
}
