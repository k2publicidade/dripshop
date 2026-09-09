import { requireUser } from '@/lib/auth';
import { getCatalog } from '@/lib/catalog';
import ProductGrid from '@/components/product/ProductGrid';
import Link from 'next/link';
export default async function FavoritesPage(){const {db,user}=await requireUser();const {data,error}=await db.from('favorites').select('product_id').eq('user_id',user.id);if(error)throw new Error('Não foi possível carregar os favoritos.');const ids=new Set(data?.map(f=>f.product_id));const products=(await getCatalog()).filter(p=>ids.has(p.id));return <div><h2 className="text-3xl mb-3">Seus favoritos</h2><p className="text-gray-500 mb-8">Guarde as peças que têm a sua cara.</p>{products.length?<ProductGrid products={products}/>:<div className="bg-gray-50 text-center py-14"><p className="mb-6">Sua lista ainda está vazia.</p><Link href="/busca" className="btn-primary">Explorar a loja</Link></div>}</div>;}
