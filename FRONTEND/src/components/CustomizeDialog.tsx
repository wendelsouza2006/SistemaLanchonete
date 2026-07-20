import { AnimatePresence, motion } from "framer-motion";
import { Check, Minus, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ADDONS, type Product } from "@/lib/menu";
import { formatBRL, useCart } from "@/lib/cart";

export function CustomizeDialog({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const { add } = useCart();
  const [selected, setSelected] = useState<string[]>([]);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (product) { setSelected([]); setQty(1); }
  }, [product?.id]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onClose]);

  if (!product) return null;

  const addonsTotal = selected.reduce((s, id) => s + (ADDONS.find((a) => a.id === id)?.price ?? 0), 0);
  const unit = product.price + addonsTotal;
  const total = unit * qty;

  const toggle = (id: string) => setSelected((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);

  const handleAdd = () => {
    add({ productId: product.id, quantity: qty, addons: selected, unitPrice: unit });
    toast.success(`${product.name} adicionada ao carrinho`, { description: formatBRL(total) });
    onClose();
  };

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink/80 backdrop-blur-md" onClick={onClose} />
          <motion.div
            initial={{ y: "100%", opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 30 }}
            className="relative w-full sm:max-w-lg bg-card border border-border rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-lift max-h-[92vh] flex flex-col"
          >
            <div className="relative">
              <img src={product.image} alt={product.name} className="w-full aspect-[16/10] object-cover" width={1024} height={640} />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
              <button onClick={onClose} className="absolute top-3 right-3 h-9 w-9 grid place-items-center rounded-full bg-ink/70 backdrop-blur border border-border text-foreground hover:bg-ink transition-colors">
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-4 left-5 right-5">
                <h2 className="font-display text-3xl text-gradient-gold">{product.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
              </div>
            </div>

            <div className="p-5 overflow-y-auto flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg">Adicionais</h3>
                <span className="text-xs text-muted-foreground">Escolha quantos quiser</span>
              </div>
              <ul className="mt-3 space-y-2">
                {ADDONS.map((a) => {
                  const on = selected.includes(a.id);
                  return (
                    <li key={a.id}>
                      <button
                        onClick={() => toggle(a.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition-all ${on ? "border-primary/60 bg-primary/10" : "border-border bg-secondary hover:border-primary/30"}`}
                      >
                        <span className={`h-6 w-6 grid place-items-center rounded-md border-2 transition-colors ${on ? "border-primary bg-gradient-gold" : "border-muted-foreground/40"}`}>
                          {on && <Check className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={3} />}
                        </span>
                        <span className="flex-1 text-left font-medium">{a.name}</span>
                        <span className="text-sm text-gradient-gold font-semibold">+ {formatBRL(a.price)}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-6 p-4 rounded-2xl bg-secondary/60 border border-border">
                <h4 className="text-xs uppercase tracking-widest text-muted-foreground">Resumo</h4>
                <div className="mt-2 text-sm">
                  <div className="flex justify-between"><span>{product.name}</span><span>{formatBRL(product.price)}</span></div>
                  {selected.map((id) => {
                    const a = ADDONS.find((x) => x.id === id)!;
                    return <div key={id} className="flex justify-between text-muted-foreground"><span>✔ {a.name}</span><span>+ {formatBRL(a.price)}</span></div>;
                  })}
                  {ADDONS.filter((a) => !selected.includes(a.id)).slice(0, 0).map(() => null)}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-border bg-popover/80 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 rounded-full bg-secondary border border-border p-1">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-9 w-9 grid place-items-center rounded-full hover:bg-accent transition-colors"><Minus className="h-4 w-4" /></button>
                  <span className="w-8 text-center font-semibold">{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} className="h-9 w-9 grid place-items-center rounded-full hover:bg-accent transition-colors"><Plus className="h-4 w-4" /></button>
                </div>
                <button
                  onClick={handleAdd}
                  className="flex-1 inline-flex items-center justify-between gap-2 px-5 py-3 rounded-full bg-gradient-gold text-primary-foreground font-semibold shadow-gold hover:scale-[1.02] active:scale-[0.98] transition-transform"
                >
                  <span>Adicionar</span>
                  <span className="font-display text-lg">{formatBRL(total)}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
