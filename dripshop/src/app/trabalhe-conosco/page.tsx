import { Metadata } from "next";
import { Briefcase, Mail, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Trabalhe Conosco - DripShop",
  description: "Venha fazer parte do time DripShop. Estamos sempre em busca de novos talentos para trabalhar com moda urbana e streetwear.",
};

const openings = [
  {
    title: "Vendedor(a) - Pinheiros",
    type: "CLT",
    location: "São Paulo - SP",
    description: "Atendimento ao cliente, operação de caixa, organização da loja.",
  },
  {
    title: "Vendedor(a) - Vila Olimpia",
    type: "CLT",
    location: "São Paulo - SP",
    description: "Atendimento ao cliente, operação de caixa, organização da loja.",
  },
  {
    title: "Estoquista",
    type: "CLT",
    location: "São Paulo - SP",
    description: "Controle de estoque, recebimento de mercadorias, organização do armazém.",
  },
  {
    title: "Analista de E-commerce",
    type: "CLT",
    location: "São Paulo - SP (Híbrido)",
    description: "Gestão do site, atualização de produtos, análise de métricas.",
  },
];

export default function TrabalheConoscoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container py-12">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            Trabalhe Conosco
          </h1>
          <p className="text-gray-500">
            Junte-se ao time DripShop e faça parte da revolução da moda urbana
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-sm mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              Por que trabalhar na DripShop?
            </h2>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>Ambiente descontraído e orientado para resultados</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>Uniforme gratuito e desconto em produtos</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>Plano de carreira e desenvolvimento profissional</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>Participação em eventos e lançamentos exclusivos</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>Horário flexível e VT/VR</span>
              </li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              Vagas Abertas
            </h2>
            <div className="space-y-4">
              {openings.map((job, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                        {job.title}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1">{job.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {job.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                      </div>
                    </div>
                    <button className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors self-start">
                      Candidatar-se
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              Não encontrou a sua vaga?
            </h2>
            <p className="text-gray-600 mb-4">
              Envie seu currículo para nosso banco de talentos. Sempre que surgirem novas oportunidades, entraremos em contato.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                placeholder="Seu email"
              />
              <button className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Enviar Currículo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
