import ProductGrid from "@/components/product/ProductGrid";
import { products } from "@/lib/data/products";

export default function LicensedPage() {
  const licensedProducts = products.filter(p => p.creator);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container py-12">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            Produtos Licenciados
          </h1>
          <p className="text-gray-500">
            {licensedProducts.length} produto{licensedProducts.length !== 1 ? 's' : ''} encontrado{licensedProducts.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="container py-8">
        {licensedProducts.length > 0 ? (
          <ProductGrid products={licensedProducts} />
        ) : (
          <div className="bg-white rounded-2xl p-16 text-center">
            <p className="text-gray-500 text-lg">Nenhum produto licenciado disponível no momento.</p>
            <p className="text-gray-400 text-sm mt-2">Em breve novas parcerias!</p>
          </div>
        )}
      </div>
    </div>
  );
}
