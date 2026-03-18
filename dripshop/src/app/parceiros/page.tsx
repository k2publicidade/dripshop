import Link from "next/link";
import { creators } from "@/lib/data/categories";
import { CheckCircle } from "lucide-react";

export default function ParceirosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container py-12">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            Artistas Parceiros
          </h1>
          <p className="text-gray-500">
            {creators.length} artista{creators.length !== 1 ? 's' : ''} cadastrado{creators.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {creators.map((creator) => (
            <Link
              key={creator.id}
              href={`/artista/${creator.slug}`}
              className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {creator.image ? (
                    <img
                      src={creator.image}
                      alt={creator.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-gray-500">
                      {creator.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 truncate" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                      {creator.name}
                    </h3>
                    {creator.verified && (
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    )}
                  </div>
                  <span className="text-sm text-primary font-medium group-hover:underline">
                    Ver coleção →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
