import { Metadata } from "next";
import { MapPin, Phone, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Nossas Lojas - DripShop",
  description: "Encontre a loja física da DripShop mais próxima de você. Visite nossas lojas e conheça nossas coleções presencialmente.",
};

const stores = [
  {
    name: "DripShop Pinheiros",
    address: "Rua dos Pinheiros, 870 - Pinheiros",
    city: "São Paulo - SP",
    phone: "(11) 3031-3031",
    hours: "Segunda a Sábado: 10h às 22h | Domingo: 14h às 20h",
  },
  {
    name: "DripShop Vila Olimpia",
    address: "Av. Faria Lima, 2232 - Vila Olimpia",
    city: "São Paulo - SP",
    phone: "(11) 3040-4040",
    hours: "Segunda a Sábado: 10h às 22h | Domingo: 14h às 20h",
  },
  {
    name: "DripShop Moema",
    address: "Av. Moema, 300 - Moema",
    city: "São Paulo - SP",
    phone: "(11) 5050-5050",
    hours: "Segunda a Sábado: 10h às 21h | Domingo: 14h às 19h",
  },
  {
    name: "DripShop Shopping Center 3",
    address: "Av. Paulista, 2064 - Conj 101 - Bela Vista",
    city: "São Paulo - SP",
    phone: "(11) 3284-8484",
    hours: "Segunda a Sábado: 10h às 22h | Domingo: 14h às 20h",
  },
];

export default function OndeEncontrarPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container py-12">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            Nossas Lojas
          </h1>
          <p className="text-gray-500">
            Visite uma de nossas lojas e conheça nossas coleções pessoalmente
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stores.map((store, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                    {store.name}
                  </h3>
                  <p className="text-gray-600 mb-1">{store.address}</p>
                  <p className="text-gray-500 text-sm mb-3">{store.city}</p>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Phone className="w-4 h-4" />
                    <span>{store.phone}</span>
                  </div>
                  
                  <div className="flex items-start gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{store.hours}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            Em breve mais lojas
          </h2>
          <p className="text-gray-600">
            Estamos expandindo nossa presença pelo Brasil. Em breve, novas unidades em outras cidades.
          </p>
        </div>
      </div>
    </div>
  );
}
