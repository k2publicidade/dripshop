import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
 return {
  name: 'DripShop', short_name: 'DripShop', description: 'Moda com identidade própria.',
  start_url: '/', display: 'standalone', background_color: '#fafafa', theme_color: '#0a0a0a',
  lang: 'pt-BR', icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
 };
}
