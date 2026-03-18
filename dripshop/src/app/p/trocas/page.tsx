import { Metadata } from "next";
import { ArrowLeftRight, Package, Clock, RefreshCw } from "lucide-react";

export const metadata: Metadata = {
  title: "Trocas e Devoluções - DripShop",
  description: "Política de trocas e devoluções da DripShop. Veja como proceder para trocar ou devolver seu produto.",
};

export default function TrocasPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container py-12">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            Trocas e Devoluções
          </h1>
          <p className="text-gray-500">
            Veja como funciona nossa política de trocas e devoluções
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-sm mb-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <ArrowLeftRight className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  Como Solicitar uma Troca
                </h2>
                <p className="text-gray-600">
                  Você tem até 7 dias corridos após o recebimento do pedido para solicitar a troca. 
                  O processo é simples e gratuito.
                </p>
              </div>
            </div>
            <ol className="space-y-4 text-gray-600 ml-4">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                <span>Acesse sua conta em &quot;Meus Pedidos&quot; ou entre em contato pelo WhatsApp</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                <span>Informe o número do pedido e o produto que deseja trocar</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                <span>Nossa equipewill agendará a coleta do produto em sua casa, sem custo</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                <span>Após recebermos o produto, encaminharemos o novo item ou o reembolso</span>
              </li>
            </ol>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm mb-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  Condições para Troca
                </h2>
                <p className="text-gray-600">
                  Para ser aceita, a troca precisa estar nas seguintes condições:
                </p>
              </div>
            </div>
            <ul className="space-y-3 text-gray-600 ml-4">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>Produto com etiquetas e embalagem original intacta</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>Produto sem sinais de uso ou lavagem</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>Acompanhado da nota fiscal ou comprovante de compra</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm mb-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <RefreshCw className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  Devolução por Arrependimento
                </h2>
                <p className="text-gray-600">
                  Além da troca, você também pode devolver o produto por arrependimento em até 7 dias 
                  após o recebimento, conforme o Código de Defesa do Consumidor.
                </p>
              </div>
            </div>
            <ul className="space-y-3 text-gray-600 ml-4">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>O reembolso será feito pelo mesmo método de pagamento em até 7 dias úteis</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>Os custos de frete de devolução são por conta do cliente</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  Produto com Defeito
                </h2>
                <p className="text-gray-600">
                  Se o produto apresentar algum defeito de fabricação, você tem até 30 dias para solicitar 
                  a troca ou reparo. Nesse caso, o processo é 100% gratuito.
                </p>
              </div>
            </div>
            <p className="text-gray-500 text-sm ml-4">
              Em caso de dúvidas, entre em contato pelo WhatsApp (11) 99999-9999 ou pelo email contato@dripshop.com.br
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
