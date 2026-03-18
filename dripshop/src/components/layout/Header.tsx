"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, User, Menu, Search, Heart } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { collections, categories, creators } from "@/lib/data/categories";
import SearchModal from "@/components/layout/SearchModal";

export default function Header() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { getTotalItems, openCart } = useCartStore();
  const totalItems = getTotalItems();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm transition-all duration-300">
        <div className="hidden lg:block bg-black text-white text-[11px] py-2.5 text-center tracking-widest font-black uppercase">
          <span className="opacity-90">
            🔥 O VERDADEIRO DRIP CHEGOU • FRETE GRÁTIS ACIMA DE R$ 199 • PARCELAMENTO EM ATÉ 6X 
          </span>
        </div>

        <div className="container flex items-center justify-between border-b border-gray-100" style={{ height: "var(--header-height)" }}>
          <button
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/" className="flex-shrink-0 relative group">
            <img
              src="/logo.svg"
              alt="DRIPSHOP"
              className="h-10 w-auto object-contain transition-transform duration-500 ease-out group-hover:scale-105 animate-fade-in-up"
              style={{ animationDuration: '0.8s' }}
            />
          </Link>

          <nav className="hidden lg:flex items-center space-x-2 h-full">
            <div
              className="h-full flex items-center px-4 cursor-pointer hover:bg-gray-50 transition-colors relative"
              onMouseEnter={() => setActiveMenu("colecoes")}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <span className="text-[13px] font-black uppercase tracking-wider text-black">Coleções</span>
            </div>

            <Link
              href="/licenciados"
              className="h-full flex items-center px-4 cursor-pointer hover:bg-gray-50 transition-colors relative"
            >
              <span className="text-[13px] font-black uppercase tracking-wider text-black">Licenciados</span>
            </Link>

            <Link
              href="/categoria/camisetas"
              className="h-full flex items-center px-4 cursor-pointer hover:bg-gray-50 transition-colors relative"
            >
              <span className="text-[13px] font-black uppercase tracking-wider text-black">Camisetas</span>
            </Link>

            <Link
              href="/categoria/moletom"
              className="h-full flex items-center px-4 cursor-pointer hover:bg-gray-50 transition-colors relative"
            >
              <span className="text-[13px] font-black uppercase tracking-wider text-black">Moletom</span>
            </Link>

            <div
              className="h-full flex items-center px-4 cursor-pointer hover:bg-gray-50 transition-colors relative"
              onMouseEnter={() => setActiveMenu("parceiros")}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <span className="text-[13px] font-black uppercase tracking-wider text-black">Artistas</span>
            </div>
          </nav>

          <div className="flex items-center space-x-2">
            <button
              className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors hidden sm:flex">
              <Heart className="w-5 h-5" />
            </button>
            <Link href="/login" className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors hidden sm:flex">
              <User className="w-5 h-5" />
            </Link>
            <button
              className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors relative"
              onClick={openCart}
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-sm">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {activeMenu && (
          <div
            className="absolute top-full left-0 right-0 bg-white shadow-2xl border-t border-gray-100 animate-menu-reveal"
            onMouseEnter={() => setActiveMenu(activeMenu)}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <div className="container pt-12 pb-24">
              {activeMenu === "colecoes" && (
                <div className="grid grid-cols-5 gap-8">
                  <div className="col-span-2">
                    <h3 className="font-bold mb-4 text-lg" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Destaques</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {collections.slice(0, 10).map((col) => (
                        <Link
                          key={col.id}
                          href={`/colecao/${col.slug}`}
                          className="text-sm text-gray-500 hover:text-black hover:translate-x-1 transition-all duration-200 font-medium"
                        >
                          {col.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold mb-4 text-lg" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Lançamentos</h3>
                    <div className="space-y-3">
                      <Link href="/lancamentos" className="block text-sm text-gray-500 hover:text-black hover:translate-x-1 transition-all duration-200 font-medium">
                        Novidades
                      </Link>
                      <Link href="/promocao" className="block text-sm text-black font-bold hover:translate-x-1 transition-all duration-200">
                        💥 Ofertas
                      </Link>
                    </div>
                  </div>
                  <div className="col-span-2 bg-black p-8 text-white flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400">Destaque</span>
                      <h4 className="font-black text-2xl mt-2 mb-1 uppercase" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Nova Coleção</h4>
                      <p className="text-sm font-medium text-gray-400 mb-6">Self-Data</p>
                    </div>
                    <Link href="/colecao/self-data" className="inline-block bg-white text-black px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors self-start">
                      Ver coleção
                    </Link>
                  </div>
                </div>
              )}

              {activeMenu === "parceiros" && (
                <div className="grid grid-cols-6 gap-6">
                  {creators.slice(0, 18).map((creator) => (
                    <Link
                      key={creator.id}
                      href={`/artista/${creator.slug}`}
                      className="text-sm text-gray-600 hover:text-primary transition-colors font-medium flex items-center gap-2"
                    >
                      {creator.verified && (
                        <span className="text-primary">✓</span>
                      )}
                      {creator.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-2xl border-t border-gray-100 max-h-[85vh] overflow-y-auto">
          <div className="container py-6">
            <div className="space-y-6">
              <div className="flex flex-col gap-4">
                <Link href="/colecoes" className="font-bold text-lg text-black hover:pl-2 transition-all duration-200" onClick={() => setMobileMenuOpen(false)}>Coleções</Link>
                <Link href="/licenciados" className="font-bold text-lg text-black hover:pl-2 transition-all duration-200" onClick={() => setMobileMenuOpen(false)}>Licenciados</Link>
                <Link href="/categoria/camisetas" className="font-bold text-lg text-black hover:pl-2 transition-all duration-200" onClick={() => setMobileMenuOpen(false)}>Camisetas</Link>
                <Link href="/categoria/moletom" className="font-bold text-lg text-black hover:pl-2 transition-all duration-200" onClick={() => setMobileMenuOpen(false)}>Moletom</Link>
                <Link href="/parceiros" className="font-bold text-lg text-black hover:pl-2 transition-all duration-200" onClick={() => setMobileMenuOpen(false)}>Artistas</Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
