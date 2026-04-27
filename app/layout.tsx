import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CochesEspaña - Compra y Venta de Coches de Segunda Mano y Ocasión",
  description: "Encuentra los mejores coches de segunda mano, ocasión y km 0 en toda España. Vende tu coche gratis al mejor precio. Líderes en automoción en Madrid, Barcelona, Valencia y más.",
  keywords: [
    "coches de segunda mano", "comprar coche usado", "vender coche España",
    "coches de ocasión", "vehículos km 0", "coches baratos", "coches seminuevos",
    "anuncios de coches gratis", "tasación de coches", "coches eléctricos",
    "coches híbridos", "Seat segunda mano", "Volkswagen ocasión", "BMW de segunda mano",
    "Mercedes usados", "Audi km 0", "Toyota híbridos", "coches en Madrid",
    "coches en Barcelona", "coches en Valencia", "coches en Sevilla", "coches en Málaga",
    "concesionarios España", "venta de automóviles", "motor España", "meجores ofertas coches",
    "coches diésel", "coches gasolina", "furgonetas de ocasión", "suv segunda mano"
  ],
  authors: [{ name: "CochesEspaña Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  alternates: {
    canonical: "https://cochesespana.com",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://cochesespana.com",
    title: "CochesEspaña - El portal líder del motor en España",
    description: "Compra y vende tu coche de la forma más fácil y rápida. Miles de anuncios actualizados diariamente.",
    siteName: "CochesEspaña",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
