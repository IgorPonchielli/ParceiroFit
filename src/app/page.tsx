"use client";

import { Dumbbell } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center p-6 bg-gray-950 min-h-screen text-center">
      <div className="w-full max-w-md">
        <div className="mb-10">
          <div className="w-20 h-20 bg-premium rounded-2xl mx-auto flex items-center justify-center mb-4 transform rotate-12 transition-transform hover:rotate-0 cursor-pointer">
            <Dumbbell className="w-10 h-10 text-white transform -rotate-12" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Parceiro<span className="text-emerald-400">Fit</span>
          </h1>
          <p className="text-gray-400 mt-2 text-lg">Sua plataforma, suas regras.</p>
        </div>

        <div className="space-y-4">
          <Link 
            href="/login" 
            className="w-full block bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] text-lg text-center"
          >
            Login
          </Link>
          
          <Link 
            href="/register-user" 
            className="w-full block bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 rounded-xl transition-all border border-gray-700 active:scale-[0.98] text-lg text-center"
          >
            Registrar-se
          </Link>
        </div>

        <div className="mt-8">
          <a className="text-sm text-gray-500 hover:text-emerald-400 transition-colors" href="/register-parceirofit/">Quer se tornar um parceiro fit? <span className="font-bold underline">Começar Agora</span></a>
        </div>
      </div>
    </div>
  );
}
