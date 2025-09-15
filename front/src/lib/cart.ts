// Simple cookie-based cart utilities
// Cookie key
const CART_KEY = "cart";

export type CartItem = {
  nome: string;
  valor: number;
  qty: number;
  imagem?: string;
};

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(name + "="));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

function writeCookie(name: string, value: string, days = 30) {
  if (typeof document === "undefined") return;
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + d.toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/`;
}

export function getCart(): CartItem[] {
  try {
    const raw = readCookie(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as CartItem[];
  } catch {
    return [];
  }
}

export function setCart(items: CartItem[]) {
  writeCookie(CART_KEY, JSON.stringify(items));
  // Notify listeners that the cart has been updated
  if (typeof window !== "undefined") {
    const count = items.reduce((sum, i) => sum + (i?.qty ?? 0), 0);
    window.dispatchEvent(new CustomEvent("cart:updated", { detail: { count } }));
  }
}

export function addToCart(item: { nome: string; valor: number; imagem?: string }, qty = 1) {
  const cart = getCart();
  const idx = cart.findIndex((i) => i.nome === item.nome);
  if (idx >= 0) {
    cart[idx].qty += qty;
    // Preserve existing image, but if it was missing and now provided, set it
    if (!cart[idx].imagem && item.imagem) {
      cart[idx].imagem = item.imagem;
    }
  } else {
    cart.push({ nome: item.nome, valor: item.valor, qty, imagem: item.imagem });
  }
  setCart(cart);
}

export function updateQty(nome: string, qty: number) {
  const cart = getCart();
  const idx = cart.findIndex((i) => i.nome === nome);
  if (idx >= 0) {
    cart[idx].qty = Math.max(1, qty);
    setCart(cart);
  }
}

export function removeFromCart(nome: string) {
  const cart = getCart().filter((i) => i.nome !== nome);
  setCart(cart);
}

export function clearCart() {
  setCart([]);
}

export function getCartCount(): number {
  try {
    return getCart().reduce((sum, i) => sum + (i?.qty ?? 0), 0);
  } catch {
    return 0;
  }
}
