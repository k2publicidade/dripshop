import ProductGrid from "@/components/product/ProductGrid";
import { products } from "@/lib/data/products";
import { creators } from "@/lib/data/categories";
import { notFound } from "next/navigation";
import { CheckCircle } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return creators.map((creator) => ({
    slug: creator.slug,
  }));
}

export default async function ArtistaPage({ params }: PageProps) {
  const { slug } = await params;
  const creator = creators.find((c) => c.slug === slug);

  if (!creator) {
    notFound();
  }

  const creatorProducts = products.filter((p) => p.creator === slug);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container py-12">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {creator.image ? (
                <img
                  src={creator.image}
                  alt={creator.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-gray-500">
                  {creator.name.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl lg:text-4xl font-bold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  {creator.name}
                </h1>
                {creator.verified && (
                  <CheckCircle className="w-6 h-6 text-primary" />
                )}
              </div>
              <p className="text-gray-500 mt-1">
                {creatorProducts.length} produto{creatorProducts.length !== 1 ? 's' : ''} disponível{creatorProducts.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {creatorProducts.length > 0 ? (
          <ProductGrid products={creatorProducts} />
        ) : (
          <div className="bg-white rounded-2xl p-16 text-center">
            <p className="text-gray-500 text-lg">Nenhum produto deste artista disponível no momento.</p>
            <p className="text-gray-400 text-sm mt-2">Em breve novas peças!</p>
          </div>
        )}
      </div>
    </div>
  );
}
