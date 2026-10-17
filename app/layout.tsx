import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Niane. | Radar de Prospection & Audit IA B2B",
  description:
    "Plateforme de détection de besoins digitaux, d'audit automatisé par IA et de prospection B2B pour prestataires Tech & Digital (FCFA / EUR).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-white text-[#18241d]">
        {children}
      </body>
    </html>
  );
}
