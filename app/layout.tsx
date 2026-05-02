import type { Metadata } from "next";
import { Sora, Poppins, Geist_Mono } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Katalyzer Regulariza · Portal do Contribuinte",
  description:
    "Quite ou parcele sua dívida ativa sem burocracia. Consulte sua situação fiscal, simule parcelamentos e feche o acordo em menos de 5 minutos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${sora.variable} ${poppins.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-kr-cream text-kr-deep">
        {children}
      </body>
    </html>
  );
}
