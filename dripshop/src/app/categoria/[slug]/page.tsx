import { getCatalog } from '@/lib/catalog';
import { createClient } from '@/lib/supabase/server';
import CatalogFilters from '@/components/product/CatalogFilters';
import { notFound } from 'next/navigation';
import Link from 'next/link';
export default async function CategoryPage({params}:{params:Promise<{slug:string}>}) {
 const {slug}=await params;
 const db=await createClient();
 const {data:category}=await db.from('categories').select('name,description').eq('slug',slug).single();
 if(!category) notFound();
 const products=(await getCatalog()).filter(p=>p.category===slug);
 return <div className="container py-10 lg:py-16"><nav className="text-sm text-gray-500 mb-8"><Link href="/">Início</Link> / {category.name}</nav><p className="eyebrow">O seu próximo favorito</p><h1 className="text-4xl lg:text-6xl uppercase mb-5">{category.name}</h1><p className="text-gray-500 mb-10 max-w-xl">{category.description||'Peças para vestir do seu jeito. Encontre o corte, a cor e a ideia que combinam com você.'}</p><CatalogFilters products={products}/></div>;
}
