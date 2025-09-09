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
  // Buyer and address form state
  const [buyer, setBuyer] = useState({
    nome: "",
    email: "",
    telefone: "",
  });
  const [address, setAddress] = useState({
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showSummary, setShowSummary] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [bonusCard, setBonusCard] = useState("");

  useEffect(() => {
    setItems(getCart());
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.valor * i.qty, 0),
    [items]
  );

  const requiredFields = [
    "buyer.nome",
    "address.cep",
    "address.endereco",
    "address.numero",
    "address.cidade",
    "address.estado",
  ];

  const isValid = useMemo(() => {
    const hasValue = (v: string) => v.trim().length > 0;
    return (
      hasValue(buyer.nome) &&
      hasValue(address.cep) &&
      hasValue(address.endereco) &&
      hasValue(address.numero) &&
      hasValue(address.cidade) &&
      hasValue(address.estado)
    );
  }, [buyer.nome, address.cep, address.endereco, address.numero, address.cidade, address.estado]);

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

  const markAllTouched = () => {
    const all: Record<string, boolean> = {};
    requiredFields.forEach((k) => (all[k] = true));
    setTouched((prev) => ({ ...prev, ...all }));
  };

  const fieldError = (key: string) => {
    const [scope, prop] = key.split(".");
    const value = scope === "buyer" ? (buyer as any)[prop] : (address as any)[prop];
    const required = requiredFields.includes(key);
    if (!required) return "";
    if (!touched[key]) return "";
    return String(value || "").trim() ? "" : "Campo obrigatório";
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

          {/* Right - Address / Summary */}
          <aside className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
              {!showSummary ? (
                <>
                  <h2 className="text-base font-semibold text-gray-900">Dados do comprador</h2>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Nome completo *</label>
                      <input
                        value={buyer.nome}
                        onChange={(e) => setBuyer({ ...buyer, nome: e.target.value })}
                        onBlur={() => setTouched((t) => ({ ...t, ["buyer.nome"]: true }))}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black"
                      />
                      {fieldError("buyer.nome") && (
                        <p className="mt-1 text-xs text-red-600">{fieldError("buyer.nome")}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Email</label>
                        <input
                          type="email"
                          value={buyer.email}
                          onChange={(e) => setBuyer({ ...buyer, email: e.target.value })}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Telefone</label>
                        <input
                          value={buyer.telefone}
                          onChange={(e) => setBuyer({ ...buyer, telefone: e.target.value })}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black"
                        />
                      </div>
                    </div>
                  </div>

                  <h3 className="text-base font-semibold text-gray-900">Endereço de entrega</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">CEP *</label>
                      <input
                        value={address.cep}
                        onChange={(e) => setAddress({ ...address, cep: e.target.value })}
                        onBlur={() => setTouched((t) => ({ ...t, ["address.cep"]: true }))}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black"
                        placeholder="00000-000"
                      />
                      {fieldError("address.cep") && (
                        <p className="mt-1 text-xs text-red-600">{fieldError("address.cep")}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Endereço (Rua, Av.) *</label>
                      <input
                        value={address.endereco}
                        onChange={(e) => setAddress({ ...address, endereco: e.target.value })}
                        onBlur={() => setTouched((t) => ({ ...t, ["address.endereco"]: true }))}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black"
                      />
                      {fieldError("address.endereco") && (
                        <p className="mt-1 text-xs text-red-600">{fieldError("address.endereco")}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Número *</label>
                        <input
                          value={address.numero}
                          onChange={(e) => setAddress({ ...address, numero: e.target.value })}
                          onBlur={() => setTouched((t) => ({ ...t, ["address.numero"]: true }))}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black"
                        />
                        {fieldError("address.numero") && (
                          <p className="mt-1 text-xs text-red-600">{fieldError("address.numero")}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Complemento</label>
                        <input
                          value={address.complemento}
                          onChange={(e) => setAddress({ ...address, complemento: e.target.value })}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Bairro</label>
                      <input
                        value={address.bairro}
                        onChange={(e) => setAddress({ ...address, bairro: e.target.value })}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Cidade *</label>
                        <input
                          value={address.cidade}
                          onChange={(e) => setAddress({ ...address, cidade: e.target.value })}
                          onBlur={() => setTouched((t) => ({ ...t, ["address.cidade"]: true }))}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black"
                        />
                        {fieldError("address.cidade") && (
                          <p className="mt-1 text-xs text-red-600">{fieldError("address.cidade")}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Estado (UF) *</label>
                        <input
                          value={address.estado}
                          onChange={(e) => setAddress({ ...address, estado: e.target.value })}
                          onBlur={() => setTouched((t) => ({ ...t, ["address.estado"]: true }))}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black"
                          placeholder="SP, RJ, ..."
                        />
                        {fieldError("address.estado") && (
                          <p className="mt-1 text-xs text-red-600">{fieldError("address.estado")}</p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (!isValid) {
                          markAllTouched();
                          return;
                        }
                        setShowSummary(true);
                      }}
                      className={`w-full mt-2 rounded-md py-3 cursor-pointer disabled:opacity-60 ${
                        isValid ? "bg-black text-white" : "bg-gray-300 text-gray-600"
                      }`}
                      disabled={!isValid}
                    >
                      Continuar Compra
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-base font-semibold text-gray-900 mb-4">Resumo do Pedido</h2>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Cupom de desconto</label>
                      <input
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black"
                      />
                    </div>
                    
                    <div className="pt-2 space-y-2 text-sm">
                      <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
                      <Row label="Impostos Estimados" value="$50" />
                      <Row label="Frete e Manuseio Estimados" value="$29" />
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
                    <button
                      type="button"
                      onClick={() => setShowSummary(false)}
                      className="w-full mt-2 rounded-md py-3 border border-gray-300 text-sm text-gray-800 hover:bg-gray-100"
                    >
                      Editar endereço
                    </button>
                  </div>
                </>
              )}
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
