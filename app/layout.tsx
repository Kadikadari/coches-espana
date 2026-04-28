import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "CochesEspaña | Compra y Venta de Coches de Segunda Mano en España",
  description: "El portal líder para comprar y vender coches usados en Madrid, Barcelona, Valencia y toda España. Encuentra las mejores ofertas en Seat, BMW, Audi y más.",
  keywords: ["coches de segunda mano", "comprar coche", "vender coche", "coches usados España", "coches baratos", "mercado de automoción"],
  authors: [{ name: "CochesEspaña" }],
  openGraph: {
    title: "CochesEspaña | Tu coche ideal al mejor precio",
    description: "Miles de coches de ocasión esperándote. Publica tu anuncio gratis.",
    url: "https://coches-espana.vercel.app",
    siteName: "CochesEspaña",
    images: [
      {
        url: "/og-image.jpg", // تأكد من وضع صورة بهذا الاسم في مجلد public لاحقاً
        width: 1200,
        height: 630,
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  alternates: {
    canonical: "https://coches-espana.vercel.app",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
