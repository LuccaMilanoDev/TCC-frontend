"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartItem, getCart, updateQty, removeFromCart } from "@/lib/cart";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setItems(getCart());
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.valor * i.qty, 0),
    [items]
  );

  const onDec = (nome: string) => {
    const next = items.map((i) =>
      i.nome === nome ? { ...i, qty: Math.max(1, i.qty - 1) } : i
    );
    setItems(next);
    const it = next.find((i) => i.nome === nome);
    if (it) updateQty(nome, it.qty);
  };

  const onInc = (nome: string) => {
    const next = items.map((i) => (i.nome === nome ? { ...i, qty: i.qty + 1 } : i));
    setItems(next);
    const it = next.find((i) => i.nome === nome);
    if (it) updateQty(nome, it.qty);
  };

  const onRemove = (nome: string) => {
    const next = items.filter((i) => i.nome !== nome);
    setItems(next);
    removeFromCart(nome);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {loading && <Loading text="Finalizando compra..." />}

      {/* Gray background to indicate current page */}
      <main className="flex-1 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Item list */}
          <section className="lg:col-span-2">
            <h1 className="text-xl font-semibold text-gray-900 mb-6">Shopping Cart</h1>

            {items.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-600">
                Seu carrinho está vazio.
              </div>
            ) : (
              <ul className="bg-white border border-gray-200 rounded-lg divide-y">
                {items.map((i) => (
                  <li key={i.nome} className="p-5 flex items-center gap-4">
                    <div className="w-16 h-16 rounded bg-gray-100 flex items-center justify-center">
                      <img 
                        src={getProductImage(i.nome)} 
                        alt={i.nome}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{i.nome}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onDec(i.nome)}
                        className="w-8 h-8 grid place-items-center rounded border border-gray-300 text-gray-700"
                        aria-label="Diminuir quantidade"
                      >
                        –
                      </button>
                      <span className="w-8 text-center text-black font-medium">{i.qty}</span>
                      <button
                        onClick={() => onInc(i.nome)}
                        className="w-8 h-8 grid place-items-center rounded border border-gray-300 text-gray-700"
                        aria-label="Aumentar quantidade"
                      >
                        +
                      </button>
                    </div>
                    <div className="w-24 text-right font-semibold text-black">${subtotalItem(i)}</div>
                    <button
                      onClick={() => onRemove(i.nome)}
                      className="ml-4 text-gray-400 hover:text-gray-600"
                      aria-label="Remover"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Right - Summary */}
          <aside className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Discount code / Promo code</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Your bonus card number</label>
                  <div className="flex gap-2">
                    <input className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-black" />
                    <button className="px-3 py-2 rounded-md border border-gray-300 text-sm">Apply</button>
                  </div>
                </div>
                <div className="pt-2 space-y-2 text-sm">
                  <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
                  <Row label="Estimated Tax" value="$50" />
                  <Row label="Estimated shipping & Handling" value="$29" />
                  <div className="h-px bg-gray-200 my-2" />
                  <Row label="Total" value={`$${(subtotal + 50 + 29).toFixed(2)}`} strong />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (items.length === 0) {
                      alert("Seu carrinho está vazio. Adicione itens antes de finalizar a compra.");
                      return;
                    }
                    setLoading(true);
                    // Opcional: pequeno atraso para garantir renderização do overlay antes da navegação
                    setTimeout(() => {
                      router.push("/success");
                    }, 50);
                  }}
                  aria-label="Finalizar compra"
                  className="w-full mt-4 bg-black text-white rounded-md py-3 cursor-pointer disabled:opacity-60"
                  disabled={loading}
                >
                  {loading ? "Processando..." : "Finalizar compra"}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-gray-700 ${strong ? "font-semibold" : ""}`}>{label}</span>
      <span className={`text-gray-900 ${strong ? "font-semibold" : ""}`}>{value}</span>
    </div>
  );
}

function subtotalItem(i: CartItem) {
  return (i.valor * i.qty).toFixed(2);
}

function getProductImage(productName: string): string {
  // Map product names to their corresponding images
  const imageMap: { [key: string]: string } = {
    'Camisa': '/camisa.png',
    'Casaco': '/casaco.png',
    'Mochila': '/mochila.png',
    'Relógio': '/relogio.png',
    'iPhone': '/iphone.png',
  };
  
  // Find matching product (case insensitive partial match)
  const foundKey = Object.keys(imageMap).find(key => 
    productName.toLowerCase().includes(key.toLowerCase()) || 
    key.toLowerCase().includes(productName.toLowerCase())
  );
  
  return foundKey ? imageMap[foundKey] : '/camisa.png'; // Default fallback
}
