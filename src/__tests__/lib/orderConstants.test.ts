import {
  ORDER_STATUSES,
  STATUS_COLORS,
  STATUS_BG_COLORS,
  STATUS_LABELS,
  ORDER_TYPE_LABELS,
  NEXT_STATUS,
  type OrderStatus,
} from "@/lib/orderConstants";

describe("orderConstants", () => {
  describe("ORDER_STATUSES", () => {
    it("contains all 7 statuses in correct order", () => {
      expect(ORDER_STATUSES).toEqual([
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ]);
    });

    it("is immutable (readonly tuple)", () => {
      expect(ORDER_STATUSES).toHaveLength(7);
    });
  });

  describe("STATUS_COLORS", () => {
    it("has a color for every status", () => {
      for (const status of ORDER_STATUSES) {
        expect(STATUS_COLORS[status]).toBeDefined();
        expect(STATUS_COLORS[status]).toMatch(/^#[A-Fa-f0-9]{6}$/);
      }
    });

    it("pending is yellow", () => {
      expect(STATUS_COLORS.pending).toBe("#EAB308");
    });

    it("cancelled is red", () => {
      expect(STATUS_COLORS.cancelled).toBe("#EF4444");
    });
  });

  describe("STATUS_BG_COLORS", () => {
    it("has a Tailwind bg class for every status", () => {
      for (const status of ORDER_STATUSES) {
        expect(STATUS_BG_COLORS[status]).toBeDefined();
        expect(STATUS_BG_COLORS[status]).toMatch(/^bg-/);
      }
    });
  });

  describe("STATUS_LABELS", () => {
    it("has a Spanish label for every status", () => {
      for (const status of ORDER_STATUSES) {
        expect(STATUS_LABELS[status]).toBeDefined();
        expect(typeof STATUS_LABELS[status]).toBe("string");
        expect(STATUS_LABELS[status].length).toBeGreaterThan(0);
      }
    });

    it("returns correct labels", () => {
      expect(STATUS_LABELS.pending).toBe("Pendiente");
      expect(STATUS_LABELS.confirmed).toBe("Confirmado");
      expect(STATUS_LABELS.preparing).toBe("Preparando");
      expect(STATUS_LABELS.ready).toBe("Listo");
      expect(STATUS_LABELS.out_for_delivery).toBe("En camino");
      expect(STATUS_LABELS.delivered).toBe("Entregado");
      expect(STATUS_LABELS.cancelled).toBe("Cancelado");
    });
  });

  describe("ORDER_TYPE_LABELS", () => {
    it("has labels for all order types", () => {
      expect(ORDER_TYPE_LABELS.delivery).toBe("Delivery");
      expect(ORDER_TYPE_LABELS.pickup).toBe("Pick-up");
      expect(ORDER_TYPE_LABELS.digital_menu).toBe("Mesa");
      expect(ORDER_TYPE_LABELS.dine_in).toBe("En tienda");
    });
  });

  describe("NEXT_STATUS", () => {
    it("follows the correct order flow", () => {
      expect(NEXT_STATUS.pending).toBe("confirmed");
      expect(NEXT_STATUS.confirmed).toBe("preparing");
      expect(NEXT_STATUS.preparing).toBe("ready");
      expect(NEXT_STATUS.ready).toBe("out_for_delivery");
      expect(NEXT_STATUS.out_for_delivery).toBe("delivered");
    });

    it("delivered has no next status", () => {
      expect(NEXT_STATUS.delivered).toBeUndefined();
    });

    it("cancelled has no next status", () => {
      expect(NEXT_STATUS.cancelled).toBeUndefined();
    });

    it("forms a complete chain from pending to delivered", () => {
      let current: OrderStatus = "pending";
      const visited: OrderStatus[] = [current];

      while (NEXT_STATUS[current]) {
        current = NEXT_STATUS[current]!;
        visited.push(current);
      }

      expect(visited).toEqual([
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "out_for_delivery",
        "delivered",
      ]);
    });
  });
});
