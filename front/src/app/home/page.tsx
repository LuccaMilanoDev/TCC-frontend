"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import products from "@/app/mock-data.json";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-black via-zinc-800 to-zinc-400">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white/90 text-lg font-medium">Selecionar Produtos:</h2>
            <div>
              <button className="inline-flex items-center gap-2 bg-white text-gray-800 px-3 py-2 rounded-md text-sm">
                Nome A-Z <span>▾</span>
              </button>
            </div>
          </div>

          <ProductGrid products={products} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
