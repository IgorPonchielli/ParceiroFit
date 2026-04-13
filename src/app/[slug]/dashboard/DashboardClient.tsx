"use client";

import { Users, TrendingUp, Video, Tag, Eye, PlayCircle, Home, MessageCircle, Settings, FileText, Palette, PlaySquare, Star, Edit } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { contentService } from "@/services/contentService";
import { planService } from "@/services/planService";
import { Content } from "@/types/models";

export default function DashboardClient() {
  const { userProfile } = useAuth();
  const slug = userProfile?.slug || "";
  
  const [contents, setContents] = useState<Content[]>([]);
  const [plansMap, setPlansMap] = useState<Record<string, string>>({});
  const [isLoadingContents, setIsLoadingContents] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!userProfile?.uid) return;
      try {
        setIsLoadingContents(true);
        const [fetchedContents, fetchedPlans] = await Promise.all([
          contentService.getContentsByProfessional(userProfile.uid),
          planService.getPlansByProfessional(userProfile.uid)
        ]);

        const pMap: Record<string, string> = {};
        fetchedPlans.forEach(p => {
          if (p.id) pMap[p.id] = p.title;
        });

        setPlansMap(pMap);
        setContents(fetchedContents);
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setIsLoadingContents(false);
      }
    }

    fetchDashboardData();
  }, [userProfile?.uid]);

  const getPlanLabels = (content: Content) => {
    if (content.is_free) return "Gratuito";
    if (!content.allowed_plans || content.allowed_plans.length === 0) return "Premium (Sem Plano Vínculado)";
    return content.allowed_plans.map(id => plansMap[id] || "Plano Indisponível").join(", ");
  };
  
  return (
    <div className="flex-1 flex flex-col bg-gray-950 pb-24 relative min-h-screen">
      <div className="p-6 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center mb-8 pt-4">
          <div>
            <p className="text-gray-400 text-sm md:text-base">Bem-vindo de volta,</p>
            <h2 className="text-2xl md:text-4xl font-bold text-white">{userProfile?.displayName || "Sua Academia"}</h2>
          </div>
          
          <div className="flex items-center">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8 mr-8">
              <Link href={`/${slug}/dashboard`}>
                <button className="text-emerald-400 hover:text-emerald-300 flex items-center gap-2 font-medium transition">
                  <Home className="w-5 h-5" /> Início
                </button>
              </Link>
              <Link href={`/${slug}/dashboard/chat`}>
                <button className="text-gray-400 hover:text-white flex items-center gap-2 font-medium relative transition">
                  <MessageCircle className="w-5 h-5" /> Chat
                  <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </Link>
              <Link href={`/${slug}/dashboard/ajustes`}>
                <button className="text-gray-400 hover:text-white flex items-center gap-2 font-medium transition">
                  <Settings className="w-5 h-5" /> Ajustes
                </button>
              </Link>
            </div>

            <ProfileDropdown />
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-gray-800 p-5 md:p-8 rounded-3xl border border-gray-700 shadow-lg text-white">
            <div className="text-emerald-400 mb-3"><Users className="w-6 h-6 md:w-8 md:h-8" /></div>
            <h3 className="text-3xl md:text-5xl font-bold">124</h3>
            <p className="text-gray-400 text-xs md:text-base mt-2 font-medium">Alunos Ativos</p>
          </div>
          <div className="bg-gray-800 p-5 md:p-8 rounded-3xl border border-gray-700 shadow-lg text-white">
            <div className="text-blue-400 mb-3"><TrendingUp className="w-6 h-6 md:w-8 md:h-8" /></div>
            <h3 className="text-3xl md:text-5xl font-bold">R$ 6.2k</h3>
            <p className="text-gray-400 text-xs md:text-base mt-2 font-medium">MRR Mensal</p>
          </div>
          <div className="bg-gray-800 p-5 md:p-8 rounded-3xl border border-gray-700 shadow-lg text-white">
            <div className="text-purple-400 mb-3"><PlaySquare className="w-6 h-6 md:w-8 md:h-8" /></div>
            <h3 className="text-3xl md:text-5xl font-bold">86</h3>
            <p className="text-gray-400 text-xs md:text-base mt-2 font-medium">Conteúdos</p>
          </div>
          <div className="bg-gray-800 p-5 md:p-8 rounded-3xl border border-gray-700 shadow-lg text-white">
            <div className="text-yellow-400 mb-3"><Star className="w-6 h-6 md:w-8 md:h-8" /></div>
            <h3 className="text-3xl md:text-5xl font-bold">4.9</h3>
            <p className="text-gray-400 text-xs md:text-base mt-2 font-medium">Avaliação</p>
          </div>
        </div>

        {/* Ações Rápidas */}
        <h3 className="font-bold mb-4 md:text-lg text-white">Ações Rápidas</h3>
        <div className="flex gap-4 mb-8 overflow-x-auto hide-scrollbar pb-2">
          <Link href={`/${slug}/dashboard/novo-video`}>
            <button className="bg-gray-800 hover:bg-gray-700 transition-colors border border-gray-700 min-w-[100px] md:min-w-[140px] p-4 rounded-2xl flex flex-col items-center justify-center text-sm md:text-base gap-2 text-white h-full w-full">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-700 rounded-full flex items-center justify-center text-white">
                <Video className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              Novo Vídeo
            </button>
          </Link>
          
          <button className="bg-gray-800 hover:bg-gray-700 transition-colors border border-gray-700 min-w-[100px] md:min-w-[140px] p-4 rounded-2xl flex flex-col items-center justify-center text-sm md:text-base gap-2 text-white">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-700 rounded-full flex items-center justify-center text-purple-400">
              <FileText className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            Novo Artigo
          </button>
          
          <button className="bg-gray-800 hover:bg-gray-700 transition-colors border border-gray-700 min-w-[100px] md:min-w-[140px] p-4 rounded-2xl flex flex-col items-center justify-center text-sm md:text-base gap-2 text-white">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-700 rounded-full flex items-center justify-center text-blue-400">
              <Users className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            Meus Alunos
          </button>

          <Link href={`/${slug}/dashboard/personalizar`}>
            <button className="bg-gray-800 hover:bg-gray-700 transition-colors border border-gray-700 min-w-[100px] md:min-w-[140px] p-4 rounded-2xl flex flex-col items-center justify-center text-sm md:text-base gap-2 text-white h-full w-full">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-700 rounded-full flex items-center justify-center text-pink-400">
                <Palette className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                Personalizar
            </button>
          </Link>

          <Link href={`/${slug}/dashboard/planos`}>
            <button className="bg-gray-800 hover:bg-gray-700 transition-colors border border-gray-700 min-w-[100px] md:min-w-[140px] p-4 rounded-2xl flex flex-col items-center justify-center text-sm md:text-base gap-2 text-white h-full w-full">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-700 rounded-full flex items-center justify-center text-emerald-400">
                <Tag className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                Planos
            </button>
          </Link>

          <Link href={`/${slug}`} target="_blank">
            <button className="bg-gray-800 hover:bg-gray-700 transition-colors border border-emerald-500/30 min-w-[120px] md:min-w-[150px] p-4 rounded-2xl flex flex-col items-center justify-center text-sm md:text-base gap-2 text-emerald-400 h-full w-full">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <Eye className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              Ver como Aluno
            </button>
          </Link>
        </div>

        {/* Últimos Conteúdos */}
        <h3 className="font-bold mb-4 md:text-lg text-white">Últimos Conteúdos</h3>
        {isLoadingContents ? (
          <p className="text-gray-400">Carregando conteúdos...</p>
        ) : contents.length === 0 ? (
          <p className="text-gray-400 bg-gray-800/50 p-4 rounded-xl border border-gray-800 text-center">Nenhum conteúdo cadastrado ainda. Comece criando um novo vídeo ou artigo!</p>
        ) : (
          <div className="space-y-4 text-white">
            {contents.map((content) => (
              <div key={content.id} className="relative bg-gray-800 rounded-2xl overflow-hidden hover:opacity-90 transition-opacity group shadow-sm">
                
                {/* Mobile Link Overlay - makes entire card clickable on mobile */}
                <Link 
                  href={`/${slug}/dashboard/editar-conteudo?id=${content.id}`} 
                  className="absolute inset-0 z-10 block sm:hidden"
                />

                <div className="p-4 flex gap-4">
                  {/* Thumbnail: agora visível no mobile, com aspecto 16:9 vertical ou paisagem proximo do app do youtube */}
                  <div className="w-[110px] sm:w-[130px] shrink-0 aspect-[16/10] bg-[#252525] rounded-xl relative overflow-hidden">
                    {content.type === "video" && content.youtube_id ? (
                      <Image 
                        src={`https://img.youtube.com/vi/${content.youtube_id}/mqdefault.jpg`} 
                        fill 
                        alt={content.title} 
                        className="object-cover" 
                        unoptimized
                      />
                    ) : content.article_media && content.article_media.length > 0 ? (
                      <Image 
                        src={content.article_media[0]} 
                        fill 
                        alt={content.title} 
                        className="object-cover" 
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-gray-600" />
                      </div>
                    )}
                  </div>

                  {/* Textos */}
                  <div className="flex-1 flex flex-col justify-start overflow-hidden">
                    <h4 className="text-[15px] md:text-base font-medium line-clamp-2 leading-tight text-white pr-2">
                      {content.title}
                    </h4>
                    <p className="text-[13px] text-gray-400 mt-2 truncate max-w-full">
                      <span className={content.is_free ? "text-emerald-400" : "text-purple-400"}>
                        {content.is_free ? "Gratuito" : getPlanLabels(content)}
                      </span>
                      {" • "}
                      {content.createdAt && 'toDate' in content.createdAt ? content.createdAt.toDate().toLocaleDateString() : 'Recente'}
                    </p>
                  </div>

                  {/* Desktop Edit Button (Escondido no mobile) */}
                  <div className="hidden sm:flex items-center justify-center pl-2 relative z-20">
                    <Link href={`/${slug}/dashboard/editar-conteudo?id=${content.id}`}>
                      <button className="p-3 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors shrink-0" title="Editar Conteúdo">
                         <Edit className="w-5 h-5" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Bottom Nav Profissional */}
      <div className="fixed bottom-0 w-full bg-gray-900 border-t border-gray-800 z-50 md:hidden">
        <div className="max-w-7xl mx-auto flex justify-around py-4 pb-6 px-6 md:pb-4">
          <Link href={`/${slug}/dashboard`}>
            <button className="text-emerald-400 flex flex-col items-center hover:text-emerald-300 transition">
                <Home className="w-6 h-6 md:w-7 md:h-7" />
                <span className="text-[10px] md:text-xs mt-1">Início</span>
            </button>
          </Link>
          <Link href={`/${slug}/dashboard/chat`}>
            <button className="text-gray-500 hover:text-white flex flex-col items-center relative transition">
              <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
              <span className="text-[10px] md:text-xs mt-1">Chat</span>
              <span className="absolute top-0 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-gray-900"></span>
            </button>
          </Link>
          <Link href={`/${slug}/dashboard/ajustes`}>
            <button className="text-gray-500 hover:text-white flex flex-col items-center transition">
                <Settings className="w-6 h-6 md:w-7 md:h-7" />
                <span className="text-[10px] md:text-xs mt-1">Ajustes</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
