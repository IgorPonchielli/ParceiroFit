"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Tag, ShoppingCart, Loader2, XCircle, RefreshCw } from "lucide-react";
import { planService } from "@/services/planService";
import { workspaceService } from "@/services/workspaceService";
import { subscriptionService } from "@/services/subscriptionService";
import { Plan, PlanPeriodicity, Workspace, Subscription } from "@/types/models";

export default function PlanosStudentClient() {
  const { slug } = useParams();
  const router = useRouter();
  const { currentUser } = useAuth();
  
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubscription, setActiveSubscription] = useState<Subscription | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      try {
        const ws = await workspaceService.getWorkspaceBySlug(slug as string);
        if (ws) {
          setWorkspace(ws);
          const plansData = await planService.getPlansByProfessional(ws.professionalId);
          setPlans(plansData);
          
          if (currentUser) {
            const sub = await subscriptionService.getActiveSubscription(currentUser.uid, ws.professionalId);
            setActiveSubscription(sub);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug, currentUser]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center h-screen bg-gray-950">
        <div 
          className="w-12 h-12 border-4 rounded-full animate-spin border-t-emerald-500 border-emerald-500/30"
        ></div>
      </div>
    );
  }

  const periodicityLabels: Record<PlanPeriodicity, string> = {
    monthly: "Mensal",
    quarterly: "Trimestral",
    semiannual: "Semestral",
    yearly: "Anual"
  };

  const primaryColor = workspace?.theme?.primary || "#10b981";

  const handleSubscribe = async (plan: Plan) => {
    if (!currentUser || !workspace) {
      router.push("/login");
      return;
    }

    setProcessing(plan.id!);
    try {
      if (activeSubscription) {
        if (activeSubscription.plan_id === plan.id) {
          // Cancelar: inativa a assinatura atual
          await subscriptionService.updateSubscription(activeSubscription.id!, { status: "inactive" });
          setActiveSubscription(null);
        } else {
          // Mudar plano: inativa a atual e cria uma nova
          await subscriptionService.updateSubscription(activeSubscription.id!, { status: "inactive" });
          const newSubId = await subscriptionService.createSubscription({
             client_uid: currentUser.uid,
             profissional_uid: workspace.professionalId,
             plan_id: plan.id!,
             status: "active"
          });
          const newSub = await subscriptionService.getSubscription(newSubId);
          setActiveSubscription(newSub);
        }
      } else {
        // Criar primeira assinatura
        const newSubId = await subscriptionService.createSubscription({
             client_uid: currentUser.uid,
             profissional_uid: workspace.professionalId,
             plan_id: plan.id!,
             status: "active"
        });
        const newSub = await subscriptionService.getSubscription(newSubId);
        setActiveSubscription(newSub);
      }
    } catch (error) {
       console.error("Erro ao gerenciar plano:", error);
    } finally {
       setProcessing(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-950 min-h-screen">
      <div className="p-6 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-8 pt-4 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center justify-center gap-2">
            <Tag className="w-6 h-6" style={{ color: primaryColor }} />
            Planos Disponíveis
          </h2>
          <p className="text-gray-400 mt-1">Conheça as opções e assine para desbloquear conteúdos.</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8">
          
          {plans.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-700 rounded-2xl flex flex-col items-center">
              <Tag className="w-12 h-12 text-gray-600 mb-3" />
              <p className="text-gray-400">Nenhum plano disponível no momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div 
                  key={plan.id} 
                  className="bg-gray-950 border border-gray-800 rounded-2xl p-6 relative group overflow-hidden transition hover:border-gray-700 flex flex-col"
                >
                  {/* Badge Período */}
                  <div 
                    className="absolute top-0 right-0 text-xs px-3 py-1 rounded-bl-xl font-bold text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {periodicityLabels[plan.periodicity]}
                  </div>

                  <h4 className="text-white font-bold text-xl mb-2 pr-12 line-clamp-2">{plan.title}</h4>
                  
                  <div className="my-4">
                    <p className="font-black text-3xl" style={{ color: primaryColor }}>
                      <span className="text-sm font-medium mr-1 text-gray-500">R$</span>
                      {plan.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-800">
                    {(() => {
                      let btnText = "Assinar Agora";
                      let btnIcon = <ShoppingCart className="w-5 h-5" />;
                      let btnColor = primaryColor;
                      
                      if (activeSubscription) {
                        if (activeSubscription.plan_id === plan.id) {
                          btnText = "Cancelar";
                          btnIcon = <XCircle className="w-5 h-5" />;
                          btnColor = "#ef4444"; // red-500
                        } else {
                          btnText = "Mudar Plano";
                          btnIcon = <RefreshCw className="w-5 h-5" />;
                          btnColor = "#f59e0b"; // amber-500
                        }
                      }

                      return (
                        <button 
                          onClick={() => handleSubscribe(plan)}
                          disabled={processing === plan.id}
                          className="w-full text-white font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition active:scale-95 shadow-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ 
                            backgroundColor: btnColor,
                            boxShadow: `0 10px 15px -3px ${btnColor}33`
                          }}
                        >
                          {processing === plan.id ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            btnIcon
                          )} 
                          {processing === plan.id ? "Processando..." : btnText}
                        </button>
                      );
                    })()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botão Voltar */}
        <div className="mt-8 flex justify-center pb-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white px-6 py-3 rounded-full hover:bg-gray-800 transition bg-gray-900 border border-gray-800 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
