import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre Nós - DripShop",
  description: "Conheça a história da DripShop, uma loja de roupas urbanas e streetwear com as melhores coleções e artistas parceiros.",
};

export default function SobreNosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container py-12">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            Sobre Nós
          </h1>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-sm">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              Nossa História
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              A DripShop nasceu com a missão de trazer as melhores peças de streetwear e moda urbana para o Brasil. 
              Fundada por amantes de cultura urbana, nossa loja representa muito mais que roupas - é um estilo de vida.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Trabalhamos com artistas independentes e marcas licenciadas para oferecer peças exclusivas que você 
              não encontra em nenhum outro lugar. Cada produto é selecionado com carinho para garantir qualidade 
              e estilo.
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              Nossa Missão
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Proporcionar aos nossos clientes acesso às melhores peças de streetwear, com atendimento excepcional 
              e preços justos. acreditamos que estilo é uma forma de expressão e queremos democratizar o acesso 
              à moda urbana de qualidade.
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              Nossos Valores
            </h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>Qualidade em primeiro lugar</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>Atendimento humanizado</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>Transparência em todas as operações</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>Suporte aos artistas independentes</span>
              </li>
            </ul>

            <div className="mt-12 p-6 bg-gray-50 rounded-xl">
              <h3 className="font-bold text-lg mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                Venha fazer parte da nossa história!
              </h3>
              <p className="text-gray-600">
                Explore nossas coleções e encontre seu estilo único.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
