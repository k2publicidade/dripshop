'use client';
import Link from 'next/link';
import Image from 'next/image';
import FavoriteButton from './FavoriteButton';
import { ArrowUpRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

export default function ProductCard({ product }: { product: Product }) {
 return <article className="product-card"><div className="product-favorite"><FavoriteButton productId={product.id} compact/></div><Link className="product-image" href={'/produto/' + product.slug}><Image src={product.images[0]} alt={product.name} fill sizes="(max-width:767px) 50vw, 25vw" className="object-cover" loading="lazy"/><div className="product-badges">{product.isNew && <span>NOVO</span>}{!!product.discount && <span className="sale-badge">−{product.discount}%</span>}</div><span className="product-discover">Conhecer a peça <ArrowUpRight size={17}/></span></Link><div className="product-meta"><p>{product.category.replaceAll('-', ' ')}</p><h3><Link href={'/produto/' + product.slug}>{product.name}</Link></h3><div className="product-price"><strong>{formatPrice(product.price)}</strong>{product.originalPrice && product.originalPrice > product.price && <del>{formatPrice(product.originalPrice)}</del>}</div><div className="flex justify-between items-center mt-3"><div className="flex gap-1.5" aria-label="Cores disponíveis">{product.colors.map(c => <span key={c.name} title={c.name} aria-label={c.name} className="w-3 h-3 rounded-full border border-black/30 bg-gray-200" />)}</div><span className="text-xs text-gray-500">{product.stock ? 'Ver tamanhos' : 'Em breve'}</span></div></div></article>;
}
