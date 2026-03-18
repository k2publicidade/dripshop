"use client";

import Link from "next/link";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types";
import { useState } from "react";
import { useCartStore } from "@/store/cart";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addItem, openCart } = useCartStore();

  const installmentPrice = product.price / 6;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, product.sizes[0], product.colors[0]?.name || "Padrão");
    openCart();
  };

  return (
    <Link
      href={`/produto/${product.slug}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-gray-100 overflow-hidden rounded-none">
        {product.discount && product.discount > 0 && (
          <div className="absolute top-0 left-0 bg-red-600 text-white px-2 py-1 text-[10px] uppercase font-bold z-20">
            -{product.discount}%
          </div>
        )}
        {product.isNew && (
          <div className="absolute top-0 right-0 bg-black text-white px-2 py-1 text-[10px] uppercase font-bold z-20">
            Novo
          </div>
        )}

        <div className="aspect-square relative overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
          <img
            src={product.images[0] || "/mockup.jpg"}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? "scale-110" : "scale-100"
              } ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>

        <div className={`absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 flex items-center justify-center ${isHovered ? "opacity-100" : ""}`}>
          <div className="flex gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleQuickAdd}
              className="bg-white text-black py-2.5 px-6 font-bold text-xs uppercase hover:bg-gray-100 transition-colors"
            >
              Comprar
            </button>
            <button className="bg-white text-black p-2.5 hover:bg-gray-100 transition-colors">
              <Heart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-start text-left">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.1em] block mb-1.5">
          {product.category || "Original"}
        </span>
        <h3 className="text-[13px] font-black uppercase text-black line-clamp-2" style={{ fontFamily: "Space Grotesk, sans-serif", lineHeight: "1.3" }}>
          {product.name}
        </h3>

        <div className="mt-2 flex items-baseline justify-start gap-2.5">
          <span className="text-sm font-black text-black">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs font-bold text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        <p className="text-[11px] font-medium text-gray-500 mt-1">
          6x de {formatPrice(installmentPrice)} sem juros
        </p>

        {product.colors && product.colors.length > 1 && (
          <div className="flex justify-start items-center gap-1.5 mt-3">
            {product.colors.slice(0, 5).map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 border border-gray-300 hover:border-black transition-colors cursor-pointer"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="text-[10px] font-bold text-gray-400 ml-1">+{product.colors.length - 5}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
