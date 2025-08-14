"use client";

import { addToCart } from "@/lib/cart";

type Product = {
  nome: string;
  valor: number;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col gap-4">
      <div className="w-full aspect-[4/3] bg-gray-100 rounded-lg grid place-items-center text-gray-400">
        Imagem do produto
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-medium text-gray-800 leading-snug">
          {product.nome}
        </h3>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-semibold text-gray-900">
          ${product.valor}
        </span>
        <button
          className="px-4 py-2 bg-black text-white rounded-md text-sm hover:bg-gray-200 hover:text-black transition-colors duration-200"
          onClick={() => addToCart({ nome: product.nome, valor: product.valor })}
        >
          Adicionar ao carrinho
        </button>
      </div>
    </div>
  );
}
