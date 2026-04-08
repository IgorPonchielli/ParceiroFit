"use client";

import { useState } from "react";
import { Dumbbell, ArrowLeft, Check, X, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { workspaceService } from "@/services/workspaceService";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
    slug: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const router = useRouter();

  // Validações
  const isPasswordValid = (pass: string) => {
    const minLength = pass.length >= 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    return minLength && hasUpper && hasLower && hasNumber && hasSpecial;
  };

  const isSlugValid = (slug: string) => {
    return /^[a-z0-9-]+$/.test(slug) && !slug.includes(" ") && !slug.includes("_");
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

    if (!isSlugValid(formData.slug)) {
      setError("Sua URL amigável deve conter apenas letras minúsculas, números e hífens.");
      return;
    }

    setIsLoading(true);

    try {
      // Validar se slug já existe
      const existingWorkspace = await workspaceService.getWorkspaceBySlug(formData.slug);
      if (existingWorkspace) {
        setError("Este endereço já está em uso. Escolha outra URL amigável.");
        setIsLoading(false);
        return;
      }

      await register(
        formData.email,
        formData.password,
        formData.displayName,
        formData.slug
      );
      router.push(`/${formData.slug}/dashboard`);
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
      <div className="w-full max-w-lg">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Voltar para Login
        </Link>

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-premium rounded-2xl mx-auto flex items-center justify-center mb-4 transform rotate-6">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white italic">
            SEJA UM <span className="text-emerald-400">FITCREATOR</span>
          </h1>
          <p className="text-gray-400 mt-2">Crie sua plataforma profissional em segundos.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5 bg-gray-900/50 p-8 rounded-3xl border border-gray-800 shadow-2xl backdrop-blur-sm">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-xl text-sm text-center font-medium animate-shake">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">Nome do Profissional</label>
              <input
                type="text"
                placeholder="Ex: João Silva"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-gray-700 transition-all placeholder:text-gray-600"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">Sua URL (Link Único)</label>
              <input
                type="text"
                placeholder="joao-personal"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[\s_]/g, "-").replace(/[^a-z0-9-]/g, "") })}
                className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-gray-700 transition-all placeholder:text-gray-600"
                required
              />
              <p className="text-[10px] text-gray-500 ml-1">parceirofit.com.br/{formData.slug || "sua-url"}</p>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">E-mail Profissional</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-gray-700 transition-all placeholder:text-gray-600"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">Senha de Acesso</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-gray-700 transition-all placeholder:text-gray-600"
              required
            />
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 p-2 bg-gray-950/50 rounded-lg border border-gray-800/50">
              <ValidationItem label="Mínimo 8 caracteres" isValid={formData.password.length >= 8} />
              <ValidationItem label="Uma letra maiúscula" isValid={/[A-Z]/.test(formData.password)} />
              <ValidationItem label="Uma letra minúscula" isValid={/[a-z]/.test(formData.password)} />
              <ValidationItem label="Um número" isValid={/[0-9]/.test(formData.password)} />
              <ValidationItem label="Caractere especial" isValid={/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">Confirmar Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-gray-700 transition-all placeholder:text-gray-600"
              required
            />
            {formData.confirmPassword && (
              <div className={`flex items-center gap-2 text-[10px] mt-1 ${formData.password === formData.confirmPassword ? "text-emerald-400" : "text-red-400"}`}>
                {formData.password === formData.confirmPassword ? (
                  <><Check className="w-3 h-3" /> As senhas coincidem</>
                ) : (
                  <><X className="w-3 h-3" /> As senhas não coincidem</>
                )}
              </div>
            )}
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] mt-4 flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>Criar Minha Plataforma</>
            )}
          </button>
          
          <p className="text-center text-[10px] text-gray-500 px-8">
            Ao criar sua conta, você concorda com nossos Termos de Uso e Política de Privacidade.
          </p>
        </form>
      </div>
    </div>
  );
}
