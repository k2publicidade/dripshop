import Link from "next/link";
import { collections } from "@/lib/data/categories";

export default function ColecoesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container py-12">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            Todas as Coleções
          </h1>
          <p className="text-gray-500">
            {collections.length} coleção{collections.length !== 1 ? 's' : ''} disponível{collections.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/colecao/${collection.slug}`}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden">
                {collection.image ? (
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                      {collection.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  {collection.name}
                </h2>
                {collection.description && (
                  <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                    {collection.description}
                  </p>
                )}
                <span className="inline-block mt-4 text-sm font-medium text-primary group-hover:translate-x-1 transition-transform">
                  Ver coleção →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
