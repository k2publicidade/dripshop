"use client";

import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight, Check } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const total = getTotalPrice();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeCart} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-fade-in-up">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-xl font-bold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            Seu Carrinho ({items.length})
          </h2>
          <button onClick={closeCart} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="w-10 h-10 text-gray-300" />
              </div>
              <p className="text-gray-500 text-lg mb-2">Seu carrinho está vazio</p>
              <p className="text-gray-400 text-sm mb-6">Adicione produtos para continuar</p>
              <button
                onClick={closeCart}
                className="btn-primary"
              >
                Continuar Comprando
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${index}`} className="flex gap-4 p-4 bg-white border border-gray-200">
                  <div className="w-20 h-20 bg-gray-100 flex-shrink-0 overflow-hidden relative">
                    <img
                      src={item.product.images[0] || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200"}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-black line-clamp-2 uppercase" style={{ fontFamily: "Space Grotesk, sans-serif" }}>{item.product.name}</h3>
                      <p className="text-[11px] text-gray-500 mt-1 uppercase tracking-wider font-bold">
                        Tam: <span className="text-black">{item.selectedSize}</span> | Cor: <span className="text-black">{item.selectedColor}</span>
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-gray-200">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                          className="p-1.5 hover:bg-black hover:text-white transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-sm font-bold min-w-[32px] text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                          className="p-1.5 hover:bg-black hover:text-white transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-bold text-black">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id, item.selectedSize, item.selectedColor)}
                    className="self-start p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t p-5 bg-white">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-bold uppercase tracking-widest text-gray-500" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Subtotal</span>
              <span className="text-xl font-bold">{formatPrice(total)}</span>
            </div>
            <p className="text-[11px] font-bold text-gray-400 mb-6 uppercase tracking-wider">
              6x de {formatPrice(total / 6)} sem juros
            </p>

            <Link href="/carrinho" onClick={closeCart} className="w-full btn-primary mb-3">
              Finalizar Compra
            </Link>
            <button
              onClick={closeCart}
              className="w-full text-center text-sm text-gray-600 hover:text-gray-900 py-2 flex items-center justify-center gap-2"
            >
              Continuar Comprando <ArrowRight className="w-4 h-4" />
            </button>

            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1"><Check className="w-3 h-3 text-green-500" /> Frete Grátis R$199</span>
              <span className="flex items-center gap-1"><Check className="w-3 h-3 text-green-500" /> Troca Facil</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
