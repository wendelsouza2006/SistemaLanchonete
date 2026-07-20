import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import type { Product } from "@/lib/menu";
import { formatBRL, useCart } from "@/lib/cart";
import { toast } from "sonner";

export function ProductCard({ product, onClick }: { product: Product; onClick?: () => void }) {
  const { add } = useCart();
  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.customizable) { onClick?.(); return; }
    add({ productId: product.id, quantity: 1, addons: [], unitPrice: product.price });
    toast.success(`${product.name} adicionado`, { description: formatBRL(product.price) });
  };

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      onClick={onClick}
      className="group relative overflow-hidden rounded-3xl bg-card border border-border shadow-lift cursor-pointer"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ink">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
        {product.tag && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-gradient-gold text-primary-foreground text-[10px] uppercase tracking-wider font-bold shadow-gold">
            {product.tag}
          </span>
        )}
      </div>
      <div className="p-4 sm:p-5">
        <h3 className="font-display text-lg sm:text-xl leading-tight text-foreground">{product.name}</h3>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="text-gradient-gold font-display text-2xl">{formatBRL(product.price)}</div>
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-gold text-primary-foreground text-sm font-semibold shadow-gold hover:scale-105 active:scale-95 transition-transform"
          >
            <Plus className="h-4 w-4" strokeWidth={3} />
            {product.customizable ? "Montar" : "Adicionar"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
