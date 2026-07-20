import { createFileRoute } from "@tanstack/react-router";
import { SALGADOS } from "@/lib/menu";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/salgados")({
  head: () => ({ meta: [{ title: "Salgados Artesanais — Barões da Batata" }, { name: "description", content: "Pastéis, croquetes e enroladinhos crocantes feitos na hora." }] }),
  component: Page,
});

function Page() {
  return (
    <div className="mx-auto max-w-7xl px-5 lg:px-8 py-8 lg:py-14">
      <header className="mb-8">
        <div className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold">🥟 Salgados</div>
        <h1 className="mt-1 font-display text-4xl sm:text-5xl text-gradient-gold">Salgados artesanais</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">Crocantes por fora, quentinhos por dentro.</p>
      </header>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
        {SALGADOS.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
