"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import products from "@/app/mock-data.json";
import Protected from "@/components/Protected";
import { isProblemUser } from "@/lib/flags";
import { useMemo, useState, type ChangeEvent } from "react";
import { useSearchParams } from "next/navigation";

export default function HomePage() {
  type Product = { nome: string; valor: number; imagem: string };
  type Sort = "name_asc" | "name_desc" | "price_asc" | "price_desc";
  const [sort, setSort] = useState<Sort>("name_asc");
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase().trim() || "";

  const filtered = useMemo(() => {
    let list = (products as Product[]).filter((p) =>
      p.nome.toLowerCase().includes(query)
    );
    const problem = isProblemUser();
    switch (sort) {
      case "name_asc":
        list = [...list].sort((a, b) => a.nome.localeCompare(b.nome));
        break;
      case "name_desc":
        list = [...list].sort((a, b) => b.nome.localeCompare(a.nome));
        break;
      case "price_asc":
        list = [...list].sort((a, b) => (problem ? b.valor - a.valor : a.valor - b.valor));
        break;
      case "price_desc":
        list = [...list].sort((a, b) => (problem ? a.valor - b.valor : b.valor - a.valor));
        break;
    }
    return list;
  }, [query, sort]);

  return (
    <Protected>
      <div className="min-h-screen flex flex-col bg-gradient-to-r from-black via-zinc-800 to-zinc-400">
        <Header />

        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
              <h2 className="text-white/90 text-lg font-medium">Selecionar Produtos:</h2>
              <div className="flex gap-2">
                <select
                  aria-label="Ordenação"
                  value={sort}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setSort(e.target.value as Sort)
                  }
                  className="bg-white text-gray-800 px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-gray-300"
                >
                  <option value="name_asc">Nome A-Z</option>
                  <option value="name_desc">Nome Z-A</option>
                  <option value="price_asc">Preço crescente</option>
                  <option value="price_desc">Preço decrescente</option>
                </select>
              </div>
            </div>

            <ProductGrid products={filtered} />
          </div>
        </main>

        <Footer />
      </div>
    </Protected>
  );
}
