import type { MetadataRoute } from 'next';
import { getCatalog } from '@/lib/catalog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
 const base = 'https://www.dripshop.com.br';
 const now = new Date();
 const pages = ['', '/busca', '/colecoes', '/lancamentos', '/promocao', '/categoria/camisetas', '/categoria/moletom', '/categoria/acessorios', '/p/sobre-nos', '/p/trocas', '/p/privacidade'].map(path => ({ url: base + path, lastModified: now, changeFrequency: 'daily' as const, priority: path === '' ? 1 : 0.6 }));
 const products = (await getCatalog()).map(product => ({ url: `${base}/produto/${product.slug}`, lastModified: new Date(product.createdAt), changeFrequency: 'weekly' as const, priority: 0.7 }));
 return [...pages, ...products];
}
