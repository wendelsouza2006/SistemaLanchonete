import { createFileRoute } from "@tanstack/react-router";
import { BEBIDAS } from "@/lib/menu";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/bebidas")({
  head: () => ({ meta: [{ title: "Bebidas — Barões da Batata" }, { name: "description", content: "Refrigerantes, águas e sucos amazônicos (cupuaçu, taperebá, maracujá, laranja)." }] }),
  component: Page,
});

const GROUPS: { key: string; label: string; filter: (tag?: string) => boolean }[] = [
  { key: "refri", label: "Refrigerantes & Água", filter: (t) => t === "Refrigerante" || t === "Água" },
  { key: "sucos", label: "Sucos", filter: (t) => t === "Suco" || t === "Suco Amazônico" },
];

function Page() {
  return (
    <div className="mx-auto max-w-7xl px-5 lg:px-8 py-8 lg:py-14">
      <header className="mb-8">
        <div className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold">🥤 Bebidas</div>
        <h1 className="mt-1 font-display text-4xl sm:text-5xl text-gradient-gold">Do gelo ao gole</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">Refrescos clássicos e o autêntico sabor da Amazônia.</p>
      </header>

      <div className="space-y-12">
        {GROUPS.map((g) => (
          <section key={g.key}>
            <h2 className="font-display text-2xl mb-4">{g.label}</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
              {BEBIDAS.filter((b) => g.filter(b.tag)).map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
