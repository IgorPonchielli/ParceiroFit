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
