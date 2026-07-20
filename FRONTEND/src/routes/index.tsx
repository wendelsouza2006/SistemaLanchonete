import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Crown, Leaf, Sparkles, Timer } from "lucide-react";
import heroImg from "@/assets/hero-batata.jpg";
import logo from "@/assets/logo-baroes.png";
import { BATATAS } from "@/lib/menu";
import { ProductCard } from "@/components/ProductCard";
import { useState } from "react";
import { CustomizeDialog } from "@/components/CustomizeDialog";
import type { Product } from "@/lib/menu";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [custom, setCustom] = useState<Product | null>(null);

  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-jungle-glow pointer-events-none" />
        <div className="mx-auto max-w-7xl px-5 lg:px-8 pt-8 lg:pt-16 pb-10 lg:pb-24 grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">
          <div className="relative z-10">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-[11px] uppercase tracking-[0.25em] font-semibold">
                <Leaf className="h-3.5 w-3.5" />
                Agora com o sabor da Amazônia
              </div>
              <h1 className="mt-5 font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight">
                <span className="text-foreground">O sabor</span>
                <br />
                <span className="text-gradient-gold">da nobreza</span>
              </h1>
              <p className="mt-5 max-w-md text-base sm:text-lg text-muted-foreground">
                Batatas recheadas de forma majestosa, sucos amazônicos e salgados artesanais.
                Feito com carinho, entregue como se fosse pra um rei.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/batatas"
                  className="group inline-flex items-center gap-2 px-6 py-4 rounded-full bg-gradient-gold text-primary-foreground font-semibold shadow-gold hover:scale-[1.03] active:scale-[0.98] transition-transform"
                >
                  Pedir Agora
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/salgados" className="inline-flex items-center gap-2 px-6 py-4 rounded-full border border-border bg-secondary/60 backdrop-blur font-semibold hover:border-primary/40 transition-colors">
                  Ver cardápio completo
                </Link>
              </div>

              <ul className="mt-10 grid grid-cols-3 gap-3 max-w-md">
                {[
                  { icon: Timer, label: "Entrega rápida", note: "35–50 min" },
                  { icon: Crown, label: "Porção nobre", note: "P · M · G" },
                  { icon: Sparkles, label: "Frescor", note: "Feito na hora" },
                ].map((f) => (
                  <li key={f.label} className="p-3 rounded-2xl bg-card/60 border border-border">
                    <f.icon className="h-4 w-4 text-primary" />
                    <div className="mt-2 text-xs font-semibold">{f.label}</div>
                    <div className="text-[11px] text-muted-foreground">{f.note}</div>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative"
          >
            <div className="absolute -inset-8 bg-primary/20 blur-3xl rounded-full pointer-events-none" />
            <div className="relative aspect-square rounded-[2.5rem] overflow-hidden gold-border shadow-lift">
              <img src={heroImg} alt="Batata recheada dos Barões" className="h-full w-full object-cover" width={1600} height={1200} />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-primary">Destaque</div>
                  <div className="font-display text-2xl text-white">Batata G Coroada</div>
                </div>
                <div className="rounded-full bg-gradient-gold px-4 py-2 text-primary-foreground text-sm font-bold shadow-gold">R$ 60,00</div>
              </div>
            </div>

            <motion.img
              src={logo}
              alt=""
              className="absolute -top-6 -left-4 h-20 w-20 drop-shadow-[0_10px_30px_oklch(0.83_0.17_88/0.5)] animate-float-slow"
              width={512}
              height={512}
              aria-hidden
            />
          </motion.div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-10 lg:py-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold">Categorias</div>
            <h2 className="mt-1 font-display text-3xl sm:text-4xl">Escolha seu reino</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
          {[
            { to: "/batatas", title: "Batatas", desc: "P · M · G recheadas", tone: "from-primary/30 to-transparent" },
            { to: "/salgados", title: "Salgados", desc: "Pastéis e croquetes", tone: "from-jungle/40 to-transparent" },
            { to: "/bebidas", title: "Bebidas", desc: "Refris & sucos amazônicos", tone: "from-primary/20 to-transparent" },
            { to: "/carrinho", title: "Meu Pedido", desc: "Finalize agora", tone: "from-primary/40 to-transparent" },
          ].map((c) => (
            <Link key={c.to} to={c.to} className="group relative overflow-hidden rounded-3xl border border-border bg-card p-5 hover-lift">
              <div className={`absolute inset-0 bg-gradient-to-br ${c.tone} opacity-70 group-hover:opacity-100 transition-opacity`} />
              <div className="relative">
                <div className="font-display text-2xl">{c.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{c.desc}</div>
                <ArrowRight className="mt-6 h-5 w-5 text-primary group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* DESTAQUES */}
      <section className="mx-auto max-w-7xl px-5 lg:px-8 pb-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold">Mais pedidas</div>
            <h2 className="mt-1 font-display text-3xl sm:text-4xl">As batatas coroadas</h2>
          </div>
          <Link to="/batatas" className="hidden sm:inline-flex items-center gap-1 text-sm text-primary hover:underline">Ver todas <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {BATATAS.map((p) => (
            <ProductCard key={p.id} product={p} onClick={() => setCustom(p)} />
          ))}
        </div>
      </section>

      <CustomizeDialog product={custom} onClose={() => setCustom(null)} />
    </div>
  );
}
