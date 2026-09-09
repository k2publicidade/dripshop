import {getContent} from '@/lib/content';
import type { Metadata } from "next";
import "./globals.css";
import "./street.css";
import "./appearance.css";
import LayoutShell from "@/components/layout/LayoutShell";

export const metadata: Metadata = {
  title: "DripShop | Streetwear oficial de artistas do Rap e Funk",
  description: "Peças oficiais e drops exclusivos de artistas do RAP e FUNK brasileiro. Vista a cultura, leve sua identidade para a rua.",
  keywords: "roupas rap brasileiro, roupas funk, drops exclusivos, camisetas de artistas, DripShop",
  openGraph: {
    title: "DripShop | Vista a cultura que vive em você",
    description: "Drops exclusivos e peças oficiais para quem vive o RAP e o FUNK brasileiro.",
    type: "website",
    locale: "pt_BR",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <LayoutShell sections={await getContent()}>{children}</LayoutShell>
      </body>
    </html>
  );
}
