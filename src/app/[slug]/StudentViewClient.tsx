"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Unlock, Play, Crown, Lock, PlaySquare, Calendar, MessageCircle, LogIn, BookOpen, ListVideo } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { AuthDropdown } from "@/components/AuthDropdown";
import { useParams, useRouter } from "next/navigation";
import { workspaceService } from "@/services/workspaceService";
import { userService } from "@/services/userService";
import { subscriptionService } from "@/services/subscriptionService";
import { contentService } from "@/services/contentService";
import { planService } from "@/services/planService";
import { Workspace, User, Subscription, Content } from "@/types/models";

export default function StudentViewClient() {
  const { slug } = useParams();
  const router = useRouter();
  const { currentUser } = useAuth();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [professional, setProfessional] = useState<User | null>(null);
  const [activeSubscription, setActiveSubscription] = useState<Subscription | null>(null);
  const [activePlanTitle, setActivePlanTitle] = useState<string | undefined>(undefined);
  const [contents, setContents] = useState<Content[]>([]);
  const [plansMap, setPlansMap] = useState<Record<string, string>>({});
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
          
          const fetchedContents = await contentService.getContentsByProfessional(ws.professionalId);
          setContents(fetchedContents);
          
          const fetchedPlans = await planService.getPlansByProfessional(ws.professionalId);
          const pMap: Record<string, string> = {};
          fetchedPlans.forEach(p => {
             if (p.id) pMap[p.id] = p.title;
          });
          setPlansMap(pMap);
          
          if (currentUser) {
            const sub = await subscriptionService.getActiveSubscription(currentUser.uid, ws.professionalId);
            setActiveSubscription(sub);
            if (sub) {
              const plan = await planService.getPlan(sub.plan_id);
              if (plan) {
                setActivePlanTitle(plan.title);
              }
            }
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados do workspace:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [slug, currentUser]);

  const isContentUnlocked = (content: Content) => {
    if (content.is_free) return true;
    if (!activeSubscription || activeSubscription.status !== "active") return false;
    return content.allowed_plans?.includes(activeSubscription.plan_id) || false;
  };

  const renderContentCard = (content: Content) => {
    const unlocked = isContentUnlocked(content);
    
    let imageUrl = "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&h=800&fit=crop";
    if (content.type === "video" && content.youtube_id) {
       imageUrl = `https://img.youtube.com/vi/${content.youtube_id}/mqdefault.jpg`;
    } else if (content.article_media && content.article_media.length > 0) {
       imageUrl = content.article_media[0];
    }

    if (!unlocked) {
      const planName = content.allowed_plans && content.allowed_plans.length > 0 && plansMap[content.allowed_plans[0]] 
        ? plansMap[content.allowed_plans[0]] 
        : "Premium";

      return (
        <div key={content.id} className="min-w-[160px] md:min-w-[220px] snap-start relative group cursor-pointer">
          <div className="h-[220px] md:h-[300px] bg-gray-800 rounded-xl overflow-hidden relative shadow-lg">
            <Image src={imageUrl} fill alt={content.title} className="object-cover opacity-60 grayscale blur-[1px] transition-all" unoptimized={content.type === 'video'}/>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-gray-950/30 opacity-90"></div>
            
            {/* Badge do Plano */}
            <div className="absolute top-3 right-3 bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 text-gray-300 text-[10px] uppercase font-bold px-2 py-1 rounded truncate max-w-[110px]">
               {planName}
            </div>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/60 p-3 rounded-full backdrop-blur shadow-xl">
              <Lock className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-sm md:text-base font-bold text-gray-300 line-clamp-2 leading-tight">
               {content.title}
               <span className="block text-[10px] text-gray-500 mt-1 font-normal uppercase tracking-wider">Assine para desbloquear</span>
            </div>
            
            <Link href={currentUser ? `/${slug}/planos` : "/login"} className="absolute inset-0 z-10" />
          </div>
        </div>
      );
    }

    return (
      <Link href={`/${slug}/conteudo?id=${content.id}`} key={content.id}>
        <div className="min-w-[160px] md:min-w-[220px] snap-start relative group cursor-pointer">
          <div className="h-[220px] md:h-[300px] bg-gray-800 rounded-xl overflow-hidden relative shadow-lg">
            <Image src={imageUrl} fill alt={content.title} className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" unoptimized={content.type === 'video'} />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent opacity-90"></div>
            
            {content.is_free && (
              <div className="absolute top-3 right-3 bg-emerald-500 text-black text-[10px] uppercase font-bold px-2 py-1 rounded">Free</div>
            )}
            
            <div className="absolute bottom-4 left-4 right-4 text-sm md:text-base font-bold text-white line-clamp-2 leading-tight">
               {content.title}
            </div>
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full backdrop-blur group-hover:scale-110 transition-transform shadow-xl">
              {content.type === "video" ? (
                <Play className="w-6 h-6 md:w-8 md:h-8 fill-white text-white ml-0.5" />
              ) : (
                <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-white" />
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  };

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
        {/* <button 
          onClick={() => router.back()} 
          className="absolute top-4 left-4 bg-black/50 p-2 rounded-full backdrop-blur hover:bg-black/70 transition z-50"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button> */}
        
        {/* Desktop Navigation */}
        <div className="absolute top-4 right-4 hidden md:flex items-center gap-8 bg-black/50 px-8 py-3 rounded-full backdrop-blur z-20 transition-all">
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
          <div className="h-8 w-px bg-gray-700/50 mx-2"></div>
          <AuthDropdown activePlanTitle={activePlanTitle} />
        </div>

        {/* User Auth Menu (Mobile) */}
        <div className="absolute top-4 right-4 z-50 md:hidden bg-black/50 px-4 py-2 rounded-full backdrop-blur">
          <AuthDropdown activePlanTitle={activePlanTitle} />
        </div>
      </div>
      
      <div className="px-4 relative flex-1 max-w-5xl mx-auto w-full -mt-16 md:-mt-24">
        {/* Header Unificado */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-6 bg-gradient-to-r from-[#161922] to-[#030711] p-6 md:p-8 rounded-[2rem] border border-gray-800/60 shadow-xl w-full relative z-10">
          
          <div className="flex flex-col md:flex-row w-full gap-4 md:gap-6 items-start md:items-center">
            
            {/* Avatar & Title (Mobile Row) */}
            <div className="flex flex-row items-center gap-4 w-full md:w-auto">
              <div className="w-16 h-16 md:w-28 md:h-28 rounded-full border-2 border-gray-800 shrink-0 overflow-hidden bg-gray-900 relative shadow-2xl">
                <Image 
                  src={professional?.avatarUrl || "https://i.pravatar.cc/150?img=11"} 
                  fill 
                  alt="Profile" 
                  className="object-cover" 
                />
              </div>
              
              <h1 className="md:hidden text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2 leading-tight">
                {professional?.displayName || "Sua Academia"} 
                <span style={{ color: workspace.theme?.primary || "#10b981" }}>⚡️</span>
              </h1>
            </div>

            {/* Textos */}
            <div className="flex-1 flex flex-col justify-center w-full">
              <h1 className="hidden md:flex text-2xl md:text-3xl font-bold text-white uppercase tracking-tight items-center gap-2">
                {professional?.displayName || "Sua Academia"} 
                <span style={{ color: workspace.theme?.primary || "#10b981" }}>⚡️</span>
              </h1>
              <p className="text-sm md:text-base text-gray-300 mt-2 md:mt-1 text-left max-w-3xl leading-relaxed">
                {workspace.biography}
              </p>
            </div>

          </div>

          {/* Estatísticas */}
          <div className="flex gap-12 md:gap-6 text-center shrink-0 mt-2 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0 border-gray-800/80 w-full md:w-auto justify-center md:justify-end">
            <div className="flex flex-col items-center">
              <span className="font-bold text-white text-xl md:text-3xl leading-none md:leading-tight">{contents.length}</span>
              <span className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest mt-1.5 md:mt-1">Aulas</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-white text-xl md:text-3xl leading-none md:leading-tight">4.9</span>
              <span className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest mt-1.5 md:mt-1">Estrelas</span>
            </div>
          </div>
        </div>

        {/* Mockup Filtro de Busca */}
        <div className="mb-8 w-full relative">
          <input 
            type="search" 
            placeholder="Pesquisar conteúdos ou trilhas..." 
            className="w-full bg-[#101828] border border-gray-800/80 rounded-full py-4 px-6 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-all shadow-inner"
          />
          <svg className="w-5 h-5 text-gray-500 absolute right-6 top-1/2 -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Botão Assinar - Apenas se não tiver assinatura ativa */}
        {!activeSubscription && (
          <div className="flex justify-center mb-12">
            <button 
              onClick={() => {
                if (!currentUser) {
                  router.push("/login");
                } else {
                  router.push(`/${slug}/planos`);
                }
              }}
              className="px-8 py-3 transition-all text-white font-bold rounded-full shadow-lg flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
              style={{ 
                backgroundColor: workspace.theme?.primary || "#10b981",
                boxShadow: `0 10px 15px -3px ${workspace.theme?.primary || "#10b981"}33`
              }}
            >
              <Unlock className="w-5 h-5" /> Confira os Planos
            </button>
          </div>
        )}

        {/* Conteúdos Gratuitos */}
        {contents.filter(c => c.is_free).length > 0 && (
          <div className="mb-10">
            <h2 className="font-bold mb-4 flex items-center gap-2 md:text-xl text-white">
              Conteúdos Gratuitos <span className="bg-gray-800 text-xs px-2 py-1 rounded text-gray-300">Free</span>
            </h2>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar snap-x pb-4">
              {contents.filter(c => c.is_free).map(content => renderContentCard(content))}
            </div>
          </div>
        )}

        {/* Sessões Premium Dinâmicas */}
        {workspace.sessions && workspace.sessions.map((session) => {
          const sessionContents = contents.filter(c => c.session_ids?.includes(session.id));
          
          if (sessionContents.length === 0) return null;

          // Encontra a maior data para usar como peso do sort
          let latestDateValue = 0;
          sessionContents.forEach(c => {
             const d = c.updatedAt && 'toDate' in c.updatedAt ? c.updatedAt.toDate().getTime() : 0;
             if (d > latestDateValue) latestDateValue = d;
          });

          return { session, sessionContents, latestDateValue };
        })
        .filter((item): item is {session: any, sessionContents: Content[], latestDateValue: number} => item !== null)
        .sort((a, b) => b.latestDateValue - a.latestDateValue)
        .map(({ session, sessionContents }) => {
           // Verifica se toda a sessão é exclusiva premium (nenhum item free) p/ mudar o icone
           const hasFreeInSession = sessionContents.some(c => c.is_free);

           return (
            <div key={session.id} className="mb-10">
              <h2 className="font-bold mb-4 flex items-center gap-2 md:text-xl text-white">
                <ListVideo className="w-6 h-6 text-gray-400" />
                {session.title}
              </h2>
              <div className="flex gap-4 overflow-x-auto hide-scrollbar snap-x pb-4">
                 {sessionContents.map(content => renderContentCard(content))}
              </div>
            </div>
           );
        })}
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
