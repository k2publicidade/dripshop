import type { Metadata } from "next";
import "./globals.css";
import LayoutShell from "@/components/layout/LayoutShell";

export const metadata: Metadata = {
  title: "DripShop | Drops exclusivos de RAP e FUNK brasileiro",
  description: "Peças oficiais e drops exclusivos de artistas do RAP e FUNK brasileiro. Vista a cultura, leve sua identidade para a rua.",
  keywords: "roupas rap brasileiro, roupas funk, drops exclusivos, camisetas de artistas, DripShop",
  openGraph: {
    title: "DripShop | Vista a cultura que vive em você",
    description: "Drops exclusivos e peças oficiais para quem vive o RAP e o FUNK brasileiro.",
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
