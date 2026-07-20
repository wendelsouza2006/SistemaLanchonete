import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Sandwich, CupSoda, MapPin, ShoppingBag, User, Crown } from "lucide-react";
import type { ReactNode } from "react";
import logo from "@/assets/logo-baroes.png";
import { useCart } from "@/lib/cart";

const NAV = [
  { to: "/", label: "Início", icon: Home },
  { to: "/batatas", label: "Batatas", icon: Crown },
  { to: "/salgados", label: "Salgados", icon: Sandwich },
  { to: "/bebidas", label: "Bebidas", icon: CupSoda },
  { to: "/carrinho", label: "Carrinho", icon: ShoppingBag, badge: true },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { count } = useCart();

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Desktop top bar */}
      <header className="hidden lg:block sticky top-0 z-40 border-b border-border/60 backdrop-blur-xl bg-background/70">
        <div className="mx-auto max-w-7xl px-8 h-20 flex items-center gap-10">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logo} alt="Barões da Batata" className="h-11 w-11 drop-shadow-[0_0_20px_oklch(0.83_0.17_88/0.4)] group-hover:scale-110 transition-transform" width={512} height={512} />
            <div className="leading-none">
              <div className="font-display text-xl tracking-wide text-gradient-gold">Barões da Batata</div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-1">O sabor da nobreza</div>
            </div>
          </Link>
          <nav className="flex items-center gap-1 ml-4">
            {NAV.map((n) => {
              const active = pathname === n.to || (n.to !== "/" && pathname.startsWith(n.to));
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${active ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {n.label}
                  {active && (
                    <motion.div layoutId="nav-pill" className="absolute inset-0 rounded-full bg-primary/10 border border-primary/30 -z-10" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <Link to="/carrinho" className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-gold text-primary-foreground font-semibold text-sm shadow-gold hover:scale-[1.03] active:scale-[0.98] transition-transform">
              <ShoppingBag className="h-4 w-4" />
              Carrinho
              {count > 0 && <span className="ml-1 min-w-6 h-6 px-1.5 rounded-full bg-ink text-primary text-xs grid place-items-center font-bold">{count}</span>}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile top brand */}
      <header className="lg:hidden sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/60">
        <div className="px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-9 w-9" width={64} height={64} />
            <div className="leading-tight">
              <div className="font-display text-base text-gradient-gold">Barões da Batata</div>
              <div className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">O sabor da nobreza</div>
            </div>
          </Link>
          <Link to="/carrinho" className="relative h-10 w-10 grid place-items-center rounded-full bg-secondary border border-border">
            <ShoppingBag className="h-4 w-4 text-primary" />
            {count > 0 && <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-primary text-primary-foreground text-[10px] grid place-items-center font-bold">{count}</span>}
          </Link>
        </div>
      </header>

      <main className="pb-28 lg:pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 pb-[env(safe-area-inset-bottom)]">
        <div className="mx-3 mb-3 rounded-2xl border border-border bg-popover/90 backdrop-blur-xl shadow-lift">
          <ul className="grid grid-cols-5">
            {NAV.map((n) => {
              const active = pathname === n.to || (n.to !== "/" && pathname.startsWith(n.to));
              const Icon = n.icon;
              return (
                <li key={n.to}>
                  <Link
                    to={n.to}
                    className={`relative flex flex-col items-center justify-center gap-1 py-3 text-[10px] font-medium transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}
                  >
                    {active && <motion.span layoutId="mobile-nav-dot" className="absolute -top-0.5 h-1 w-8 rounded-full bg-gradient-gold" />}
                    <div className="relative">
                      <Icon className="h-5 w-5" />
                      {n.badge && count > 0 && (
                        <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-primary text-primary-foreground text-[9px] grid place-items-center font-bold">{count}</span>
                      )}
                    </div>
                    <span>{n.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </div>
  );
}

// Extra icons for footer/account (not part of primary nav)
export { MapPin, User };
