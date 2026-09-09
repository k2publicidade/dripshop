'use client';
import {useRef} from 'react';
import {ChevronLeft,ChevronRight} from 'lucide-react';
import type {Product} from '@/types';
import ProductCard from '@/components/product/ProductCard';
export default function ProductCarousel({products}:{products:Product[]}){const ref=useRef<HTMLDivElement>(null);function move(direction:number){const el=ref.current;if(el)el.scrollBy({left:direction*el.clientWidth*.85,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}return <div className="carousel-wrap"><div className="product-carousel" ref={ref} tabIndex={0} role="region" aria-label="Produtos: deslize para explorar" onKeyDown={e=>{if(e.target===e.currentTarget&&(e.key==='ArrowRight'||e.key==='ArrowLeft')){e.preventDefault();move(e.key==='ArrowRight'?1:-1);}}}>{products.map(p=><ProductCard product={p} key={p.id}/>)}</div>{products.length>1&&<div className="carousel-controls"><span>Deslize para descobrir</span><button aria-label="Produtos anteriores" onClick={()=>move(-1)}><ChevronLeft size={18}/></button><button aria-label="Próximos produtos" onClick={()=>move(1)}><ChevronRight size={18}/></button></div>}</div>;}
