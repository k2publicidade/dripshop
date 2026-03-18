"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Minus, Plus, ShoppingCart, Heart, Share2, Shield, Truck, RotateCcw, Check } from "lucide-react";
import { getProductBySlug, products } from "@/lib/data/products";
import ProductCard from "@/components/product/ProductCard";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

export default function ProductPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const product = getProductBySlug(slug);
  
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || "");
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0]?.name || "");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const { addItem, openCart } = useCartStore();

  if (!product) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
        <Link href="/" className="text-primary hover:underline">
          Voltar para home
        </Link>
      </div>
    );
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addItem(product, selectedSize, selectedColor);
    openCart();
  };

  const installmentPrice = product.price / 6;

  const guarantees = [
    { icon: Truck, text: "Frete grátis acima de R$199" },
    { icon: Shield, text: "Compra 100% segura" },
    { icon: RotateCcw, text: "Troca em até 30 dias" },
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="container">
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/categoria/${product.category}`} className="hover:text-black transition-colors">
              {product.category}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-black truncate max-w-[200px]">{product.name.substring(0, 25)}...</span>
          </nav>
        </div>
      </div>

      <div className="container py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Gallery */}
          <div className="flex-1">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex lg:flex-col gap-2 order-2 lg:order-1 overflow-x-auto lg:overflow-visible">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 lg:w-20 lg:h-20 bg-gray-100 overflow-hidden flex-shrink-0 border transition-colors ${
                      selectedImage === index ? "border-black" : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={img || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200"}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
              <div className="flex-1 order-1 lg:order-2">
                <div className="aspect-square bg-gray-100 overflow-hidden relative group">
                  <img
                    src={product.images[selectedImage] || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.discount && product.discount > 0 && (
                    <div className="absolute top-4 left-4 badge badge-discount text-sm px-3 py-1.5">
                      -{product.discount}%
                    </div>
                  )}
                  {product.isNew && (
                    <div className="absolute top-4 right-4 badge badge-new text-sm px-3 py-1.5">
                      Novo
                    </div>
                  )}
                  
                  <button 
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="absolute bottom-4 right-4 w-12 h-12 bg-white border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current text-current' : 'text-gray-400'}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-[480px]">
            <div className="mb-4">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] border-b-2 border-black pb-1">
                {product.collection || product.category}
              </span>
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-black mb-4 uppercase tracking-tighter" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              {product.name}
            </h1>

            <div className="mb-8">
              {product.originalPrice && (
                <p className="text-gray-400 font-bold line-through text-lg">
                  {formatPrice(product.originalPrice)}
                </p>
              )}
              <div className="flex items-baseline gap-3">
                <p className="text-4xl font-black text-black tracking-tight" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  {formatPrice(product.price)}
                </p>
                {product.discount && (
                  <span className="bg-black text-white px-2 py-1 text-xs font-bold uppercase tracking-widest">
                    -{product.discount}%
                  </span>
                )}
              </div>
              <p className="text-xs font-bold text-gray-500 mt-2 uppercase tracking-wide">
                6x de {formatPrice(installmentPrice)} sem juros
              </p>
            </div>

            {/* Size Selection */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <label className="text-[11px] font-bold text-gray-600 uppercase tracking-widest">Tamanho</label>
                <button className="text-[10px] font-bold text-black uppercase tracking-widest hover:underline">
                  Guia de medidas
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[64px] h-12 border text-xs font-bold uppercase tracking-wider transition-colors ${
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-gray-300 hover:border-black text-black bg-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div className="mb-8">
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-widest mb-4">Cor</label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`px-6 py-3 border text-[11px] font-bold uppercase tracking-wider transition-colors ${
                        selectedColor === color.name
                          ? "border-black bg-black text-white"
                          : "border-gray-300 hover:border-black text-black bg-white"
                      }`}
                    >
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart Area */}
            <div className="flex gap-4 mb-4">
              <div className="flex items-center border border-gray-300 bg-white min-w-[120px]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-4 hover:bg-black hover:text-white transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="flex-1 text-center font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-4 hover:bg-black hover:text-white transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 btn-primary text-sm"
              >
                <ShoppingCart className="w-5 h-5" />
                Adicionar
              </button>
            </div>

            {/* Quick Buy */}
            <button className="w-full btn-secondary text-sm mb-8">
              Comprar Agora
            </button>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {guarantees.map((item, i) => (
                <div key={i} className="text-center p-4 border border-gray-200 bg-white">
                  <item.icon className="w-5 h-5 mx-auto mb-2 text-black" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{item.text}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="font-bold text-xs uppercase tracking-widest mb-4">Descrição</h3>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                {product.description}
              </p>
            </div>

            {/* Share */}
            <div className="mt-8 pt-8 border-t border-gray-200 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Compartilhar</span>
              <div className="flex gap-3">
                <button className="w-10 h-10 border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`w-10 h-10 border flex items-center justify-center transition-colors ${
                    isFavorite ? 'border-black bg-black text-white' : 'border-gray-200 hover:bg-black hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 lg:mt-24">
            <h2 className="section-title mb-8">Produtos Relacionados</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
