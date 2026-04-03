"use client";

import { Dumbbell } from "lucide-react";
import Link from "next/link";

export default function Login() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center p-6 bg-gray-950">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-premium rounded-2xl mx-auto flex items-center justify-center mb-4 transform rotate-12">
            <Dumbbell className="w-10 h-10 text-white transform -rotate-12" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Parceiro<span className="text-emerald-400">Fit</span>
          </h1>
          <p className="text-gray-400 mt-2">Sua plataforma, suas regras.</p>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="E-mail"
            className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <Link href="/paywall" className="block mt-2">
            <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-colors">
              Entrar como Profissional
            </button>
          </Link>
          <div className="text-center mt-4 text-sm text-gray-500">
            <a href="#" className="hover:text-emerald-400">
              Criar nova conta
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
