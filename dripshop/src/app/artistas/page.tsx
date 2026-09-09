import {getArtists} from '@/lib/content';
import Link from 'next/link';
import ContentImage from '@/components/home/ContentImage';
export default async function Artists(){const artists=await getArtists();return <div className="street-container artists-page"><p className="eyebrow">ARTISTAS DRIPSHOP</p><h1>VOZES QUE VESTEM CULTURA.</h1><p>Encontre a sua conexão com a cena.</p><div className="artists-directory">{artists.map(a=><Link key={a.id} className="artist-card" href={'/artista/'+a.slug}><ContentImage image={a.image||''} alt={a.name} sizes="(max-width:767px) 50vw, 25vw"/><div className="artist-card-copy"><h2>{a.name}</h2><span>Ver coleção ↗</span></div></Link>)}</div></div>;}
