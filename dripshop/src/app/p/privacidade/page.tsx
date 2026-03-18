import { Metadata } from "next";
import { Shield, Lock, Eye, Database } from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Privacidade - DripShop",
  description: "Política de Privacidade da DripShop. Veja como protegemos seus dados pessoais.",
};

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container py-12">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            Política de Privacidade
          </h1>
          <p className="text-gray-500">
            Sua privacidade é importante para nós
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-sm mb-6">
            <p className="text-gray-600 mb-6">
              Esta Política de Privacidade descreve como coletamos, usamos e protegemos suas informações 
              pessoais quando você utiliza nosso site e serviços.
            </p>
            <p className="text-gray-500 text-sm">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm mb-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  Informações que Coletamos
                </h2>
                <p className="text-gray-600">
                  Coletamos informações que você nos fornece diretamente, incluindo:
                </p>
              </div>
            </div>
            <ul className="space-y-2 text-gray-600 ml-4">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>Nome completo e dados de contato (email, telefone, endereço)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>Informações de pagamento (processadas de forma segura)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>Histórico de pedidos e preferências de compra</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>Comunicações conosco (chat, email, WhatsApp)</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm mb-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  Como Usamos suas Informações
                </h2>
                <p className="text-gray-600">
                  Utilizamos suas informações para:
                </p>
              </div>
            </div>
            <ul className="space-y-2 text-gray-600 ml-4">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>Processar e entregar seus pedidos</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>Comunicar sobre status de pedidos e promoções</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>Personalizar sua experiência de compra</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>Prevenir fraudes e garantir segurança</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>Cumprir obrigações legais</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm mb-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  Proteção de Dados
                </h2>
                <p className="text-gray-600">
                  Implementamos medidas de segurança para proteger suas informações:
                </p>
              </div>
            </div>
            <ul className="space-y-2 text-gray-600 ml-4">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>Criptografia SSL em todas as transações</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>Armazenamento seguro em conformidade com LGPD</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>Acesso restrito às suas informações</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>Monitoramento contínuo de segurança</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm mb-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Database className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  Seus Direitos (LGPD)
                </h2>
                <p className="text-gray-600">
                  Conforme a Lei Geral de Proteção de Dados, você tem direito a:
                </p>
              </div>
            </div>
            <ul className="space-y-2 text-gray-600 ml-4">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>Confirmar a existência de tratamento de dados</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>Acessar seus dados pessoais</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>Corrigir dados incompletos ou incorretos</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>Solicitar a eliminação dos seus dados</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>Revogar consentimento a qualquer momento</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              Fale Conosco
            </h2>
            <p className="text-gray-600 mb-4">
              Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato:
            </p>
            <div className="space-y-2 text-gray-600">
              <p><strong>Email:</strong> privacidade@dripshop.com.br</p>
              <p><strong>WhatsApp:</strong> (11) 99999-9999</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
