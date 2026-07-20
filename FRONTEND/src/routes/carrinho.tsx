import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { ADDONS, findProduct } from "@/lib/menu";
import { formatBRL, useCart } from "@/lib/cart";

export const Route = createFileRoute("/carrinho")({
  head: () => ({ meta: [{ title: "Carrinho — Barões da Batata" }] }),
  component: Page,
});

const DELIVERY_FEE = 7.9;

function Page() {
  const { items, remove, setQty, subtotal, count } = useCart();
  const delivery = items.length ? DELIVERY_FEE : 0;
  const total = subtotal + delivery;

  return (
    <div className="mx-auto max-w-4xl px-5 lg:px-8 py-8 lg:py-14">
      <header className="mb-8">
        <div className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold">🛒 Carrinho</div>
        <h1 className="mt-1 font-display text-4xl sm:text-5xl text-gradient-gold">Seu pedido nobre</h1>
      </header>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card p-10 text-center">
          <ShoppingBag className="mx-auto h-10 w-10 text-primary" />
          <h2 className="mt-4 font-display text-2xl">Carrinho vazio</h2>
          <p className="mt-2 text-sm text-muted-foreground">Adicione as batatas mais nobres para começar.</p>
          <Link to="/batatas" className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-gold text-primary-foreground font-semibold shadow-gold">Ver batatas</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          <ul className="space-y-3">
            <AnimatePresence initial={false}>
              {items.map((item) => {
                const product = findProduct(item.productId);
                if (!product) return null;
                const addonNames = item.addons.map((id) => ADDONS.find((a) => a.id === id)?.name).filter(Boolean) as string[];
                return (
                  <motion.li
                    key={item.lineId}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 p-4 rounded-3xl border border-border bg-card"
                  >
                    <img src={product.image} alt={product.name} className="h-24 w-24 rounded-2xl object-cover" width={200} height={200} loading="lazy" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-display text-lg truncate">{product.name}</h3>
                          {addonNames.length > 0 && (
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">+ {addonNames.join(" · ")}</p>
                          )}
                        </div>
                        <button onClick={() => remove(item.lineId)} className="text-muted-foreground hover:text-destructive p-1"><Trash2 className="h-4 w-4" /></button>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-1 rounded-full bg-secondary border border-border p-1">
                          <button onClick={() => setQty(item.lineId, item.quantity - 1)} className="h-8 w-8 grid place-items-center rounded-full hover:bg-accent"><Minus className="h-3.5 w-3.5" /></button>
                          <span className="w-7 text-center font-semibold text-sm">{item.quantity}</span>
                          <button onClick={() => setQty(item.lineId, item.quantity + 1)} className="h-8 w-8 grid place-items-center rounded-full hover:bg-accent"><Plus className="h-3.5 w-3.5" /></button>
                        </div>
                        <div className="text-gradient-gold font-display text-xl">{formatBRL(item.unitPrice * item.quantity)}</div>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>

          <aside className="lg:sticky lg:top-24 h-fit rounded-3xl border border-border bg-card p-5">
            <h3 className="font-display text-xl">Resumo</h3>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal ({count} {count === 1 ? "item" : "itens"})</dt><dd>{formatBRL(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Entrega</dt><dd>{formatBRL(delivery)}</dd></div>
              <div className="border-t border-border pt-3 flex justify-between items-baseline"><dt className="font-semibold">Total</dt><dd className="text-gradient-gold font-display text-2xl">{formatBRL(total)}</dd></div>
            </dl>
            <Link to="/checkout" className="mt-5 w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-gradient-gold text-primary-foreground font-semibold shadow-gold hover:scale-[1.02] transition-transform">Finalizar Pedido</Link>
          </aside>
        </div>
      )}
    </div>
  );
}
