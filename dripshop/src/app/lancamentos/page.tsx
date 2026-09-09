import ProductGrid from "@/components/product/ProductGrid";
import { getCatalog } from "@/lib/catalog";

export default async function LancamentosPage() {
  const products = await getCatalog();
  const newProducts = products.filter(p => p.isNew);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container py-12">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2" style={{ fontFamily: "Manrope, sans-serif" }}>
            Lançamentos
          </h1>
          <p className="text-gray-500">
            {newProducts.length} novo{newProducts.length !== 1 ? 's' : ''} produto{newProducts.length !== 1 ? 's' : ''} encontrado{newProducts.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="container py-8">
        {newProducts.length > 0 ? (
          <ProductGrid products={newProducts} />
        ) : (
          <div className="bg-white rounded-2xl p-16 text-center">
            <p className="text-gray-500 text-lg">Nenhum lançamento disponível no momento.</p>
            <p className="text-gray-400 text-sm mt-2">Em breve novas peças!</p>
          </div>
        )}
      </div>
    </div>
  );
}

