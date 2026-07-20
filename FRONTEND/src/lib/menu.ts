import batataP from "@/assets/batata-p.jpg";
import batataM from "@/assets/batata-m.jpg";
import batataG from "@/assets/batata-g.jpg";
import salgados from "@/assets/salgados.jpg";
import sucoCupuacu from "@/assets/suco-cupuacu.jpg";

export type PotatoSize = "P" | "M" | "G";

export type Addon = { id: string; name: string; price: number };

export const ADDONS: Addon[] = [
  { id: "bacon", name: "Bacon Crocante", price: 6 },
  { id: "frango", name: "Frango Desfiado", price: 6 },
  { id: "calabresa", name: "Calabresa Defumada", price: 5 },
  { id: "cheddar-extra", name: "Cheddar Extra", price: 5 },
];

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "batatas" | "salgados" | "bebidas";
  size?: PotatoSize;
  customizable?: boolean;
  tag?: string;
};

export const BATATAS: Product[] = [
  {
    id: "batata-p",
    name: "Batata P",
    description: "Porção individual dourada, sequinha por fora e macia por dentro.",
    price: 30,
    image: batataP,
    category: "batatas",
    size: "P",
    customizable: true,
  },
  {
    id: "batata-m",
    name: "Batata M",
    description: "A queridinha da casa. Cheddar cremoso escorrendo por cada tira.",
    price: 45,
    image: batataM,
    category: "batatas",
    size: "M",
    customizable: true,
    tag: "Mais pedida",
  },
  {
    id: "batata-g",
    name: "Batata G",
    description: "A coroação. Recheio farto de cheddar, bacon, frango e calabresa.",
    price: 60,
    image: batataG,
    category: "batatas",
    size: "G",
    customizable: true,
    tag: "Premium",
  },
];

export const SALGADOS: Product[] = [
  { id: "past-carne", name: "Pastel de Carne", description: "Massa fininha e recheio suculento de carne temperada.", price: 12, image: salgados, category: "salgados" },
  { id: "past-queijo", name: "Pastel de Queijo", description: "Mussarela derretida na medida certa.", price: 11, image: salgados, category: "salgados" },
  { id: "past-frango", name: "Pastel de Frango", description: "Frango cremoso com toque de catupiry.", price: 12, image: salgados, category: "salgados" },
  { id: "past-misto", name: "Pastel Misto", description: "Presunto e queijo derretido, clássico irresistível.", price: 12, image: salgados, category: "salgados" },
  { id: "past-banana", name: "Pastel de Banana", description: "Banana caramelizada com açúcar e canela.", price: 11, image: salgados, category: "salgados" },
  { id: "past-qc", name: "Pastel Queijo com Carne", description: "Dois recheios nobres numa massa só.", price: 14, image: salgados, category: "salgados" },
  { id: "croquete", name: "Croquete", description: "Crocante por fora, macio por dentro.", price: 6, image: salgados, category: "salgados" },
  { id: "enroladinho", name: "Enroladinho de Salsicha", description: "Massa dourada envolvendo salsicha suculenta.", price: 7, image: salgados, category: "salgados" },
];

export const BEBIDAS: Product[] = [
  { id: "coca", name: "Coca-Cola Lata", description: "350ml gelada.", price: 7, image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&q=80&auto=format&fit=crop", category: "bebidas", tag: "Refrigerante" },
  { id: "guarana", name: "Guaraná Antarctica", description: "350ml sabor brasileiro.", price: 7, image: "https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=800&q=80&auto=format&fit=crop", category: "bebidas", tag: "Refrigerante" },
  { id: "fanta", name: "Fanta Laranja", description: "350ml refrescante.", price: 7, image: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=800&q=80&auto=format&fit=crop", category: "bebidas", tag: "Refrigerante" },
  { id: "agua", name: "Água Mineral", description: "500ml sem gás.", price: 4, image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&q=80&auto=format&fit=crop", category: "bebidas", tag: "Água" },
  { id: "coca-1l", name: "Refrigerante 1L", description: "Perfeito pra dividir.", price: 12, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80&auto=format&fit=crop", category: "bebidas", tag: "Refrigerante" },
  { id: "coca-2l", name: "Refrigerante 2L", description: "Pra família toda.", price: 15, image: "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=800&q=80&auto=format&fit=crop", category: "bebidas", tag: "Refrigerante" },
  { id: "suco-cupuacu", name: "Suco de Cupuaçu", description: "Cremoso e amazônico. Puro sabor da floresta.", price: 12, image: sucoCupuacu, category: "bebidas", tag: "Suco Amazônico" },
  { id: "suco-maracuja", name: "Suco de Maracujá", description: "Fresco, batido na hora.", price: 10, image: "https://images.unsplash.com/photo-1622597467836-f3e6707e1191?w=800&q=80&auto=format&fit=crop", category: "bebidas", tag: "Suco" },
  { id: "suco-laranja", name: "Suco de Laranja", description: "Espremida na hora.", price: 10, image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&q=80&auto=format&fit=crop", category: "bebidas", tag: "Suco" },
  { id: "suco-taperebá", name: "Suco de Taperebá", description: "O sabor tropical do Norte.", price: 12, image: "https://images.unsplash.com/photo-1546171753-97d7676e4602?w=800&q=80&auto=format&fit=crop", category: "bebidas", tag: "Suco Amazônico" },
];

export const ALL_PRODUCTS = [...BATATAS, ...SALGADOS, ...BEBIDAS];

export const findProduct = (id: string) => ALL_PRODUCTS.find((p) => p.id === id);
