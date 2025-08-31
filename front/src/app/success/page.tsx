"use client";

import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { clearCart } from "@/lib/cart";
import Link from "next/link";

export default function SuccessPage() {
  useEffect(() => {
    // Limpa o carrinho ao carregar a página de sucesso
    clearCart();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-black mb-6">
            Obrigado pela sua compra!
          </h1>
          <div className="text-5xl mb-4">✅</div>
          <p className="text-gray-700 mb-8">
            Seu pedido foi processado com sucesso e em breve será despachado.
          </p>
          <Link
            href="/home"
            className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
          >
            Voltar para o Início
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
