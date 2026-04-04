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
  title: "ParceiroFit App",
  description: "Plataforma SaaS Fitness",
  manifest: "/manifest.json", // Adicionado para suporte ao PWA
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="bg-gray-950 text-white font-sans overflow-x-hidden min-h-screen flex flex-col">
        {/* Container Principal */}
        <div className="w-full flex-1 flex flex-col relative">
          {children}
        </div>
      </body>
    </html>
  );
}

<script dangerouslySetInnerHTML={{
  __html: `
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js');
      });
    }
  `
}} />