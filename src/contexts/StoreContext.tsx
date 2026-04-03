import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { supabase } from "@/services/supabase";
import { useAuth } from "@/hooks/useAuth";

interface Store {
  id: string;
  name: string;
  subdomain: string;
  owner_id: string;
  logo_url: string | null;
  banner_url: string | null;
  is_food_business: boolean;
  catalog_mode: boolean;
  operating_modes: Array<"delivery" | "pickup" | "digital_menu"> | null;
  force_status: "normal" | "force_open" | "force_closed" | null;
  currency: string | null;
  enable_currency_conversion: boolean | null;
  active_currency: string | null;
  hide_original_price: boolean | null;
  whatsapp_number: string | null;
  min_order_amount: number | null;
  delivery_fee: number | null;
  theme_color: string | null;
}

interface StoreContextType {
  store: Store | null;
  loading: boolean;
  isStoreOwner: boolean;
  reloadStore: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType>({
  store: null,
  loading: true,
  isStoreOwner: false,
  reloadStore: async () => {},
});

export function StoreProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStoreOwner, setIsStoreOwner] = useState(false);

  const loadStore = useCallback(async () => {
    if (!user) {
      setStore(null);
      setIsStoreOwner(false);
      setLoading(false);
      return;
    }

    try {
      const { data: userStore, error } = await supabase
        .from("stores")
        .select("*")
        .eq("owner_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error loading store:", error);
        setStore(null);
        setIsStoreOwner(false);
      } else if (userStore) {
        setStore(userStore as unknown as Store);
        setIsStoreOwner(true);
      } else {
        const { data: isPlatformAdmin } = await supabase.rpc(
          "is_platform_admin"
        );
        if (isPlatformAdmin) {
          setIsStoreOwner(true);
        } else {
          setStore(null);
          setIsStoreOwner(false);
        }
      }
    } catch (err) {
      console.error("Error loading store:", err);
      setStore(null);
      setIsStoreOwner(false);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadStore();
  }, [loadStore]);

  useEffect(() => {
    if (!store) return;
    const interval = setInterval(() => {
      loadStore();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [store, loadStore]);

  return (
    <StoreContext.Provider
      value={{ store, loading, isStoreOwner, reloadStore: loadStore }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
