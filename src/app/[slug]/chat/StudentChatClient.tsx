"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Camera, Send, ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { workspaceService } from "@/services/workspaceService";
import { userService } from "@/services/userService";
import { Workspace, User } from "@/types/models";

export default function StudentChatClient() {
  const { slug } = useParams();
  const [professional, setProfessional] = useState<User | null>(null);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);

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
        console.error("Erro ao buscar dados do chat:", error);
      }
    }
    fetchData();
  }, [slug]);

  const primaryColor = workspace?.theme?.primary || "#10b981";

  return (
    <div className="flex-1 flex flex-col bg-gray-950 h-screen w-full relative overflow-hidden">
      <div className="bg-gray-900 border-b border-gray-800 z-10 w-full relative">
        <div className="max-w-4xl mx-auto p-4 flex items-center pt-8 md:pt-4 justify-between">
          <div className="flex items-center">
            <Link href={`/${slug}`} className="mr-4 text-gray-400 hover:text-white transition">
              <ArrowLeft />
            </Link>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-700 relative mr-3 bg-gray-800">
               <Image 
                 src={professional?.avatarUrl || "https://i.pravatar.cc/150?img=11"} 
                 fill 
                 alt="Prof" 
                 className="object-cover" 
               />
            </div>
            <div>
              <h3 className="font-bold text-sm md:text-base text-white">
                {professional?.displayName || "Carregando..."}
              </h3>
              <p className="text-xs" style={{ color: primaryColor }}>Online</p>
            </div>
          </div>
          
          <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg text-sm transition">
            <ImageIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Enviar Foto</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto w-full pb-24 text-white">
        <div className="max-w-4xl mx-auto p-4 space-y-6">
          
          {/* Mensagem Aluno (Você) - Agora na Direita */}
          <div className="flex flex-col items-end self-end max-w-[85%] md:max-w-[70%] ml-auto">
            <div 
              className="p-3 md:p-4 rounded-2xl rounded-tr-sm text-sm md:text-base text-white shadow-md"
              style={{ backgroundColor: primaryColor }}
            >
              Professor, terminei a semana 2. Olha como está secando! Posso manter o carbo baixo?
            </div>
            <div className="mt-2 w-32 h-40 md:w-48 md:h-64 bg-gray-800 rounded-xl overflow-hidden border border-gray-700 relative shadow-md self-end">
              <Image src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=600&fit=crop" fill alt="Minha Evolução" className="object-cover" />
            </div>
            <span className="text-[10px] md:text-xs text-gray-500 mt-1">10:42</span>
          </div>

          {/* Mensagem Prof - Agora na Esquerda */}
          <div className="flex flex-col items-start max-w-[85%] md:max-w-[70%]">
            <div className="bg-gray-800 p-3 md:p-4 rounded-2xl rounded-tl-sm text-sm md:text-base shadow-md text-white border border-gray-700">
              Excelente evolução Marcos! Segura o carbo por mais 3 dias e na sexta a gente faz um refeed. Vou liberar o módulo de abdômen pra você amanhã.
            </div>
            <span className="text-[10px] md:text-xs text-gray-500 mt-1">11:15</span>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 w-full bg-gray-900 border-t border-gray-800 z-10">
        <div className="max-w-4xl mx-auto p-4 pb-6 md:pb-4 flex items-center gap-2">
          <button className="p-2 md:p-3 text-gray-400 hover:text-emerald-400 bg-gray-800 rounded-full transition">
            <Camera className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <input
            type="text"
            placeholder="Escreva sua resposta..."
            className="flex-1 bg-gray-800 rounded-full px-4 py-3 text-sm md:text-base focus:outline-none focus:ring-1 text-white shadow-inner"
            style={{ "--tw-ring-color": primaryColor } as any}
          />
          <button 
            className="p-2 md:p-3 text-white rounded-full transition shadow-lg"
            style={{ backgroundColor: primaryColor }}
          >
            <Send className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
