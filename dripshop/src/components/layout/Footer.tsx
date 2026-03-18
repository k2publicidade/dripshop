import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              <span className="text-white">DRIP</span><span className="text-gray-500">SHOP</span>
            </h2>
            <p className="text-gray-400 mb-6 max-w-sm font-medium">
              Vista o extraordinário com nossas exclusivas coleções de roupas e acessórios. Qualidade, estilo e conforto em um só lugar.
            </p>
            <div className="flex space-x-3">
              {[
                { icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z", label: "Instagram" },
                { icon: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z", label: "YouTube" },
                { icon: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z", label: "TikTok" },
                { icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z", label: "X" },
              ].map((social, i) => (
                <a 
                  key={i}
                  href="#" 
                  aria-label={social.label}
                  className="w-10 h-10 border border-gray-800 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d={social.icon}/></svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-xs tracking-widest uppercase text-gray-500" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Institucional</h3>
            <ul className="space-y-3 text-sm text-gray-300 font-medium">
              <li><Link href="/p/sobre-nos" className="hover:text-white transition-colors">Quem Somos</Link></li>
              <li><Link href="/p/fale-conosco" className="hover:text-white transition-colors">Fale Conosco</Link></li>
              <li><Link href="/p/onde-encontrar" className="hover:text-white transition-colors">Nossas Lojas</Link></li>
              <li><Link href="/parceiros" className="hover:text-white transition-colors">Parceiros</Link></li>
              <li><Link href="/trabalhe-conosco" className="hover:text-white transition-colors">Trabalhe Conosco</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-xs tracking-widest uppercase text-gray-500" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Ajuda</h3>
            <ul className="space-y-3 text-sm text-gray-300 font-medium">
              <li><Link href="/p/trocas" className="hover:text-white transition-colors">Trocas e Devoluções</Link></li>
              <li><Link href="/p/fale-conosco#rastrear" className="hover:text-white transition-colors">Rastrear Pedido</Link></li>
              <li><Link href="/p/fale-conosco#envio" className="hover:text-white transition-colors">Prazo de Envio</Link></li>
              <li><Link href="/p/como-lavar" className="hover:text-white transition-colors">Cuidados com a Peça</Link></li>
              <li><Link href="/p/privacidade" className="hover:text-white transition-colors">Privacidade</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-xs tracking-widest uppercase text-gray-500" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Newsletter</h3>
            <p className="text-sm text-gray-300 mb-4 font-medium">
              Receba ofertas exclusivas no seu email.
            </p>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="SEU MELHOR EMAIL"
                className="px-4 py-3 bg-transparent border border-gray-700 focus:outline-none focus:border-white text-xs tracking-wider uppercase"
              />
              <button
                type="submit"
                className="bg-white text-black px-4 py-3 font-bold uppercase text-xs tracking-widest hover:bg-gray-200 transition-colors"
              >
                Inscrever-se
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© 2025 DripShop. Todos os direitos reservados.</p>
            <div className="flex items-center gap-4">
              <span>📦 Frete Grátis acima de R$199</span>
              <span>💳 6x sem juros</span>
              <span>🔒 Compra Segura</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
