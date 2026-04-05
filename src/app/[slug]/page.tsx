"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Unlock, Play, Crown, Lock, PlaySquare, Calendar, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { workspaceService } from "@/services/workspaceService";
import { userService } from "@/services/userService";
import { Workspace, User } from "@/types/models";

export default function StudentView() {
  const { slug } = useParams();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [professional, setProfessional] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!slug) return;
      try {
        const ws = await workspaceService.getWorkspaceBySlug(slug as string);
        if (ws) {
          setWorkspace(ws);
          const prof = await userService.getUser(ws.professionalId);
          setProfessional(prof);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do workspace:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center h-screen bg-gray-950">
        <div 
          className="w-12 h-12 border-4 rounded-full animate-spin border-emerald-500/30 border-t-emerald-500"
        ></div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center h-screen bg-gray-950 p-6 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">404</h1>
        <p className="text-gray-400 mb-8">Workspace não encontrada ou endereço incorreto.</p>
        <Link 
          href="/" 
          className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold"
        >
          Voltar para Início
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-950 pb-24 relative min-h-screen">
      {/* Capa */}
      <div className="h-40 md:h-64 bg-gray-800 relative w-full">
        <Image 
          src={workspace.coverUrl || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&h=600&fit=crop"} 
          fill 
          alt="Cover" 
          className="object-cover opacity-60" 
          priority 
        />
        <Link href="/" className="absolute top-4 left-4 bg-black/50 p-2 rounded-full backdrop-blur hover:bg-black/70 transition">
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        
        {/* Desktop Navigation */}
        <div className="absolute top-4 right-4 hidden md:flex items-center gap-8 bg-black/50 px-8 py-3 rounded-full backdrop-blur z-20">
          <button 
            className="flex items-center gap-2 font-medium transition"
            style={{ color: workspace.theme?.primary || "#10b981" }}
          >
            <PlaySquare className="w-5 h-5" /> Aulas
          </button>
          <button className="text-gray-300 hover:text-white flex items-center gap-2 font-medium transition">
            <Calendar className="w-5 h-5" /> Treino
          </button>
          <Link href={`/${slug}/chat`}>
            <button className="text-gray-300 hover:text-white flex items-center gap-2 font-medium transition">
              <MessageCircle className="w-5 h-5" /> Prof
            </button>
          </Link>
        </div>
      </div>
      
      <div className="px-4 relative flex-1 max-w-5xl mx-auto w-full -mt-16 md:-mt-24">
        {/* Info do Perfil */}
        <div className="flex justify-between items-end mb-6 bg-gray-950/80 backdrop-blur-md p-4 rounded-3xl border border-gray-800 shadow-xl">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-gray-950 overflow-hidden bg-gray-800 z-10 relative shadow-2xl">
            <Image 
              src={professional?.avatarUrl || "https://i.pravatar.cc/150?img=11"} 
              fill 
              alt="Profile" 
              className="object-cover" 
            />
          </div>
          <div className="flex gap-6 text-center pb-2 text-white">
            <div>
              <span className="font-bold block text-xl md:text-2xl">86</span>
              <span className="text-xs md:text-sm text-gray-400">Aulas</span>
            </div>
            <div>
              <span className="font-bold block text-xl md:text-2xl">4.9</span>
              <span className="text-xs md:text-sm text-gray-400">Estrelas</span>
            </div>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight">
          {professional?.displayName || "Oficina do Corpo"} <span style={{ color: workspace.theme?.primary || "#10b981" }}>⚡️</span>
        </h1>
        <p className="text-sm md:text-base text-gray-300 mt-2 mb-6 leading-relaxed max-w-2xl">
          {workspace.biography}
        </p>

        {/* Botão Assinar */}
        <button 
          className="w-full md:w-auto md:px-8 transition-all text-white font-bold py-3 md:py-4 rounded-xl md:rounded-full mb-8 shadow-lg flex justify-center items-center gap-2 md:text-lg active:scale-95"
          style={{ 
            backgroundColor: workspace.theme?.primary || "#10b981",
            boxShadow: `0 10px 15px -3px ${workspace.theme?.primary || "#10b981"}33`
          }}
        >
          <Unlock className="w-5 h-5" /> Assinar Plano Mensal - R$ 99
        </button>

        {/* Módulos (Mockup por enquanto) */}
        <h2 className="font-bold mb-4 flex items-center gap-2 md:text-xl text-white">
          Conteúdos Gratuitos <span className="bg-gray-800 text-xs px-2 py-1 rounded text-gray-300">Free</span>
        </h2>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar snap-x mb-10 pb-4">
          <div className="min-w-[160px] md:min-w-[220px] snap-start relative group cursor-pointer">
            <div className="h-[220px] md:h-[300px] bg-gray-800 rounded-xl overflow-hidden relative shadow-lg">
              <Image src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&h=800&fit=crop" fill alt="Thumb" className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-90"></div>
              <div className="absolute bottom-4 left-4 text-sm md:text-base font-bold text-white">Mito do Aeróbico</div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full backdrop-blur group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 md:w-8 md:h-8 fill-white text-white" />
              </div>
            </div>
          </div>
          <div className="min-w-[160px] md:min-w-[220px] snap-start relative group cursor-pointer">
            <div className="h-[220px] md:h-[300px] bg-gray-800 rounded-xl overflow-hidden relative shadow-lg">
              <Image src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=800&fit=crop" fill alt="Thumb" className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-90"></div>
              <div className="absolute bottom-4 left-4 text-sm md:text-base font-bold text-white">Dica de Pré-Treino</div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full backdrop-blur group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 md:w-8 md:h-8 fill-white text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Sessão Premium */}
        <h2 className="font-bold mb-4 flex items-center gap-2 md:text-xl" style={{ color: workspace.theme?.primary || "#10b981" }}>
          <Crown className="w-6 h-6" /> Premium Exclusivo
        </h2>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar snap-x pb-4">
          <div className="min-w-[280px] md:min-w-[400px] snap-start relative cursor-not-allowed group text-white">
            <div className="h-[160px] md:h-[220px] bg-gray-800 rounded-xl overflow-hidden relative shadow-lg">
              <Image src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=500&fit=crop" fill alt="Thumb" className="object-cover opacity-30 grayscale blur-[2px] group-hover:blur-[1px] transition-all" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <Lock className="w-8 h-8 md:w-10 md:h-10 text-gray-400 mb-2" />
                <span className="text-sm md:text-lg font-bold">Módulo Hipertrofia</span>
                <span className="text-xs md:text-sm text-gray-400 mt-1">Assine para desbloquear</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 w-full bg-gray-900/95 backdrop-blur-lg border-t border-gray-800 z-50 md:hidden">
        <div className="max-w-5xl mx-auto flex justify-around py-4 pb-6 px-6 md:pb-4">
          <button 
            className="flex flex-col items-center transition"
            style={{ color: workspace.theme?.primary || "#10b981" }}
          >
            <PlaySquare className="w-6 h-6 md:w-7 md:h-7" />
            <span className="text-[10px] md:text-xs mt-1">Aulas</span>
          </button>
          <button className="text-gray-500 hover:text-white flex flex-col items-center transition">
            <Calendar className="w-6 h-6 md:w-7 md:h-7" />
            <span className="text-[10px] md:text-xs mt-1">Treino</span>
          </button>
          <Link href={`/${slug}/chat`}>
            <button className="text-gray-500 hover:text-white flex flex-col items-center transition">
              <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
              <span className="text-[10px] md:text-xs mt-1">Prof</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
