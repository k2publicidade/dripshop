"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ArrowLeft, ArrowRight, ShoppingBag, Check, Tag } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice, formatInstallments } from "@/lib/utils";

export default function CarrinhoPage() {
    const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
    const total = getTotalPrice();
    const freeShipping = total >= 199;
    const freeShippingRemaining = 199 - total;

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="w-12 h-12 text-gray-300" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                        Seu carrinho está vazio
                    </h1>
                    <p className="text-gray-500 mb-6">Adicione produtos incríveis ao seu carrinho!</p>
                    <Link href="/" className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-3 transition-transform hover:scale-105">
                        <ArrowLeft className="w-5 h-5" /> Explorar produtos
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-100">
                <div className="container py-8">
                    <h1 className="text-4xl font-black uppercase tracking-tighter" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                        Meu Carrinho
                    </h1>
                    <p className="text-gray-500 mt-2 font-bold uppercase tracking-widest text-xs">{items.length} item{items.length !== 1 ? 's' : ''} no carrinho</p>
                </div>
            </div>

            <div className="container py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Items List */}
                    <div className="flex-1 space-y-4">
                        {!freeShipping && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
                                <Tag className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                                <p className="text-sm text-yellow-800">
                                    Faltam <strong>{formatPrice(freeShippingRemaining)}</strong> para ganhar{" "}
                                    <strong>frete grátis!</strong>
                                </p>
                            </div>
                        )}

                        {freeShipping && (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                                <p className="text-sm text-green-800 font-medium">
                                    Parabéns! Você ganhou <strong>frete grátis!</strong> 🎉
                                </p>
                            </div>
                        )}

                        {items.map((item, index) => (
                            <div
                                key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${index}`}
                                className="bg-white border border-gray-200 p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 relative group"
                            >
                                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 flex-shrink-0 overflow-hidden relative">
                                    <img
                                        src={item.product.images[0] || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200"}
                                        alt={item.product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-1 min-w-0 flex flex-col justify-between">
                                    <div className="pr-12">
                                        <Link href={`/produto/${item.product.slug}`} className="hover:underline">
                                            <h3 className="font-black uppercase text-base sm:text-lg line-clamp-2 text-black mb-1" style={{ fontFamily: "Space Grotesk, sans-serif" }}>{item.product.name}</h3>
                                        </Link>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 sm:mb-0 uppercase tracking-widest font-bold">
                                            <span>Tam: <span className="text-black">{item.selectedSize}</span></span>
                                            <span className="w-1 h-1 bg-gray-300 mx-1"></span>
                                            <span>Cor: <span className="text-black">{item.selectedColor}</span></span>
                                        </div>
                                    </div>

                                    <div className="flex flex-row items-center justify-between mt-auto">
                                        <div className="flex items-center bg-white border border-gray-200">
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                                                className="p-2 hover:bg-black hover:text-white transition-colors text-black"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="px-4 text-sm font-bold min-w-[40px] text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                                                className="p-2 hover:bg-black hover:text-white transition-colors text-black"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>

                                        <div className="text-right">
                                            {item.product.originalPrice && (
                                                <p className="text-xs font-bold text-gray-400 line-through mb-0.5">
                                                    {formatPrice(item.product.originalPrice * item.quantity)}
                                                </p>
                                            )}
                                            <p className="text-xl font-bold text-black">{formatPrice(item.product.price * item.quantity)}</p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => removeItem(item.product.id, item.selectedSize, item.selectedColor)}
                                    className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    title="Remover produto"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}

                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gray-600 hover:text-black font-bold mt-4 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Continuar comprando
                        </Link>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="w-full lg:w-96 flex-shrink-0">
                        <div className="bg-white border border-gray-200 p-8 sticky top-24 lg:top-36">
                            <h2 className="text-xl font-black uppercase tracking-tight mb-6" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                                Resumo do Pedido
                            </h2>

                            <div className="space-y-4 text-sm font-bold uppercase tracking-wide text-gray-600">
                                <div className="flex justify-between">
                                    <span>Subtotal ({items.length} {items.length === 1 ? "item" : "itens"})</span>
                                    <span className="text-black">{formatPrice(total)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Frete</span>
                                    <span className={`font-medium ${freeShipping ? "text-green-600" : ""}`}>
                                        {freeShipping ? "Grátis" : "Calcular no checkout"}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 my-4" />

                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-lg">Total</span>
                                <span className="font-bold text-2xl">{formatPrice(total)}</span>
                            </div>
                            <p className="text-sm text-gray-500 mb-6 font-medium">
                                {formatInstallments(total)}
                            </p>

                            <Link href="/checkout" className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]">
                                Finalizar Compra <ArrowRight className="w-5 h-5" />
                            </Link>

                            <div className="mt-6 flex flex-col gap-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><Check className="w-3 h-3 text-green-500" /> Compra 100% segura</span>
                                <span className="flex items-center gap-1"><Check className="w-3 h-3 text-green-500" /> Troca facilitada em até 30 dias</span>
                                <span className="flex items-center gap-1"><Check className="w-3 h-3 text-green-500" /> Parcelamento em até 6x sem juros</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
