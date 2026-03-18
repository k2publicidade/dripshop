import ProductGrid from "@/components/product/ProductGrid";
import { getProductsByCollection, products } from "@/lib/data/products";
import { collections } from "@/lib/data/categories";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return collections.map((collection) => ({
    slug: collection.slug,
  }));
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params;
  const collectionProducts = getProductsByCollection(slug);
  const collection = collections.find((c) => c.slug === slug);

  if (!collection) {
    notFound();
  }

  return (
    <div className="container py-8">
      <div className="mb-12 border-b border-black pb-4">
        <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
          {collection.name}
        </h1>
        <p className="text-gray-500 mt-2 font-bold uppercase tracking-widest text-xs">
          {collectionProducts.length} produto(s) encontrado(s)
        </p>
      </div>

      {collectionProducts.length > 0 ? (
        <ProductGrid products={collectionProducts} />
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">Nenhum produto encontrado nesta coleção.</p>
          <p className="text-gray-400 mt-2">Em breve novos produtos!</p>
        </div>
      )}
    </div>
  );
}
