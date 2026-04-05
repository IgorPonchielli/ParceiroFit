"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { workspaceService } from "@/services/workspaceService";
import { userService } from "@/services/userService";
import { Workspace, User } from "@/types/models";
import { ArrowLeft, Save, Palette, Type, Image as ImageIcon, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const PRESET_PALETTES = [
  { name: "Emerald", primary: "#10b981", secondary: "#064e3b", label: "Energia & Saúde" },
  { name: "Blue", primary: "#3b82f6", secondary: "#1e3a8a", label: "Confiança & Foco" },
  { name: "Orange", primary: "#f97316", secondary: "#7c2d12", label: "Motivação & Força" },
  { name: "Purple", primary: "#a855f7", secondary: "#4c1d95", label: "Premium & Exclusivo" },
  { name: "Red", primary: "#ef4444", secondary: "#7f1d1d", label: "Intensidade & Poder" },
];

export default function PersonalizarPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { userProfile } = useAuth();
  
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [biography, setBiography] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#10b981");
  const [secondaryColor, setSecondaryColor] = useState("#064e3b");
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      try {
        const ws = await workspaceService.getWorkspaceBySlug(slug as string);
        if (ws) {
          setWorkspace(ws);
          setBiography(ws.biography || "");
          setPrimaryColor(ws.theme?.primary || "#10b981");
          setSecondaryColor(ws.theme?.secondary || "#064e3b");
          
          if (userProfile) {
            setDisplayName(userProfile.displayName || "");
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados para personalização:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [slug, userProfile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // 1. Atualizar Perfil do Usuário (Nome)
      await userService.updateUser(userProfile.uid, {
        displayName: displayName.trim(),
      });

      // 2. Atualizar Workspace (Bio e Cores)
      await workspaceService.updateWorkspace(userProfile.uid, {
        biography: biography.trim(),
        theme: {
          primary: primaryColor,
          secondary: secondaryColor,
        }
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Erro ao salvar personalização:", error);
      alert("Ocorreu um erro ao salvar as alterações. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const applyPalette = (primary: string, secondary: string) => {
    setPrimaryColor(primary);
    setSecondaryColor(secondary);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center h-screen bg-gray-950">
        <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-950 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/${slug}/dashboard`} className="text-gray-400 hover:text-white transition">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight">Personalização</h1>
          </div>
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : saveSuccess ? (
              <><CheckCircle2 className="w-5 h-5" /> Salvo!</>
            ) : (
              <><Save className="w-5 h-5" /> Salvar</>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        
        {/* Formulário (Lado Esquerdo/Centro) */}
        <div className="lg:col-span-12 space-y-8">
          
          {/* Sessão: Identidade Visual */}
          <section className="bg-gray-900 rounded-3xl p-6 border border-gray-800 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400">
                <Palette className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white">Identidade Visual & Cores</h2>
            </div>

            <div className="space-y-8">
              {/* Paletas de Cores */}
              <div>
                <label className="text-sm font-bold text-gray-400 mb-4 block uppercase tracking-wider">Escolha uma Paleta Curada</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {PRESET_PALETTES.map((palette) => (
                    <button
                      key={palette.name}
                      onClick={() => applyPalette(palette.primary, palette.secondary)}
                      className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                        primaryColor === palette.primary && secondaryColor === palette.secondary
                          ? "border-emerald-500 bg-emerald-500/5"
                          : "border-gray-800 bg-gray-950/50 hover:border-gray-700"
                      }`}
                    >
                      <div className="flex gap-1">
                        <div className="w-8 h-8 rounded-full shadow-lg" style={{ backgroundColor: palette.primary }}></div>
                        <div className="w-8 h-8 rounded-full shadow-lg -ml-3" style={{ backgroundColor: palette.secondary }}></div>
                      </div>
                      <span className="text-[10px] font-bold text-gray-300 uppercase">{palette.name}</span>
                      <span className="text-[9px] text-gray-500 text-center leading-tight">{palette.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ajuste Manual */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-950/50 rounded-2xl border border-gray-800/50">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Cor de Destaque (Principal)</label>
                    <div className="flex items-center gap-4">
                        <input 
                            type="color" 
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="w-12 h-12 rounded-lg cursor-pointer bg-transparent border-none"
                        />
                        <input 
                            type="text" 
                            value={primaryColor.toUpperCase()}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="flex-1 bg-gray-800 text-white rounded-xl px-4 py-3 text-sm font-mono border border-gray-700"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Cor de Suporte (Secundária)</label>
                    <div className="flex items-center gap-4">
                        <input 
                            type="color" 
                            value={secondaryColor}
                            onChange={(e) => setSecondaryColor(e.target.value)}
                            className="w-12 h-12 rounded-lg cursor-pointer bg-transparent border-none"
                        />
                        <input 
                            type="text" 
                            value={secondaryColor.toUpperCase()}
                            onChange={(e) => setSecondaryColor(e.target.value)}
                            className="flex-1 bg-gray-800 text-white rounded-xl px-4 py-3 text-sm font-mono border border-gray-700"
                        />
                    </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sessão: Informações de Perfil */}
          <section className="bg-gray-900 rounded-3xl p-6 border border-gray-800 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                <Type className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white">Conteúdo & Bio</h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Nome de Exibição</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-gray-800 text-white rounded-xl px-4 py-4 focus:outline-none focus:ring-2 border border-gray-700 transition-all font-bold"
                  placeholder="Nome que seus alunos verão"
                  style={{ borderColor: primaryColor + "30", "--tw-ring-color": primaryColor } as any}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Sua Biografia / Pitch</label>
                <textarea
                  value={biography}
                  onChange={(e) => setBiography(e.target.value)}
                  className="w-full bg-gray-800 text-white rounded-2xl px-4 py-4 h-32 focus:outline-none focus:ring-2 border border-gray-700 transition-all resize-none leading-relaxed"
                  placeholder="Conte um pouco sobre sua metodologia e resultados..."
                  style={{ borderColor: primaryColor + "30", "--tw-ring-color": primaryColor } as any}
                />
              </div>
            </div>
          </section>

          {/* Sessão: Capa & Imagens (Visualização) */}
          <section className="bg-gray-900 rounded-3xl p-6 border border-gray-800 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                <ImageIcon className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white">Capa Atual</h2>
            </div>
            
            <div className="relative h-40 md:h-56 bg-gray-800 rounded-2xl overflow-hidden border border-gray-700/50">
              <Image 
                src={workspace?.coverUrl || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=400&fit=crop"} 
                fill 
                alt="Atual Cover" 
                className="object-cover opacity-60"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/60 backdrop-blur px-4 py-2 rounded-full text-xs font-bold text-gray-300 border border-gray-700">
                  EDIÇÃO DE IMAGEM EM BREVE
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">Para uma experiência premium, a capa é otimizada para Desktop e Mobile.</p>
          </section>

          {/* Atalho para Ver Resultado */}
          <Link href={`/${slug}`} target="_blank">
            <div className="w-full bg-gray-950 border border-gray-800 hover:border-emerald-500/50 p-4 rounded-2xl flex items-center justify-between group transition-all">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-emerald-500">
                        <ImageIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-white font-bold">Ver resultado ao vivo</h4>
                        <p className="text-xs text-gray-500">Acesse a página que seus alunos visualizam</p>
                    </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
