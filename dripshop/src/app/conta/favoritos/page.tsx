"use client";

import Link from "next/link";
import { Heart, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

// Mock para demonstração
const mockFavorites = [
    {
        id: "1",
        name: "Camiseta Oversized Self-Data",
        price: 119.9,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        slug: "camiseta-oversized-self-data",
    },
    {
        id: "2",
        name: "Moletom Dark Mood com Capuz",
        price: 199.9,
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
        slug: "moletom-dark-mood-com-capuz",
    },
];

export default function FavoritosPage() {
    return (
        <div className="space-y-6">
            <div className="bg-white border border-gray-300 p-6 lg:p-8">
                <h1 className="text-2xl font-black uppercase tracking-widest mb-1" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                    Meus Favoritos
                </h1>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mb-8">Produtos que você salvou para depois</p>

                {mockFavorites.length === 0 ? (
                    <div className="bg-gray-50 border border-gray-200 p-12 text-center">
                        <div className="w-16 h-16 bg-white border border-gray-200 flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-6 h-6 text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-black uppercase tracking-widest mb-2">Sua lista está vazia</h2>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-8">Você ainda não favoritou nenhum produto.</p>
                        <Link href="/" className="btn-primary inline-flex px-8 py-3 text-xs font-bold uppercase tracking-widest">
                            Explorar Loja
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {mockFavorites.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white border-2 border-gray-200 overflow-hidden transition-all hover:border-black group"
                            >
                                <div className="flex gap-4 p-4">
                                    <div className="w-24 h-24 bg-gray-100 overflow-hidden flex-shrink-0">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div>
                                            <Link href={`/produto/${product.slug}`} className="hover:underline">
                                                <h3 className="font-black uppercase tracking-widest text-sm line-clamp-2 leading-snug">{product.name}</h3>
                                            </Link>
                                            <p className="text-lg font-black mt-1 text-black">{formatPrice(product.price)}</p>
                                        </div>

                                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                                            <button className="flex-1 btn-primary py-2 text-[10px] flex items-center justify-center gap-2">
                                                <ShoppingBag className="w-3.5 h-3.5" /> Adicionar
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-red-500 transition-all border border-gray-200 hover:border-red-500" title="Remover">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
