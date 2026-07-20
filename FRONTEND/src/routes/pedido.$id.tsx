import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, Copy, MessageCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { formatBRL } from "@/lib/cart";

export const Route = createFileRoute("/pedido/$id")({
  head: () => ({ meta: [{ title: "Pedido confirmado — Barões da Batata" }, { name: "robots", content: "noindex" }] }),
  component: Page,
});

type OrderSnapshot = {
  id: string; createdAt: string;
  items: { name: string; quantity: number; unitPrice: number; addons: string[] }[];
  subtotal: number; delivery: number; total: number;
  mode: "delivery" | "pickup";
  customer: { nome: string; telefone: string; rua?: string; numero?: string; bairro?: string; cidade?: string; complemento?: string; referencia?: string };
};

// Demo store info — configurable later in admin panel
const STORE_WHATSAPP = "5511999999999";
const PIX_KEY = "pix@baroesdabatata.com.br";

function generatePixCode(order: OrderSnapshot) {
  return `00020126360014BR.GOV.BCB.PIX0114${PIX_KEY}5204000053039865405${order.total.toFixed(2)}5802BR5915BAROES DA BATATA6009SAO PAULO62070503${order.id}6304ABCD`;
}

function Page() {
  const { id } = Route.useParams();
  const [order, setOrder] = useState<OrderSnapshot | null>(null);
  const [paid, setPaid] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`baroes-order-${id}`);
      if (raw) setOrder(JSON.parse(raw));
    } catch {}
  }, [id]);

  const pixCode = useMemo(() => order ? generatePixCode(order) : "", [order]);
  const qrUrl = pixCode ? `https://api.qrserver.com/v1/create-qr-code/?size=340x340&margin=8&data=${encodeURIComponent(pixCode)}` : "";

  const whatsappMessage = useMemo(() => {
    if (!order) return "";
    const lines = [
      `*Novo Pedido — ${order.id}*`,
      `Cliente: ${order.customer.nome}`,
      `WhatsApp: ${order.customer.telefone}`,
      order.mode === "delivery"
        ? `Endereço: ${order.customer.rua}, ${order.customer.numero}${order.customer.complemento ? ` — ${order.customer.complemento}` : ""}, ${order.customer.bairro}${order.customer.cidade ? ` — ${order.customer.cidade}` : ""}${order.customer.referencia ? `\nRef: ${order.customer.referencia}` : ""}`
        : `Retirada na loja`,
      "",
      "*Itens:*",
      ...order.items.map((i) => `• ${i.quantity}× ${i.name}${i.addons?.length ? ` (${i.addons.join(", ")})` : ""} — ${formatBRL(i.unitPrice * i.quantity)}`),
      "",
      `Subtotal: ${formatBRL(order.subtotal)}`,
      `Entrega: ${formatBRL(order.delivery)}`,
      `*Total: ${formatBRL(order.total)}*`,
      `Pagamento: PIX`,
      `Horário: ${new Date(order.createdAt).toLocaleString("pt-BR")}`,
    ];
    return lines.join("\n");
  }, [order]);

  const copyPix = async () => {
    try { await navigator.clipboard.writeText(pixCode); setCopied(true); toast.success("Pix copiado!"); setTimeout(() => setCopied(false), 2000); } catch { toast.error("Não foi possível copiar."); }
  };

  const confirmPayment = () => {
    setPaid(true);
    toast.success("Pagamento confirmado!", { description: "Enviando pedido para a loja..." });
    setTimeout(() => {
      window.open(`https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(whatsappMessage)}`, "_blank");
    }, 400);
  };

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-5 py-16 text-center">
        <h1 className="font-display text-3xl">Pedido não encontrado</h1>
        <p className="mt-2 text-sm text-muted-foreground">Refaça seu pedido pra gerar o PIX.</p>
        <Link to="/" className="mt-6 inline-flex px-5 py-3 rounded-full bg-gradient-gold text-primary-foreground font-semibold shadow-gold">Voltar</Link>
      </div>
    );
  }

  const STATUS = paid
    ? ["Recebido", "Preparando", "Saiu para entrega", "Entregue"]
    : ["Aguardando pagamento", "Recebido", "Preparando", "A caminho"];
  const currentStep = paid ? 1 : 0;

  return (
    <div className="mx-auto max-w-4xl px-5 lg:px-8 py-8 lg:py-14">
      <header className="mb-6 text-center">
        <div className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold">Pedido {order.id}</div>
        <h1 className="mt-1 font-display text-4xl sm:text-5xl text-gradient-gold">
          {paid ? "Pagamento confirmado" : "Pague com PIX"}
        </h1>
        <p className="mt-2 text-muted-foreground text-sm">Total {formatBRL(order.total)} · {order.mode === "delivery" ? "Entrega" : "Retirada"}</p>
      </header>

      {/* Status timeline */}
      <ol className="mb-8 grid grid-cols-4 gap-2">
        {STATUS.map((label, i) => {
          const active = i <= currentStep;
          return (
            <li key={label} className="flex flex-col items-center gap-2 text-center">
              <div className={`h-8 w-8 rounded-full grid place-items-center border transition-colors ${active ? "bg-gradient-gold border-transparent text-primary-foreground" : "bg-secondary border-border text-muted-foreground"}`}>
                {active ? <Check className="h-4 w-4" strokeWidth={3} /> : <span className="text-xs font-bold">{i + 1}</span>}
              </div>
              <span className={`text-[10px] sm:text-xs ${active ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
            </li>
          );
        })}
      </ol>

      {!paid ? (
        <motion.section
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-[340px_1fr] gap-6 items-start"
        >
          <div className="rounded-3xl border border-border bg-card p-5 flex flex-col items-center">
            <div className="rounded-2xl bg-white p-3 shadow-gold">
              {qrUrl && <img src={qrUrl} alt="QR Code PIX" className="h-72 w-72" width={340} height={340} />}
            </div>
            <p className="mt-4 text-xs text-muted-foreground text-center">Escaneie com o app do seu banco</p>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-border bg-card p-5">
              <h3 className="font-display text-lg">PIX Copia e Cola</h3>
              <div className="mt-3 p-3 rounded-2xl bg-secondary border border-border font-mono text-xs break-all">{pixCode}</div>
              <button onClick={copyPix} className="mt-3 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-gold text-primary-foreground font-semibold shadow-gold">
                {copied ? <Check className="h-4 w-4" strokeWidth={3} /> : <Copy className="h-4 w-4" />}
                {copied ? "Copiado" : "Copiar código"}
              </button>
            </div>

            <div className="rounded-3xl border border-border bg-card p-5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Valor a pagar</span>
                <span className="text-gradient-gold font-display text-3xl">{formatBRL(order.total)}</span>
              </div>
              <button onClick={confirmPayment} className="mt-4 w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-gradient-gold text-primary-foreground font-semibold shadow-gold hover:scale-[1.02] transition-transform">
                Já paguei · confirmar
              </button>
              <p className="mt-2 text-[11px] text-muted-foreground text-center">Simulação: em produção, o status é atualizado pelo webhook do Mercado Pago/Asaas.</p>
            </div>
          </div>
        </motion.section>
      ) : (
        <motion.section initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="rounded-3xl border border-border bg-card p-8 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-gradient-gold grid place-items-center shadow-gold">
            <Check className="h-8 w-8 text-primary-foreground" strokeWidth={3} />
          </div>
          <h2 className="mt-4 font-display text-3xl">Seu pedido está a caminho da cozinha</h2>
          <p className="mt-2 text-muted-foreground">Enviamos os detalhes para o WhatsApp da loja. Você pode acompanhar aqui em tempo real.</p>
          <a
            href={`https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank" rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#25D366] text-white font-semibold shadow-lift hover:scale-[1.02] transition-transform"
          >
            <MessageCircle className="h-4 w-4" /> Abrir conversa no WhatsApp
          </a>
          <div className="mt-6">
            <Link to="/" className="text-sm text-primary hover:underline">Voltar ao início</Link>
          </div>
        </motion.section>
      )}

      {/* Resumo */}
      <section className="mt-8 rounded-3xl border border-border bg-card p-5">
        <h3 className="font-display text-lg mb-3">Itens do pedido</h3>
        <ul className="space-y-2 text-sm">
          {order.items.map((i, idx) => (
            <li key={idx} className="flex justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate">{i.quantity}× {i.name}</div>
                {i.addons?.length > 0 && <div className="text-xs text-muted-foreground">+ {i.addons.join(" · ")}</div>}
              </div>
              <span className="text-muted-foreground">{formatBRL(i.unitPrice * i.quantity)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
