import ProductGrid from "@/components/product/ProductGrid";
import { getCatalog } from "@/lib/catalog";

export default async function PromotionPage() {
  const products = await getCatalog();
  const saleProducts = products.filter(p => p.discount && p.discount > 0);

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold" style={{ fontFamily: "Dosis, sans-serif" }}>
          PROMOÇÕES
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          {saleProducts.length} produto(s) em promoção
        </p>
      </div>

      {saleProducts.length > 0 ? (
        <ProductGrid products={saleProducts} />
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500">Nenhum produto em promoção no momento.</p>
        </div>
      )}
    </div>
  );
}
