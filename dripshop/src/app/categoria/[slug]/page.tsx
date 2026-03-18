import ProductGrid from "@/components/product/ProductGrid";
import { getProductsByCategory, products } from "@/lib/data/products";
import { categories, themes } from "@/lib/data/categories";
import { Filter, Grid, List } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const categoryProducts = getProductsByCategory(slug);
  const category = categories.find((c) => c.slug === slug);
  const categoryThemes = themes.filter((t) => t.category === slug);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container py-8">
          <h1 className="text-4xl lg:text-5xl font-black mb-2 uppercase tracking-tighter" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            {category?.name || slug.toUpperCase()}
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
            {categoryProducts.length} produto{categoryProducts.length !== 1 ? 's' : ''} encontrado{categoryProducts.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-8">
                <Filter className="w-5 h-5" />
                <h3 className="font-black text-lg uppercase tracking-widest" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Filtros</h3>
              </div>
              
              {/* Categories */}
              <div className="mb-8 pb-8 border-b border-gray-100">
                <h4 className="font-bold text-[10px] uppercase tracking-widest text-gray-400 mb-4">Categorias</h4>
                <div className="space-y-3">
                  {categories.slice(0, 6).map((cat) => (
                    <a
                      key={cat.id}
                      href={`/categoria/${cat.slug}`}
                      className={`block text-xs uppercase tracking-wide font-bold transition-colors ${
                        cat.slug === slug ? 'text-black' : 'text-gray-500 hover:text-black'
                      }`}
                    >
                      {cat.name}
                    </a>
                  ))}
                </div>
              </div>

              {/* Themes */}
              {categoryThemes.length > 0 && (
                <div className="mb-8 pb-8 border-b border-gray-100">
                  <h4 className="font-bold text-[10px] uppercase tracking-widest text-gray-400 mb-4">Temas</h4>
                  <div className="space-y-3">
                    {categoryThemes.map((theme) => (
                      <a
                        key={theme.id}
                        href={`/tema/${theme.slug}`}
                        className="block text-xs uppercase tracking-wide font-bold text-gray-500 hover:text-black transition-colors"
                      >
                        {theme.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              <div className="mb-8 pb-8 border-b border-gray-100">
                <h4 className="font-bold text-[10px] uppercase tracking-widest text-gray-400 mb-4">Cores</h4>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { name: 'Preto', hex: '#000000' },
                    { name: 'Branco', hex: '#ffffff' },
                    { name: 'Cinza', hex: '#6b7280' },
                    { name: 'Azul', hex: '#3b82f6' },
                    { name: 'Vermelho', hex: '#ef4444' },
                    { name: 'Verde', hex: '#22c55e' },
                  ].map((color) => (
                    <button
                      key={color.name}
                      className="w-6 h-6 border border-gray-300 hover:border-black transition-colors"
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-semibold mb-3">Faixa de Preço</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                    <span className="text-sm text-gray-600">Até R$50</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                    <span className="text-sm text-gray-600">R$50 - R$100</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                    <span className="text-sm text-gray-600">R$100 - R$200</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                    <span className="text-sm text-gray-600">Acima de R$200</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1">
              {/* Sort Bar */}
            <div className="bg-white border border-gray-200 p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">{categoryProducts.length} produtos</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 hidden sm:block">Ordenar:</span>
                  <select className="border border-gray-200 bg-white p-2 text-xs font-bold uppercase tracking-wider focus:outline-none cursor-pointer">
                    <option>Mais relevantes</option>
                    <option>Menor preço</option>
                    <option>Maior preço</option>
                    <option>Mais vendidos</option>
                    <option>Lançamentos</option>
                  </select>
                </div>
                <div className="hidden md:flex items-center gap-2 border-l border-gray-200 pl-4">
                  <button className="p-2 bg-black text-white hover:bg-gray-800 transition-colors">
                    <Grid className="w-4 h-4" />
                  </button>
                  <button className="p-2 border border-gray-200 hover:bg-gray-100 transition-colors">
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {categoryProducts.length > 0 ? (
              <ProductGrid products={categoryProducts} />
            ) : (
              <div className="bg-white border border-gray-200 p-16 text-center">
                <div className="w-20 h-20 bg-gray-100 flex items-center justify-center mx-auto mb-6">
                  <Grid className="w-8 h-8 text-gray-400" />
                </div>
                <p className="font-black text-xl uppercase tracking-tighter mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Nenhum produto encontrado</p>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Tente buscar em outras categorias ou coleções.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
