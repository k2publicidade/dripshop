import ProductGrid from "@/components/product/ProductGrid";
import { products as staticProducts } from "@/lib/data/products";
import { Search } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function BuscaPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = q?.toLowerCase() || "";
  
  const results = staticProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.collection?.toLowerCase().includes(query)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container py-8">
          <div className="flex items-center gap-3 mb-2">
            <Search className="w-6 h-6 text-gray-400" />
            <h1 className="text-2xl lg:text-3xl font-bold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              Resultados para &quot;{q}&quot;
            </h1>
          </div>
          <p className="text-gray-500">
            {results.length} produto{results.length !== 1 ? "s" : ""} encontrado{results.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="container py-8">
        {results.length > 0 ? (
          <ProductGrid products={results} />
        ) : (
          <div className="bg-white rounded-2xl p-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500 text-lg">Nenhum produto encontrado.</p>
            <p className="text-gray-400 text-sm mt-2">Tente buscar por outro termo ou navegue pelas categorias.</p>
          </div>
        )}
      </div>
    </div>
  );
}
