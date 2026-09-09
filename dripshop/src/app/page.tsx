import {getCatalog} from '@/lib/catalog';
import {getContent,getArtists} from '@/lib/content';
import Sections from '@/components/home/Sections';
export default async function Home(){const [products,sections,artists]=await Promise.all([getCatalog(),getContent(),getArtists()]);return <div className="street-home"><Sections sections={sections.filter(s=>s.page_path==='/')} products={products} artists={artists}/></div>;}
