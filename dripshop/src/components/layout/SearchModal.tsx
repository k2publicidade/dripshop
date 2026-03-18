"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { products as staticProducts } from "@/lib/data/products";
import Link from "next/link";

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  
  const results = useMemo(() => {
    if (query.length < 2) return [];
    const searchTerm = query.toLowerCase();
    return staticProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm) ||
        p.collection?.toLowerCase().includes(searchTerm)
    ).slice(0, 6);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/busca?q=${encodeURIComponent(query)}`);
      onClose();
      setQuery("");
    }
  };

  const handleResultClick = (slug: string) => {
    router.push(`/produto/${slug}`);
    onClose();
    setQuery("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative pt-20 px-4">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar produtos..."
              className="w-full pl-14 pr-14 py-4 bg-white rounded-2xl shadow-2xl text-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              autoFocus
            />
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </form>

          {results.length > 0 && (
            <div className="mt-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
              {results.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleResultClick(product.slug)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={product.images[0] || "/mockup.jpg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{product.category}</p>
                  </div>
                  <div className="text-right">
                    {product.originalPrice && product.originalPrice > product.price ? (
                      <>
                        <span className="font-bold text-gray-900">
                          R$ {product.price.toFixed(2).replace(".", ",")}
                        </span>
                        <span className="block text-xs text-gray-400 line-through">
                          R$ {product.originalPrice.toFixed(2).replace(".", ",")}
                        </span>
                      </>
                    ) : (
                      <span className="font-bold text-gray-900">
                        R$ {product.price.toFixed(2).replace(".", ",")}
                      </span>
                    )}
                  </div>
                </button>
              ))}
              <Link
                href={`/busca?q=${encodeURIComponent(query)}`}
                onClick={onClose}
                className="block p-4 text-center text-primary font-medium hover:bg-gray-50 border-t"
              >
                Ver todos os resultados →
              </Link>
            </div>
          )}

          {query.length >= 2 && results.length === 0 && (
            <div className="mt-4 bg-white rounded-2xl shadow-2xl p-8 text-center">
              <p className="text-gray-500">Nenhum produto encontrado para &quot;{query}&quot;</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
