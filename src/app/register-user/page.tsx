"use client";

import { useState } from "react";
import { Dumbbell, ArrowLeft, Check, X, UserCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterUser() {
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const router = useRouter();

  const isPasswordValid = (pass: string) => {
    const minLength = pass.length >= 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    return minLength && hasUpper && hasLower && hasNumber && hasSpecial;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isPasswordValid(formData.password)) {
      setError("A senha não atende aos requisitos de segurança.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setIsLoading(true);

    try {
      await register(
        formData.email,
        formData.password,
        formData.displayName,
        "", // no slug
        "client" // student role
      );
      router.push("/explore");
    } catch (err: any) {
      console.error("Erro ao registrar:", err);
      if (err.code === "auth/email-already-in-use") {
        setError("Este e-mail já está em uso.");
      } else {
        setError("Ocorreu um erro ao criar sua conta. Tente novamente.");
      }
      setIsLoading(false);
    }
  };

  const ValidationItem = ({ label, isValid }: { label: string; isValid: boolean }) => (
    <div className={`flex items-center gap-2 text-xs ${isValid ? "text-emerald-400" : "text-gray-500"}`}>
      {isValid ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
      {label}
    </div>
  );

  return (
    <div className="flex-1 flex flex-col justify-center items-center p-6 bg-gray-950 min-h-screen">
      <div className="w-full max-w-md">
        <Link href="/login" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 group text-sm">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Voltar para Login
        </Link>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl mx-auto flex items-center justify-center mb-4 border border-emerald-500/20">
            <UserCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white italic">
            CRIAR CONTA <span className="text-emerald-400">ALUNO</span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm">Acesse treinos e acompanhamento personalizado.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5 bg-gray-900/40 p-8 rounded-3xl border border-gray-800 backdrop-blur-sm shadow-2xl">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl text-sm text-center font-medium">
              {error}
            </div>
          )}
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">Seu Nome Completo</label>
            <input
              type="text"
              placeholder="Ex: Rafael Souza"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className="w-full bg-gray-800/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 border border-gray-700 transition-all placeholder:text-gray-600"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">E-mail</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-gray-800/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 border border-gray-700 transition-all placeholder:text-gray-600"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-gray-800/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 border border-gray-700 transition-all placeholder:text-gray-600"
              required
            />
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 p-3 bg-gray-950/50 rounded-xl border border-gray-800/50">
              <ValidationItem label="Mín 8 caracteres" isValid={formData.password.length >= 8} />
              <ValidationItem label="Maiúscula" isValid={/[A-Z]/.test(formData.password)} />
              <ValidationItem label="Minúscula" isValid={/[a-z]/.test(formData.password)} />
              <ValidationItem label="Número" isValid={/[0-9]/.test(formData.password)} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">Confirmar Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full bg-gray-800/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 border border-gray-700 transition-all placeholder:text-gray-600"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] mt-4 flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              "Começar Jornada Fit"
            )}
          </button>
        </form>

        <p className="text-center text-[10px] text-gray-500 mt-6 px-10 leading-relaxed uppercase tracking-widest">
          Ao clicar em Começar, você aceita nossos termos de uso.
        </p>
      </div>
    </div>
  );
}
