import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; //
// Ajustado para importar de 'auth-context.tsx'
import { AuthProvider } from '../contexts/auth-context'; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Projeto Escala FDS",
  description: "Gerenciamento de Escalas de Trabalho",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gray-900 text-gray-100 antialiased`}>
        <AuthProvider> {/* Envolve com AuthProvider */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}