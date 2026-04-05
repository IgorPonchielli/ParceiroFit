"use client";

import { useState, useEffect } from "react";
import { Dumbbell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, currentUser, userProfile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (currentUser && userProfile) {
      const currentPath = window.location.pathname;
      const targetPath = userProfile.paymentStatus === "paid" 
        ? `/${userProfile.slug}/dashboard` 
        : "/paywall";

      // Adicionamos "/" no final do targetPath para comparar com o window.location.pathname do Next.js se trailingSlash: true
      const normalizedTargetPath = targetPath.endsWith("/") ? targetPath : `${targetPath}/`;
      const normalizedCurrentPath = currentPath.endsWith("/") ? currentPath : `${currentPath}/`;

      if (normalizedCurrentPath === "/" || normalizedCurrentPath !== normalizedTargetPath) {
        console.log("Redirecting to:", targetPath);
        router.push(targetPath);
      } else {
        // Se já estamos no path correto mas a tela de login ainda está aparecendo (devido ao rewrite),
        // forçamos um reload ou uma navegação de nível de janela para "destravar" o Next.js
        console.log("Already on target path but still in login view. Forcing refresh.");
        // Pequeno delay para garantir que o Firebase Auth persistiu
        setTimeout(() => {
          window.location.href = targetPath;
        }, 500);
      }
    }
  }, [currentUser, userProfile, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      // O useEffect lidará com o redirecionamento assim que o profile for carregado
    } catch (err: any) {
      console.error("Erro ao fazer login:", err);
      setError("Email ou senha incorretos.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center p-6 bg-gray-950 min-h-screen">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-premium rounded-2xl mx-auto flex items-center justify-center mb-4 transform rotate-12 transition-transform hover:rotate-0 cursor-pointer">
            <Dumbbell className="w-10 h-10 text-white transform -rotate-12" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Parceiro<span className="text-emerald-400">Fit</span>
          </h1>
          <p className="text-gray-400 mt-2 text-lg">Sua plataforma, suas regras.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-xl text-sm text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 ml-1">E-MAIL</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-gray-700 transition-all"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 ml-1">SENHA</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-gray-700 transition-all"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] mt-2 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              "Entrar como Profissional"
            )}
          </button>
          
          <div className="text-center mt-6">
            <Link href="/register" className="text-sm text-gray-500 hover:text-emerald-400 transition-colors">
              Ainda não tem conta? <span className="font-bold underline">Começar Agora</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
