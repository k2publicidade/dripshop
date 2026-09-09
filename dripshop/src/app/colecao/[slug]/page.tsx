import {getCatalog} from '@/lib/catalog';
import {createClient} from '@/lib/supabase/server';
import CatalogFilters from '@/components/product/CatalogFilters';
import {notFound} from 'next/navigation';
export default async function Collection({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const db=await createClient();const {data}=await db.from('collections').select('*').eq('slug',slug).eq('is_active',true).single();if(!data)notFound();return <div className="container py-14"><p className="eyebrow">Coleção DripShop</p><h1 className="text-5xl mb-5">{data.name}</h1><p className="text-gray-500 mb-10">{data.description||'Peças que compartilham uma ideia. Encontre a sua.'}</p><CatalogFilters products={(await getCatalog()).filter(p=>p.collection===slug)}/></div>;}
