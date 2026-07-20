import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { findProduct, type Addon } from "./menu";

export type CartItem = {
  lineId: string;
  productId: string;
  quantity: number;
  addons: string[]; // addon ids
  unitPrice: number; // includes addon price
  note?: string;
};

type CartCtx = {
  items: CartItem[];
  add: (item: Omit<CartItem, "lineId">) => void;
  remove: (lineId: string) => void;
  setQty: (lineId: string, qty: number) => void;
  clear: () => void;
  subtotal: number;
  count: number;
};

const Ctx = createContext<CartCtx | null>(null);
const STORAGE_KEY = "baroes-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
  }, [items, hydrated]);

  const value = useMemo<CartCtx>(() => ({
    items,
    add: (item) => {
      const lineId = `${item.productId}-${item.addons.slice().sort().join(",")}-${Date.now()}`;
      setItems((prev) => {
        // merge if identical config
        const key = `${item.productId}|${item.addons.slice().sort().join(",")}`;
        const existing = prev.find((p) => `${p.productId}|${p.addons.slice().sort().join(",")}` === key);
        if (existing) {
          return prev.map((p) => p === existing ? { ...p, quantity: p.quantity + item.quantity } : p);
        }
        return [...prev, { ...item, lineId }];
      });
    },
    remove: (lineId) => setItems((prev) => prev.filter((p) => p.lineId !== lineId)),
    setQty: (lineId, qty) => setItems((prev) => prev.map((p) => p.lineId === lineId ? { ...p, quantity: Math.max(1, qty) } : p)),
    clear: () => setItems([]),
    subtotal: items.reduce((s, i) => s + i.unitPrice * i.quantity, 0),
    count: items.reduce((s, i) => s + i.quantity, 0),
  }), [items]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export const formatBRL = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function describeCartItem(item: CartItem, addonsList: Addon[]) {
  const product = findProduct(item.productId);
  const addonNames = item.addons.map((id) => addonsList.find((a) => a.id === id)?.name).filter(Boolean) as string[];
  return { product, addonNames };
}
