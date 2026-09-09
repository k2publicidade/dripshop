import { getCatalog } from '@/lib/catalog';
import ProductDetail from '@/components/product/ProductDetail';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCatalog as catalog } from '@/lib/catalog';
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
 const { slug } = await params; const product = (await catalog()).find(item => item.slug === slug);
 if (!product) return { title: 'Produto | DripShop' };
 return { title: `${product.name} | DripShop`, description: product.description.slice(0, 155), alternates: { canonical: `https://www.dripshop.com.br/produto/${product.slug}` }, openGraph: { title: product.name, description: product.description.slice(0, 155), images: product.images[0] ? [product.images[0]] : undefined } };
}
export default async function ProductPage({params}:{params:Promise<{slug:string}>}) { const {slug}=await params; const products=await getCatalog(); const product=products.find(p=>p.slug===slug); if(!product) notFound(); return <ProductDetail product={product} products={products}/>; }
