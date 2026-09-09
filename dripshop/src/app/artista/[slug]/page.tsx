import {getCatalog} from '@/lib/catalog';
import {getArtists} from '@/lib/content';
import {notFound} from 'next/navigation';
import ProductGrid from '@/components/product/ProductGrid';
import ContentImage from '@/components/home/ContentImage';
export default async function Artist({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const [artists,products]=await Promise.all([getArtists(),getCatalog()]);const artist=artists.find(a=>a.slug===slug);if(!artist)notFound();const selected=products.filter(p=>p.creator===slug);return <><section className="artist-detail"><div className="artist-detail-image"><ContentImage image={artist.image||''} alt={artist.name}/></div><div><p className="eyebrow">ARTISTA DRIPSHOP</p><h1>{artist.name}</h1><p>{artist.bio||'Música, identidade e cultura de rua.'}</p></div></section><div className="street-container section-space"><h2 className="mb-8 text-3xl">Peças de {artist.name}</h2>{selected.length?<ProductGrid products={selected}/>:<p>Novas peças chegam em breve. Acompanhe os próximos lançamentos.</p>}</div></>;}
