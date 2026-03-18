import { Metadata } from "next";
import { Shirt, Droplets, Scissors, Square } from "lucide-react";

export const metadata: Metadata = {
  title: "Cuidados com a Peça - DripShop",
  description: "Aprenda como cuidar das suas peças DripShop. Dicas de lavagem, secagem e conservação para manter a qualidade das suas roupas.",
};

const careInstructions = [
  {
    icon: Shirt,
    title: "Lavagem",
    tips: [
      "Lave as peças pelo avesso para proteger as estampas",
      "Use água fria ou temperatura máxima de 30°C",
      "Prefira sabão líquido neutro",
      "Não misture peças coloridas com brancas na primeira lavagem",
      "Evite excesso de detergente",
    ],
  },
  {
    icon: Droplets,
    title: "Secagem",
    tips: [
      "Evite secadora - seque à sombra, preferencialmente horizontalmente",
      "Não exponha diretamente ao sol para preservar as cores",
      "Não torça excessivamente as peças",
      "Seque em local ventilado",
    ],
  },
  {
    icon: Scissors,
    title: "Passadoria",
    tips: [
      "Passe sempre pelo avesso",
      "Use temperatura média (dependendo do tecido)",
      "Para peças com estampa em glitter ou金属, use prensa térmica se possível",
      "Evite passar diretamente sobre estampas",
    ],
  },
  {
    icon: Square,
    title: "Armazenamento",
    tips: [
      "Guarde em local seco e ventilado",
      "Dobre as peças corretamente para evitar rugas",
      "Evite pendurar peças pesadas por longos períodos",
      "Mantenha afastado de umidade excessiva",
    ],
  },
];

export default function ComoLavarPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container py-12">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            Cuidados com a Peça
          </h1>
          <p className="text-gray-500">
            Dicas para manter suas peças sempre bonitas e duradouras
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              Instruções Gerais
            </h2>
            <p className="text-gray-600 mb-4">
              Nossas peças são desenvolvidas com materiais de alta qualidade. Para garantir a durabilidade 
              e manter as características originais, siga as instruções abaixo:
            </p>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600">
                <strong>Composição:</strong> 100% Algodão | <strong>Gramatura:</strong> 180-240 g/m²
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {careInstructions.map((section, index) => {
              const Icon = section.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                      {section.title}
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {section.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              Simbolos de Lavagem
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { symbol: "30°C", label: "Lavagem máxima 30°C" },
                { symbol: "手", label: "Lavar à mão" },
                { symbol: "X", label: "Não alvejar" },
                { symbol: "‖", label: "Passadoria média" },
                { symbol: "X", label: "Não usar secadora" },
                { symbol: "X", label: "Não passar a vapor" },
              ].map((item, index) => (
                <div key={index} className="text-center p-4 border rounded-xl">
                  <div className="text-2xl mb-2 font-bold text-gray-400">{item.symbol}</div>
                  <div className="text-xs text-gray-500">{item.label}</div>
              </div>
              ))}
            </div>
          </div>

          <div className="mt-8 p-6 bg-primary/5 rounded-2xl border border-primary/20">
            <h3 className="font-bold mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              Dica especial
            </h3>
            <p className="text-gray-600 text-sm">
              Na primeira lavagem, lave a peça separadamente para evitar que a tinta solte em outras roupas. 
              Após a segunda lavagem, as cores estarão estabilizadas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
