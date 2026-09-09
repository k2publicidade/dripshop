import Link from 'next/link';
import { ArrowUpRight, ArrowRight, MoveUpRight } from 'lucide-react';
import { getCatalog } from '@/lib/catalog';
import ProductGrid from '@/components/product/ProductGrid';

export default async function Home() {
 const products=await getCatalog();
 const featured=products.filter(p=>p.isFeatured).slice(0,4);
 return <div>
  <section className="editorial-hero">
   <div className="hero-copy"><p className="eyebrow">Drop exclusivo. Identidade sem filtro.</p><h1>VISTA O QUE<br/>FAZ <span>BARULHO.</span></h1><p className="hero-description">Peças oficiais e drops exclusivos de artistas que colocam o RAP e o FUNK brasileiro para girar. Leve a sua referência com você.</p><Link href="/lancamentos" className="hero-cta">Ver os drops <ArrowUpRight size={22}/></Link><div className="hero-footnote"><span>ARTE. RUA. IDENTIDADE.</span><span>FEITO PARA QUEM VIVE A CULTURA ↗</span></div></div>
   <div className="hero-visual"><img src="/images/campaign.webp" alt="Estilo casual com camiseta e atitude urbana" fetchPriority="high"/><div className="hero-image-caption"><span>FEITO PARA SER VOCÊ.</span><MoveUpRight size={38}/></div><span className="hero-stamp">USE SEM<br/>PEDIR LICENÇA.</span></div>
  </section>
  <div className="brand-strip"><span>ROUPA É EXPRESSÃO</span><span aria-hidden="true">✳</span><span>PERSONALIDADE NÃO TEM MOLDE</span><span aria-hidden="true">✳</span><span>DRIPSHOP ORIGINALS</span></div>
  <section className="container section-space"><div className="section-heading"><div><p className="eyebrow">Escolhidos para chegar forte</p><h2>O que está no repeat.</h2></div><Link href="/busca" className="text-link">Explorar o catálogo <ArrowUpRight size={18}/></Link></div><ProductGrid products={featured.length?featured:products.slice(0,4)}/></section>
  <section className="container pb-20"><div className="category-editorial">{[{name:'Camisetas',slug:'camisetas',image:'photo-1521572163474-6864f9cf17ab',text:'O começo de tudo.'},{name:'Moletons',slug:'moletom',image:'photo-1556821840-3a63f95609a7',text:'Conforto com presença.'},{name:'Acessórios',slug:'acessorios',image:'photo-1622445275463-afa2ab738c34',text:'Os detalhes dizem muito.'}].map((c,i)=><Link href={'/categoria/'+c.slug} className="category-tile" key={c.slug}><img src={'https://images.unsplash.com/'+c.image+'?auto=format&fit=crop&w=800&q=85'} alt={c.name} loading="lazy"/><div><span className="text-xs">0{i+1} / {c.text}</span><h3>{c.name}<ArrowUpRight size={28}/></h3></div></Link>)}</div></section>
  <section className="manifesto"><div className="container manifesto-inner"><p className="eyebrow">A roupa também é memória.</p><h2>O SEU SOM.<br/>A SUA <em>MARCA.</em></h2><div><p>A DripShop aproxima você dos artistas e das ideias que movem a cultura urbana. Cada peça carrega uma referência. O jeito de usar é todo seu.</p><Link href="/p/sobre-nos" className="text-link">Conheça a nossa história <ArrowRight size={18}/></Link></div></div></section>
  <section className="container section-space"><div className="section-heading"><div><p className="eyebrow">Primeiro você vê. Depois, pode acabar.</p><h2>Novos drops.</h2></div><Link href="/lancamentos" className="text-link">Ver tudo que chegou <ArrowUpRight size={18}/></Link></div><ProductGrid products={products.filter(p=>p.isNew).slice(0,4)}/></section>
 </div>;
}

