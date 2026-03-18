import type { Metadata } from "next";
import "./globals.css";
import LayoutShell from "@/components/layout/LayoutShell";

export const metadata: Metadata = {
  title: "DripShop - Vista o Extraordinário | Roupas e Acessórios Exclusivos",
  description: "Encontre roupas, camisetas, moletons e acessórios exclusivos. Frete grátis acima de R$199, parcelamento em 6x sem juros.",
  keywords: "roupas, camisetas, moletons, acessorios, moda, dripshop",
  openGraph: {
    title: "DripShop - Vista o Extraordinário",
    description: "Roupas e acessórios exclusivos para você expressar seu estilo.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
