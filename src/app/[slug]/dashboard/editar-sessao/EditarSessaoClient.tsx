"use client";

import { ArrowLeft, Save, Loader2, Check, FileText, LayoutList, Eye, Edit } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { planService } from "@/services/planService";
import { contentService } from "@/services/contentService";
import { workspaceService } from "@/services/workspaceService";
import { Content, Session, Workspace } from "@/types/models";

export default function EditarSessaoClient() {
  const { userProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("id");
  const slug = userProfile?.slug || "";

  const [isLoading, setIsLoading] = useState(true);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [contents, setContents] = useState<Content[]>([]);
  const [plansMap, setPlansMap] = useState<Record<string, string>>({});

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!userProfile?.uid || authLoading || userProfile.role !== "professional") return;
      if (!sessionId) {
        setError("Nenhum ID de sessão fornecido na URL.");
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const [fetchedWorkspace, fetchedContents, fetchedPlans] = await Promise.all([
          workspaceService.getWorkspaceByProfessionalId(userProfile.uid),
          contentService.getContentsByProfessional(userProfile.uid),
          planService.getPlansByProfessional(userProfile.uid)
        ]);

        if (!fetchedWorkspace || !fetchedWorkspace.sessions) {
           setError("Workspace ou sessões não encontradas.");
           setIsLoading(false);
           return;
        }

        const foundSession = fetchedWorkspace.sessions.find(s => s.id === sessionId);
        if (!foundSession) {
           setError("Sessão não encontrada.");
           setIsLoading(false);
           return;
        }

        const pMap: Record<string, string> = {};
        fetchedPlans.forEach(p => {
          if (p.id) pMap[p.id] = p.title;
        });

        // Filtrar e ordenar conteúdos da sessão (mais recentes primeiro)
        const sessionContents = fetchedContents
           .filter(c => c.session_ids?.includes(sessionId))
           .sort((a, b) => {
              const dateA = a.updatedAt && 'toDate' in a.updatedAt ? a.updatedAt.toDate().getTime() : 0;
              const dateB = b.updatedAt && 'toDate' in b.updatedAt ? b.updatedAt.toDate().getTime() : 0;
              return dateB - dateA; // Decrescente
           });

        setWorkspace(fetchedWorkspace);
        setSession(foundSession);
        setTitle(foundSession.title || "");
        setDescription(foundSession.description || "");
        setContents(sessionContents);
        setPlansMap(pMap);

      } catch (err) {
        console.error("Erro ao carregar os dados:", err);
        setError("Erro ao carregar dados da sessão.");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [userProfile?.uid, authLoading, userProfile?.role, sessionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !sessionId || !userProfile?.uid) return;
    setError(null);
    setIsSubmitting(true);

    try {
      if (!title.trim()) throw new Error("O título é obrigatório");
      
      const updatedSession: Session = {
         ...session,
         title: title.trim(),
         description: description.trim()
      };

      await workspaceService.updateSessionInWorkspace(userProfile.uid, updatedSession);

      setSuccess(true);
      setTimeout(() => {
        router.push(`/${slug}/dashboard`);
      }, 1500);

    } catch (err: any) {
      setError(err.message || "Erro ao atualizar a sessão.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPlanLabels = (content: Content) => {
    if (content.is_free) return "Gratuito";
    if (!content.allowed_plans || content.allowed_plans.length === 0) return "Premium (Sem Plano Vínculado)";
    return content.allowed_plans.map(id => plansMap[id] || "Plano Indisponível").join(", ");
  };

  if (authLoading || isLoading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center"><Loader2 className="w-8 h-8 text-emerald-400 animate-spin" /></div>;

  return (
    <div className="flex-1 flex flex-col bg-gray-950 pb-24 relative min-h-screen">
      <div className="p-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8 pt-4">
            <div className="flex items-center gap-4">
              <Link href={`/${slug}/dashboard`}>
                <button className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-all cursor-pointer hover:scale-110">
                  <ArrowLeft className="w-6 h-6" />
                </button>
              </Link>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                  <LayoutList className="w-6 h-6 text-emerald-400" />
                  Editar Sessão
                </h2>
                <p className="text-gray-400 mt-1">Atualize as informações da sua sessão.</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mb-12 mx-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8 space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm">
                {error}
              </div>
            )}
            
            {success && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-xl text-emerald-400 text-sm flex items-center gap-2">
                <Check className="w-5 h-5" />
                Sessão atualizada com sucesso! Salvando...
              </div>
            )}

            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                Título
              </label>
              <input
                type="text"
                placeholder="Ex: Treino Completo"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-white placeholder-gray-600 outline-none focus:border-emerald-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                Descrição (Opcional)
              </label>
              <textarea
                placeholder="Descreva o foco desta sessão..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-white placeholder-gray-600 outline-none focus:border-emerald-500 transition-colors resize-none"
              />
            </div>
            
            <div className="flex justify-end gap-4 pt-4">
               <Link href={`/${slug}/dashboard`}>
                  <button type="button" className="px-6 py-4 rounded-xl text-gray-400 font-medium hover:text-white transition-all cursor-pointer hover:scale-105">
                    Cancelar
                  </button>
               </Link>
               <button 
                  type="submit"
                  disabled={isSubmitting || success}
                  className="bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold px-8 py-4 rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer hover:scale-[1.02]"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {isSubmitting ? 'Salvando...' : 'Salvar Sessão'}
              </button>
            </div>
          </div>
        </form>

        {/* Últimos Conteúdos Vinculados */}
        <div className="max-w-3xl mx-auto">
            <h3 className="font-bold mb-4 md:text-lg text-white">Conteúdos desta Sessão ({contents.length})</h3>
            {contents.length === 0 ? (
            <p className="text-gray-400 bg-gray-800/50 p-4 rounded-xl border border-gray-800 text-center">Não há conteúdos vinculados a esta sessão no momento. Você pode editar um vídeo existente e marcá-lo nesta sessão.</p>
            ) : (
            <div className="space-y-4 text-white">
                {contents.map((content) => (
                <div key={content.id} className="relative bg-gray-800 rounded-2xl overflow-hidden hover:opacity-90 transition-opacity group shadow-sm">
                    
                    <Link 
                    href={`/${slug}/dashboard/editar-conteudo?id=${content.id}`} 
                    className="absolute inset-0 z-10 block sm:hidden"
                    />

                    <div className="p-4 flex gap-4">
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

                    <div className="flex-1 flex flex-col justify-start overflow-hidden">
                        <h4 className="text-[15px] md:text-base font-medium line-clamp-2 leading-tight text-white pr-2">
                        {content.title}
                        </h4>
                        <p className="text-[13px] text-gray-400 mt-2 truncate max-w-full">
                        <span className={content.is_free ? "text-emerald-400" : "text-purple-400"}>
                            {content.is_free ? "Gratuito" : getPlanLabels(content)}
                        </span>
                        {" • "}
                        {content.updatedAt && 'toDate' in content.updatedAt ? content.updatedAt.toDate().toLocaleDateString() : 'Recente'}
                        </p>
                    </div>

                    <div className="hidden sm:flex items-center justify-center pl-2 relative z-20">
                        <Link href={`/${slug}/dashboard/editar-conteudo?id=${content.id}`}>
                        <button className="p-3 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all cursor-pointer hover:scale-110 shrink-0" title="Editar Conteúdo">
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
      </div>
    </div>
  );
}
