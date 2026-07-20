import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Bike, Store } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ADDONS, findProduct } from "@/lib/menu";
import { formatBRL, useCart } from "@/lib/cart";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Finalizar pedido — Barões da Batata" }] }),
  component: Page,
});

const DELIVERY_FEE = 7.9;

function Page() {
  const navigate = useNavigate();
  const { items, subtotal, clear } = useCart();
  const [mode, setMode] = useState<"delivery" | "pickup">("delivery");
  const [form, setForm] = useState({ nome: "", telefone: "", cep: "", rua: "", numero: "", complemento: "", bairro: "", cidade: "", referencia: "" });
  const [loading, setLoading] = useState(false);

  const delivery = mode === "delivery" ? DELIVERY_FEE : 0;
  const total = subtotal + delivery;

  const canSubmit = form.nome.trim() && form.telefone.trim() && (mode === "pickup" || (form.rua && form.numero && form.bairro));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) { toast.error("Preencha os campos obrigatórios."); return; }
    if (items.length === 0) { toast.error("Carrinho vazio."); return; }
    setLoading(true);
    const orderId = `BB${Date.now().toString().slice(-6)}`;
    // Persist snapshot for confirmation page
    const snapshot = {
      id: orderId,
      createdAt: new Date().toISOString(),
      items: items.map((i) => {
        const p = findProduct(i.productId)!;
        const addonNames = i.addons.map((id) => ADDONS.find((a) => a.id === id)?.name).filter(Boolean);
        return { name: p.name, quantity: i.quantity, unitPrice: i.unitPrice, addons: addonNames };
      }),
      subtotal, delivery, total, mode, customer: form,
    };
    try { localStorage.setItem(`baroes-order-${orderId}`, JSON.stringify(snapshot)); } catch {}
    setTimeout(() => {
      clear();
      navigate({ to: "/pedido/$id", params: { id: orderId } });
    }, 700);
  };

  const inputCls = "w-full px-4 py-3 rounded-2xl bg-secondary border border-border focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors";

  return (
    <div className="mx-auto max-w-5xl px-5 lg:px-8 py-8 lg:py-14">
      <header className="mb-8">
        <div className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold">Finalizar</div>
        <h1 className="mt-1 font-display text-4xl sm:text-5xl text-gradient-gold">Quase lá, majestade</h1>
      </header>

      <form onSubmit={submit} className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-6">
          {/* Modo */}
          <section className="rounded-3xl border border-border bg-card p-5">
            <h2 className="font-display text-xl mb-4">Modo de entrega</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: "delivery", label: "Entrega", desc: "35–50 min", icon: Bike },
                { key: "pickup", label: "Retirada", desc: "Retire na loja", icon: Store },
              ].map((o) => {
                const active = mode === (o.key as "delivery" | "pickup");
                const Icon = o.icon;
                return (
                  <button type="button" key={o.key} onClick={() => setMode(o.key as "delivery" | "pickup")}
                    className={`relative p-4 rounded-2xl border text-left transition-all ${active ? "border-primary/60 bg-primary/10" : "border-border bg-secondary hover:border-primary/30"}`}>
                    <Icon className="h-5 w-5 text-primary" />
                    <div className="mt-2 font-semibold">{o.label}</div>
                    <div className="text-xs text-muted-foreground">{o.desc}</div>
                    {active && <motion.span layoutId="mode-ring" className="absolute inset-0 rounded-2xl ring-2 ring-primary/50 pointer-events-none" />}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Contato */}
          <section className="rounded-3xl border border-border bg-card p-5">
            <h2 className="font-display text-xl mb-4">Seus dados</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <input required placeholder="Nome completo" className={inputCls + " sm:col-span-2"} value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
              <input required placeholder="WhatsApp (com DDD)" className={inputCls} value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} />
              <input placeholder="CEP" className={inputCls} value={form.cep} onChange={(e) => setForm({ ...form, cep: e.target.value })} />
            </div>
          </section>

          {/* Endereço */}
          {mode === "delivery" && (
            <motion.section
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-border bg-card p-5"
            >
              <h2 className="font-display text-xl mb-4">Endereço de entrega</h2>
              <div className="grid sm:grid-cols-6 gap-3">
                <input required placeholder="Rua" className={`${inputCls} sm:col-span-4`} value={form.rua} onChange={(e) => setForm({ ...form, rua: e.target.value })} />
                <input required placeholder="Nº" className={`${inputCls} sm:col-span-2`} value={form.numero} onChange={(e) => setForm({ ...form, numero: e.target.value })} />
                <input placeholder="Complemento" className={`${inputCls} sm:col-span-3`} value={form.complemento} onChange={(e) => setForm({ ...form, complemento: e.target.value })} />
                <input required placeholder="Bairro" className={`${inputCls} sm:col-span-3`} value={form.bairro} onChange={(e) => setForm({ ...form, bairro: e.target.value })} />
                <input placeholder="Cidade" className={`${inputCls} sm:col-span-3`} value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} />
                <input placeholder="Ponto de referência" className={`${inputCls} sm:col-span-3`} value={form.referencia} onChange={(e) => setForm({ ...form, referencia: e.target.value })} />
              </div>
            </motion.section>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 h-fit rounded-3xl border border-border bg-card p-5">
          <h3 className="font-display text-xl">Resumo do pedido</h3>
          <ul className="mt-4 space-y-2 text-sm max-h-64 overflow-auto pr-1">
            {items.map((i) => {
              const p = findProduct(i.productId)!;
              return (
                <li key={i.lineId} className="flex justify-between gap-3">
                  <span className="truncate">{i.quantity}× {p.name}</span>
                  <span className="text-muted-foreground">{formatBRL(i.unitPrice * i.quantity)}</span>
                </li>
              );
            })}
          </ul>
          <dl className="mt-4 space-y-2 text-sm border-t border-border pt-4">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatBRL(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">{mode === "delivery" ? "Entrega" : "Retirada"}</dt><dd>{formatBRL(delivery)}</dd></div>
            <div className="flex justify-between items-baseline pt-2 border-t border-border"><dt className="font-semibold">Total</dt><dd className="text-gradient-gold font-display text-2xl">{formatBRL(total)}</dd></div>
          </dl>
          <button
            type="submit"
            disabled={loading || items.length === 0}
            className="mt-5 w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-gradient-gold text-primary-foreground font-semibold shadow-gold hover:scale-[1.02] transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Gerando PIX..." : "Pagar com PIX"}
          </button>
          <p className="mt-3 text-[11px] text-muted-foreground text-center">Ao confirmar, seu pedido é enviado ao WhatsApp da loja.</p>
        </aside>
      </form>
    </div>
  );
}
