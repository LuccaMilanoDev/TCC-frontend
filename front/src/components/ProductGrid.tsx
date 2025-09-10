import ProductCard from "@/components/ProductCard";
import { isVisualUser } from "@/lib/flags";

type Product = {
  nome: string;
  valor: number;
  imagem: string;
};

export default function ProductGrid({ products }: { products: Product[] }) {
  const visual = isVisualUser();
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${visual ? "gap-x-10 gap-y-3 md:justify-items-end skew-y-1" : "gap-6"}`}>
      {products.map((p, idx) => (
        <div key={idx} className={`${visual ? (idx % 2 === 0 ? "-mt-2" : "mt-4") : ""}`}>
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}
