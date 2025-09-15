"use client";

import { addToCart, getCart, removeFromCart } from "@/lib/cart";
import Image from "next/image";
import { isProblemUser, isPerformanceUser, isVisualUser } from "@/lib/flags";
import { useEffect, useState } from "react";
type Product = {
  nome: string;
  valor: number;
  imagem: string;
};

export default function ProductCard({ product }: { product: Product }) {
  const problem = isProblemUser();
  const performance = isPerformanceUser();
  const visual = isVisualUser();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  // Performance problem: Delay image loading artificially for performance_user
  useEffect(() => {
    if (performance) {
      // Simulate late lazy loading with artificial delay
      const timer = setTimeout(() => {
        setImageLoaded(true);
      }, Math.random() * 2000 + 1000); // Random delay between 1-3 seconds
      return () => clearTimeout(timer);
    } else {
      setImageLoaded(true);
    }
  }, [performance]);

  // Initialize and keep track if product is in cart
  useEffect(() => {
    const checkInCart = () => {
      try {
        const items = getCart();
        setIsInCart(items.some((i) => i.nome === product.nome));
      } catch {
        setIsInCart(false);
      }
    };

    // Initial check
    checkInCart();

    // Listen to global cart updates
    const onUpdate = () => checkInCart();
    if (typeof window !== "undefined") {
      window.addEventListener("cart:updated", onUpdate as EventListener);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("cart:updated", onUpdate as EventListener);
      }
    };
  }, [product.nome]);

  return (
    <div className={`bg-white rounded-xl border ${visual ? "border-red-200" : "border-gray-200"} shadow-sm p-5 flex flex-col gap-4 ${visual ? "relative" : ""}`}>
      <div className={`w-full ${visual ? "aspect-[1/1]" : "aspect-[4/3]"} bg-gray-100 rounded-lg relative overflow-hidden ${visual ? "-mx-2" : ""}`}>
      {!problem ? (
        performance && !imageLoaded ? (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            Carregando...
          </div>
        ) : (
          <Image
            src={visual ? "/camisa.png" : product.imagem}
            alt={visual ? `${product.nome} (imagem trocada)` : product.nome}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`${visual ? "object-cover scale-125 -translate-x-2" : "object-contain"}`}
            priority={!performance}
            loading={performance ? "lazy" : "eager"}
          />
        )
      ): null}
      </div>
      <div className={`flex-1 ${visual ? "order-2" : ""}`}>
        <h3 className={`text-sm font-medium ${visual ? "text-red-700 tracking-wide" : "text-gray-800"} leading-snug ${visual ? "text-right" : ""}`}>
          {product.nome}
        </h3>
      </div>
      <div className={`flex items-center justify-between ${visual ? "order-1 -mt-2" : ""}`}>
        <span className={`text-2xl font-semibold ${visual ? "text-red-800 absolute top-2 right-3" : "text-gray-900"}`}>
          ${product.valor}
        </span>
        <button
          className={`px-4 py-2 rounded-md text-sm transition-colors duration-200 cursor-pointer ${
            isInCart
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-black text-white hover:bg-gray-200 hover:text-black"
          } ${visual ? "order-2" : ""}`}
          onClick={() => {
            if (isInCart) {
              removeFromCart(product.nome);
            } else {
              addToCart({ nome: product.nome, valor: product.valor, imagem: product.imagem });
            }
            // UI will update via cart:updated event
          }}
        >
          {isInCart ? "Remover do carrinho" : "Adicionar ao carrinho"}
        </button>
      </div>
    </div>
  );
}


