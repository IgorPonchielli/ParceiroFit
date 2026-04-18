"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save, User as UserIcon, Settings, Tag, Crown } from "lucide-react";
import { userService } from "@/services/userService";
import { subscriptionService } from "@/services/subscriptionService";
import { planService } from "@/services/planService";
import { workspaceService } from "@/services/workspaceService";
import { Subscription, Plan, User, Workspace } from "@/types/models";
import Link from "next/link";
import Image from "next/image";

interface RichSubscription {
  sub: Subscription;
  plan: Plan;
  professional: User;
  workspace: Workspace | null;
}

export default function ProfileClient() {
  const { currentUser, userProfile } = useAuth();
  const router = useRouter();
  
  const [displayName, setDisplayName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  
  const [richSubs, setRichSubs] = useState<RichSubscription[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(true);
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || "");
    }
  }, [userProfile]);

  useEffect(() => {
    async function fetchSubs() {
      if (!currentUser) return;
      try {
        const subs = await subscriptionService.getActiveSubscriptionsByClient(currentUser.uid);
        const enriched: RichSubscription[] = [];
        
        for (const sub of subs) {
          const plan = await planService.getPlan(sub.plan_id);
          const prof = await userService.getUser(sub.profissional_uid);
          const ws = await workspaceService.getWorkspaceByProfessionalId(sub.profissional_uid);
          
          if (plan && prof) {
            enriched.push({ sub, plan, professional: prof, workspace: ws });
          }
        }
        
        setRichSubs(enriched);
      } catch (err) {
        console.error("Erro ao enriquecer assinaturas:", err);
      } finally {
        setLoadingSubs(false);
      }
    }
    fetchSubs();
  }, [currentUser]);

  const handleCancelSubscription = async (subId: string) => {
    if (!confirm("Tem certeza que deseja cancelar esta assinatura?")) return;
    setCancelingId(subId);
    try {
      await subscriptionService.updateSubscription(subId, { status: "inactive" });
      setRichSubs((prev) => prev.filter((r) => r.sub.id !== subId));
    } catch (err) {
      console.error("Erro ao cancelar assinatura:", err);
      alert("Ocorreu um erro ao cancelar. Tente novamente.");
    } finally {
      setCancelingId(null);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsSaving(true);
    setSuccessMsg("");
    try {
      await userService.updateUser(currentUser.uid, { displayName });
      setSuccessMsg("Perfil atualizado com sucesso!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!currentUser || !userProfile) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col justify-center items-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-gray-950 text-white font-sans">
      <div className="max-w-4xl mx-auto w-full p-6 pb-24">
        {/* Header */}
        <div className="flex items-center mb-8 gap-4 pt-4">
          <button 
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800 transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Settings className="w-6 h-6 text-emerald-500" />
              Minha Conta
            </h2>
            <p className="text-gray-400 mt-1">Gerencie seu perfil e consulte suas assinaturas ativas.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Coluna da Esquerda: Editar Perfil */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 sticky top-6">
              <h3 className="font-bold text-white text-lg mb-6 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-emerald-400" />
                Editar Perfil
              </h3>

              {successMsg && (
                <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/50 rounded-xl text-emerald-400 text-sm">
                  {successMsg}
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-xs font-medium mb-1">Nome de Exibição</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white text-sm outline-none focus:border-emerald-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-medium mb-1">E-mail</label>
                  <input
                    type="email"
                    value={currentUser.email || ""}
                    disabled
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-gray-500 text-sm opacity-70 cursor-not-allowed"
                  />
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold p-3 rounded-xl flex justify-center items-center gap-2 transition disabled:opacity-50 active:scale-95 shadow-lg shadow-emerald-500/20"
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Atualizar Dados
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Coluna da Direita: Assinaturas Ativas */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8">
              <h3 className="font-bold text-white text-lg mb-6 flex items-center gap-2">
                <Crown className="w-5 h-5 text-emerald-400" />
                Minhas Assinaturas ({richSubs.length})
              </h3>
              
              {loadingSubs ? (
                <div className="py-12 flex justify-center">
                  <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                </div>
              ) : richSubs.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-gray-700 rounded-2xl flex flex-col items-center">
                  <Tag className="w-12 h-12 text-gray-600 mb-3" />
                  <p className="text-gray-400">Você ainda não tem assinaturas ativas.</p>
                  <Link href="/explore" className="text-emerald-400 font-bold mt-4 hover:underline">
                    Explorar Profissionais
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {richSubs.map(({ sub, plan, professional, workspace }) => {
                    const wsTheme = workspace?.theme?.primary || "#10b981";
                    const wsSlug = workspace?.slug || "#";
                    return (
                      <div key={sub.id} className="bg-gray-950 border border-gray-800 rounded-2xl p-5 relative group flex flex-col h-full hover:border-gray-700 transition">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full overflow-hidden relative border border-gray-800 shrink-0">
                            <Image 
                              src={professional.avatarUrl || "https://i.pravatar.cc/150?img=11"} 
                              alt={professional.displayName}
                              fill 
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white truncate max-w-[120px]">{professional.displayName}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Profissional</p>
                          </div>
                        </div>

                        <h4 className="text-white font-bold text-lg mb-1 line-clamp-2">{plan.title}</h4>
                        <div className="my-2">
                          <p className="font-black text-2xl" style={{ color: wsTheme }}>
                            <span className="text-xs font-medium mr-1 text-gray-500">R$</span>
                            {plan.price.toFixed(2)}
                          </p>
                        </div>
                        
                        <div className="mt-auto pt-4 border-t border-gray-800 flex flex-col gap-2">
                           <Link href={`/${wsSlug}`}>
                             <button 
                               className="w-full text-white font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition hover:opacity-90 active:scale-95 text-sm"
                               style={{ backgroundColor: wsTheme }}
                             >
                               Acessar Workspace
                             </button>
                           </Link>
                           <button 
                             onClick={() => handleCancelSubscription(sub.id)}
                             disabled={cancelingId === sub.id}
                             className="w-full border border-gray-800 text-gray-400 font-bold rounded-xl py-2 flex items-center justify-center gap-2 transition hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 active:scale-95 text-xs disabled:opacity-50"
                           >
                             {cancelingId === sub.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Cancelar Assinatura"}
                           </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
