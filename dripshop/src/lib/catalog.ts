import { createClient } from '@/lib/supabase/server';
import type { Product } from '@/types';

export interface CatalogRow {
 id: string; name: string; slug: string; price: number; original_price: number | null;
 discount: number | null; description: string; images: string[]; sizes: string[];
 stock: number; is_active: boolean; is_new: boolean; is_featured: boolean;
 theme: string | null; created_at: string;
 categories: { slug: string } | null; collections: { slug: string } | null;
 creators: { slug: string } | null; product_colors: { name: string; hex: string; image?: string }[];
 product_variants: { size: string; color: string; stock: number }[];
}
export function mapProduct(row: CatalogRow): Product {
 return { id: row.id, name: row.name, slug: row.slug, price: Number(row.price),
 originalPrice: row.original_price ? Number(row.original_price) : undefined,
 discount: row.original_price && row.original_price > row.price ? Math.round((1-row.price/row.original_price)*100) : undefined,
 description: row.description, images: row.images, sizes: row.sizes,
 stock: row.stock, variants: row.product_variants, isActive: row.is_active, isNew: row.is_new, isFeatured: row.is_featured,
 theme: row.theme || undefined, category: row.categories?.slug || '',
 collection: row.collections?.slug, creator: row.creators?.slug,
 colors: row.product_colors || [], createdAt: row.created_at };
}
export const productSelect = '*,categories(slug),collections(slug),creators(slug),product_colors(name,hex,image),product_variants(size,color,stock)';
export async function getCatalog(): Promise<Product[]> {
 const db = await createClient();
 const { data, error } = await db.from('products').select(productSelect).eq('is_active',true).order('created_at',{ascending:false}).limit(1000);
 if (error) throw new Error('Não foi possível carregar o catálogo. Tente novamente.');
 return (data as CatalogRow[]).map(mapProduct);
}
