'use client';
import { useMemo, useState } from 'react';
import type { Product } from '@/types';
import ProductGrid from './ProductGrid';
import { SlidersHorizontal, X } from 'lucide-react';

export default function CatalogFilters({ products }: { products: Product[] }) {
 const [size,setSize]=useState(''); const [color,setColor]=useState('');
 const [sort,setSort]=useState('newest'); const [max,setMax]=useState('');
 const [open,setOpen]=useState(false);
 const sizes=[...new Set(products.flatMap(p=>p.sizes))];
 const colors=[...new Set(products.flatMap(p=>p.colors.map(c=>c.name)))];
 const filtered=useMemo(()=>products.filter(p=>(!size||p.sizes.includes(size))&&(!color||p.colors.some(c=>c.name===color))&&(!max||p.price<=Number(max))).sort((a,b)=>sort==='price_asc'?a.price-b.price:sort==='price_desc'?b.price-a.price:sort==='name'?a.name.localeCompare(b.name):b.createdAt.localeCompare(a.createdAt)),[products,size,color,sort,max]);
 return <div><div className="flex flex-wrap items-center justify-between gap-4 border-y border-gray-200 py-4 mb-8"><button onClick={()=>setOpen(!open)} aria-expanded={open} className="flex gap-2 items-center text-sm font-medium"><SlidersHorizontal size={17}/> Filtrar {(size||color||max)&&'•'}</button><span className="text-sm text-gray-500">{filtered.length} peças</span><label className="text-sm">Ordenar <select aria-label="Ordenar produtos" className="ml-2 bg-transparent py-2" value={sort} onChange={e=>setSort(e.target.value)}><option value="newest">Mais recentes</option><option value="price_asc">Menor preço</option><option value="price_desc">Maior preço</option><option value="name">Nome</option></select></label></div>{open&&<div className="grid sm:grid-cols-4 gap-4 bg-gray-50 p-6 mb-8"><label className="text-sm">Tamanho<select value={size} onChange={e=>setSize(e.target.value)} className="w-full border p-3 mt-2"><option value="">Todos</option>{sizes.map(s=><option key={s}>{s}</option>)}</select></label><label className="text-sm">Cor<select value={color} onChange={e=>setColor(e.target.value)} className="w-full border p-3 mt-2"><option value="">Todas</option>{colors.map(c=><option key={c}>{c}</option>)}</select></label><label className="text-sm">Preço máximo (R$)<input type="number" min="0" value={max} onChange={e=>setMax(e.target.value)} placeholder="Sem limite" className="w-full border p-3 mt-2"/></label><button className="flex items-center justify-center gap-2 text-sm" onClick={()=>{setSize('');setColor('');setMax('');}}><X size={16}/>Limpar filtros</button></div>}{filtered.length?<ProductGrid products={filtered}/>:<div className="text-center py-20"><h2 className="text-2xl mb-3">Nenhuma peça por aqui.</h2><p className="text-gray-500">Experimente outra combinação de filtros.</p></div>}</div>;
}
