import { Metadata } from "next";
import { Mail, Phone, MessageCircle, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Fale Conosco - DripShop",
  description: "Entre em contato com a DripShop. Estamos disponíveis para atender você por email, WhatsApp e outras formas de comunicação.",
};

export default function FaleConoscoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container py-12">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            Fale Conosco
          </h1>
          <p className="text-gray-500">
            Estamos aqui para ajudar! Escolha a melhor forma de entrar em contato.
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              Envie uma mensagem
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="Seu nome completo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assunto</label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10">
                  <option>Selecione um assunto</option>
                  <option>Dúvida sobre pedido</option>
                  <option>Troca ou devolução</option>
                  <option>Produtos</option>
                  <option>Parcerias</option>
                  <option>Outros</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
                  placeholder="Como podemos ajudar?"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors"
              >
                Enviar Mensagem
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-bold mb-6" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                Canais de Atendimento
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">WhatsApp</h3>
                    <p className="text-gray-500 text-sm">Segunda a Sábado, das 9h às 20h</p>
                    <a href="https://wa.me/5511999999999" className="text-primary font-medium hover:underline">
                      (11) 99999-9999
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-gray-500 text-sm">Respondemos em até 24h úteis</p>
                    <a href="mailto:contato@dripshop.com.br" className="text-primary font-medium hover:underline">
                      contato@dripshop.com.br
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Telefone</h3>
                    <p className="text-gray-500 text-sm">Segunda a Sábado, das 9h às 20h</p>
                    <a href="tel:1133333333" className="text-primary font-medium hover:underline">
                      (11) 3333-3333
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-bold mb-6" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
               Horário de Funcionamento
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Segunda a Sexta</span>
                  <span className="font-medium">9h às 20h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Sábado</span>
                  <span className="font-medium">9h às 18h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Domingo e Feriados</span>
                  <span className="font-medium">Fechado</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm" id="rastrear">
              <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                Rastrear Pedido
              </h2>
              <p className="text-gray-500 text-sm mb-4">
                Para rastrear seu pedido, utilize o código de rastreio enviado por email após a postagem.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="Código de rastreio"
                />
                <button className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors">
                  Rastrear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
