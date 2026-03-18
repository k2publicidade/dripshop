import Link from "next/link";
import ProductGrid from "@/components/product/ProductGrid";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import { getFeaturedProducts, getNewProducts, getOnSaleProducts } from "@/lib/data/products";
import { creators, collections } from "@/lib/data/categories";
import { ArrowRight, Sparkles, Zap, Shield, Truck } from "lucide-react";

const heroImages = [
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1503341455253-b2e72333dbdb?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1200&h=800&fit=crop"
];

const benefits = [
  { icon: Truck, title: "Frete Grátis", subtitle: "Acima de R$199" },
  { icon: Shield, title: "Compra Segura", subtitle: "100% Protegido" },
  { icon: Zap, title: "6x sem juros", subtitle: "Parcele Facilitado" },
  { icon: Sparkles, title: "Troca Fácil", subtitle: "Em até 30 dias" },
];

export default function Home() {
  const featuredProducts = getFeaturedProducts();
  const newProducts = getNewProducts();
  const saleProducts = getOnSaleProducts();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[80vh] bg-black flex items-center justify-center overflow-hidden pt-16">
        <img
          src={heroImages[0]}
          alt="Vista o Extraordinário"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="relative z-10 text-center px-4 w-full">
          <h1 className="text-5xl lg:text-[6rem] font-black text-white mb-6 leading-none tracking-tighter uppercase drop-shadow-lg" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            O SEU DRIP <br />
            COMEÇA AQUI
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-medium drop-shadow-md">
            As peças mais hypadas e o autêntico streetwear para quem dita a cultura e não segue tendências.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/categoria/camisetas"
              className="bg-white text-black font-black uppercase tracking-wider px-10 py-5 hover:bg-gray-200 transition-colors text-sm"
            >
              Ver Camisetas
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Bar */}
      <section className="bg-black text-white py-4 border-b border-gray-800">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-2">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex flex-col items-center justify-center text-center gap-1.5 py-2">
                <benefit.icon className="w-6 h-6 mb-1" />
                <p className="font-bold text-[11px] uppercase tracking-widest">{benefit.title}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">{benefit.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <FeaturedCategories />

      {/* Creators Section */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black uppercase tracking-tight text-[#111]" style={{ fontFamily: "Space Grotesk, sans-serif" }}>A CENA</h2>
            <p className="text-gray-500 mt-2 text-sm uppercase tracking-widest font-bold">
              Quem faz o movimento acontecer
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {creators.slice(0, 12).map((creator) => (
              <Link
                key={creator.id}
                href={`/artista/${creator.slug}`}
                className="group bg-white px-6 py-4 border border-gray-200 font-bold text-xs uppercase tracking-widest hover:border-black hover:bg-black hover:!text-white transition-all flex items-center gap-2"
              >
                {creator.verified && (
                  <span className="text-[10px]">✓</span>
                )}
                <span>{creator.name}</span>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/parceiros" className="inline-flex items-center gap-2 text-black text-sm uppercase font-black tracking-widest hover:gap-3 transition-all border-b-2 border-black pb-1">
              Ver todos os artistas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="section-title">HYPE DO MOMENTO</h2>
            <p className="text-gray-500 mt-2 text-sm uppercase tracking-widest font-bold">As peças mais pesadas e exclusivas</p>
          </div>
          <ProductGrid products={featuredProducts.slice(0, 8)} />
          <div className="text-center mt-12">
            <Link href="/promocao" className="btn-primary">
              Ver todos os produtos
            </Link>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-20 bg-[#111] text-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black uppercase tracking-tight text-white" style={{ fontFamily: "Space Grotesk, sans-serif" }}>NOSSAS COLEÇÕES</h2>
            <p className="text-gray-400 mt-2 text-sm uppercase tracking-widest font-bold">O formato do seu drip</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {collections.slice(0, 4).map((collection) => (
              <Link
                key={collection.id}
                href={`/colecao/${collection.slug}`}
                className="group relative aspect-square bg-gray-800 overflow-hidden block"
              >
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center z-20 p-6">
                  <div className="text-center">
                    <h3 className="font-black text-2xl uppercase tracking-wider mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                      {collection.name}
                    </h3>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-white border-b-2 border-white pb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Ver coleção
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Products */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="section-title">NEW DROPS</h2>
            <p className="text-gray-500 mt-2 text-sm uppercase tracking-widest font-bold">Drop fresco. Quem tem, tem.</p>
          </div>
          <ProductGrid products={newProducts.slice(0, 8)} />
          <div className="text-center mt-12">
            <Link href="/lancamentos" className="btn-secondary">
              Ver todas as novidades
            </Link>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-20 bg-black text-white">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <span className="inline-block bg-white text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1 mb-4">
                Ofertas por tempo limitado
              </span>
              <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-4" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                Promoções Imperdíveis
              </h2>
              <p className="text-xl font-medium max-w-lg">
                Até 50% de desconto em produtos selecionados. Não perca essa chance!
              </p>
            </div>
            <Link
              href="/promocao"
              className="inline-block bg-white !text-black font-black uppercase tracking-wider px-10 py-5 hover:bg-gray-200 transition-colors text-sm"
            >
              Ver Ofertas
            </Link>
          </div>
        </div>
      </section>

      {/* Sale Products */}
      <section className="py-20 bg-gray-50 border-b border-gray-200">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="section-title">Promoções</h2>
            <p className="text-gray-500 mt-2 text-sm uppercase tracking-widest font-bold">Últimas peças com desconto especial</p>
          </div>
          <ProductGrid products={saleProducts.slice(0, 8)} />
          <div className="text-center mt-12">
            <Link href="/promocao" className="btn-primary">
              Ver Mais Promoções
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-white border-y border-gray-200">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-black uppercase tracking-tight text-black mb-4" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              ENTRE PRA GANGUE
            </h2>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-10">
              Acesse drops antecipados, códigos hypados e infos da cena antes de todo mundo.
            </p>
            <form className="flex flex-col sm:flex-row max-w-lg mx-auto border-2 border-black p-1 bg-white">
              <input
                type="email"
                placeholder="SEU MELHOR EMAIL"
                className="flex-1 px-4 py-3 bg-transparent font-bold uppercase text-black placeholder-gray-400 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-black !text-white font-black uppercase tracking-widest px-8 py-3 hover:bg-gray-800 transition-colors text-xs"
              >
                Inscrever
              </button>
            </form>
            <p className="text-[10px] text-gray-400 mt-4 uppercase tracking-wider">
              Ao se cadastrar, você concorda firmemente com nossa política de privacidade.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
