import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smash or Pass Recipes",
  description: "Descubra novas receitas com um toque.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}