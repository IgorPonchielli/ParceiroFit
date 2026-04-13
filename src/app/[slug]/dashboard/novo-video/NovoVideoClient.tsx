"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Video, Save, Lock, Unlock, Loader2, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { planService } from "@/services/planService";
import { contentService } from "@/services/contentService";
import { Plan } from "@/types/models";

export default function NovoVideoClient() {
  const { userProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  const slug = userProfile?.slug || "";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [isFree, setIsFree] = useState(true);
  const [allowedPlans, setAllowedPlans] = useState<string[]>([]);
  const [availablePlans, setAvailablePlans] = useState<Plan[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (userProfile?.uid && !authLoading && userProfile.role === "professional") {
      planService.getPlansByProfessional(userProfile.uid)
        .then(setAvailablePlans)
        .catch(err => {
          console.error("Erro ao carregar planos", err);
          setError("Não foi possível carregar os planos.");
        });
    }
  }, [userProfile?.uid, authLoading, userProfile?.role]);

  const togglePlanAccess = (planId: string) => {
    setAllowedPlans(prev => 
      prev.includes(planId) 
        ? prev.filter(id => id !== planId)
        : [...prev, planId]
    );
  };

  const getYoutubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    return match ? match[1] : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!userProfile?.uid) throw new Error("Usuário não autenticado");
      if (!title.trim()) throw new Error("O título é obrigatório");
      
      const youtubeId = getYoutubeId(url);
      if (!youtubeId) throw new Error("URL do YouTube inválida.");

      if (!isFree && allowedPlans.length === 0) {
        throw new Error("Selecione pelo menos um plano que terá acesso ao vídeo.");
      }

      await contentService.createVideoContent({
        profissional_uid: userProfile.uid,
        title,
        description,
        is_free: isFree,
        allowed_plans: isFree ? [] : allowedPlans,
        youtube_id: youtubeId,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push(`/${slug}/dashboard`);
      }, 2000);

    } catch (err: any) {
      setError(err.message || "Erro ao salvar o vídeo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center"><Loader2 className="w-8 h-8 text-emerald-400 animate-spin" /></div>;

  return (
    <div className="flex-1 flex flex-col bg-gray-950 pb-24 relative min-h-screen">
      <div className="p-6 max-w-3xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center mb-8 gap-4 pt-4">
          <Link href={`/${slug}/dashboard`}>
            <button className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800 transition">
              <ArrowLeft className="w-6 h-6" />
            </button>
          </Link>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
              <Video className="w-6 h-6 text-emerald-400" />
              Novo Vídeo
            </h2>
            <p className="text-gray-400 mt-1">Adicione um novo vídeo para seus alunos.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card Principal */}
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8 space-y-6">
            
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm">
                {error}
              </div>
            )}
            
            {success && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-xl text-emerald-400 text-sm flex items-center gap-2">
                <Check className="w-5 h-5" />
                Vídeo salvo com sucesso! Redirecionando...
              </div>
            )}

            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                URL do YouTube (Não listado)
              </label>
              <input
                type="text"
                placeholder="https://youtu.be/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-white placeholder-gray-600 outline-none focus:border-emerald-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                Título do Vídeo
              </label>
              <input
                type="text"
                placeholder="Ex: Treino de Pernas - Iniciante"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-white placeholder-gray-600 outline-none focus:border-emerald-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                Descrição e Informações
              </label>
              <textarea
                placeholder="Descreva o treino..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-white placeholder-gray-600 outline-none focus:border-emerald-500 transition-colors resize-none"
              />
            </div>
          </div>

          {/* Configuração de Acesso */}
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8 space-y-6">
            <h3 className="font-bold text-white text-lg border-b border-gray-800 pb-4">
              Configurações de Acesso
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div 
                onClick={() => setIsFree(true)}
                className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 cursor-pointer transition ${isFree ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-gray-800 bg-gray-950 text-gray-500 hover:border-gray-700'}`}
              >
                <Unlock className="w-8 h-8 mb-2" />
                <span className="font-bold">Gratuito</span>
                <span className="text-xs mt-1 text-center opacity-70">Livre para todos (Degustação)</span>
              </div>
              
              <div 
                onClick={() => setIsFree(false)}
                className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 cursor-pointer transition ${!isFree ? 'border-purple-500 bg-purple-500/10 text-purple-400' : 'border-gray-800 bg-gray-950 text-gray-500 hover:border-gray-700'}`}
              >
                <Lock className="w-8 h-8 mb-2" />
                <span className="font-bold">Privado/Pago</span>
                <span className="text-xs mt-1 text-center opacity-70">Apenas planos selecionados</span>
              </div>
            </div>

            {!isFree && (
              <div className="mt-6 pt-6 border-t border-gray-800 animate-in fade-in slide-in-from-top-4">
                <label className="block text-gray-400 text-sm font-medium mb-4">
                  Quais planos dão acesso a este vídeo?
                </label>
                
                {availablePlans.length === 0 ? (
                  <div className="text-yellow-500/80 bg-yellow-500/10 p-4 rounded-xl text-sm border border-yellow-500/20">
                    Você ainda não cadastrou nenhum plano. Crie planos primeiro para poder restringir o acesso.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {availablePlans.map(plan => {
                      const isSelected = allowedPlans.includes(plan.id!);
                      return (
                        <div 
                          key={plan.id}
                          onClick={() => togglePlanAccess(plan.id!)}
                          className={`flex justify-between items-center p-4 rounded-xl border cursor-pointer transition ${isSelected ? 'border-purple-500 bg-purple-500/10' : 'border-gray-800 bg-gray-950 hover:border-gray-700'}`}
                        >
                          <div>
                            <p className={`font-medium ${isSelected ? 'text-white' : 'text-gray-300'}`}>{plan.title}</p>
                            <p className="text-sm text-gray-500">R$ {plan.price.toFixed(2)} / {plan.periodicity}</p>
                          </div>
                          <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition ${isSelected ? 'bg-purple-500 border-purple-500' : 'border-gray-600 bg-transparent'}`}>
                            {isSelected && <Check className="w-4 h-4 text-white" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-4">
             <Link href={`/${slug}/dashboard`}>
                <button type="button" className="px-6 py-4 rounded-xl text-gray-400 font-medium hover:text-white transition">
                  Cancelar
                </button>
             </Link>
             <button 
                type="submit"
                disabled={isSubmitting || success}
                className="bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold px-8 py-4 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {isSubmitting ? 'Salvando...' : 'Salvar Vídeo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
