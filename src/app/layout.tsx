import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Portal de Indicadores de Ensino — SINAES/UEMS",
  description:
    "Monitoramento Estratégico Institucional para Gestão de Qualidade. Portal de Indicadores de Ensino SINAES UEMS.",
  keywords: ["SINAES", "UEMS", "ENADE", "IDD", "CPC", "IGC", "Indicadores", "Ensino Superior"],
  icons: {
    icon: "https://www.uems.br/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased bg-slate-50 text-foreground`}
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
