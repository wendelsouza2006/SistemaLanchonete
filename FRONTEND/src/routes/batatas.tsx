import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BATATAS, type Product } from "@/lib/menu";
import { ProductCard } from "@/components/ProductCard";
import { CustomizeDialog } from "@/components/CustomizeDialog";

export const Route = createFileRoute("/batatas")({
  head: () => ({ meta: [{ title: "Batatas Coroadas — Barões da Batata" }, { name: "description", content: "Escolha entre a Batata P, M ou G e personalize com bacon, frango e calabresa." }] }),
  component: Page,
});

function Page() {
  const [custom, setCustom] = useState<Product | null>(null);
  return (
    <div className="mx-auto max-w-7xl px-5 lg:px-8 py-8 lg:py-14">
      <header className="mb-8">
        <div className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold">🍟 Batatas</div>
        <h1 className="mt-1 font-display text-4xl sm:text-5xl text-gradient-gold">O reino das batatas</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">Sequinhas por fora, macias por dentro. Escolha o tamanho e coroe com os adicionais.</p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {BATATAS.map((p) => <ProductCard key={p.id} product={p} onClick={() => setCustom(p)} />)}
      </div>
      <CustomizeDialog product={custom} onClose={() => setCustom(null)} />
    </div>
  );
}
