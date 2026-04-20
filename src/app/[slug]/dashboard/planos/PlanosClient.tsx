"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Plus, Edit2, Trash2, Loader2, Save, Tag, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { planService } from "@/services/planService";
import { contentService } from "@/services/contentService";
import { Plan, PlanPeriodicity } from "@/types/models";

export default function PlanosClient() {
  const { userProfile, loading: authLoading } = useAuth();
  const slug = userProfile?.slug || "";

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [periodicity, setPeriodicity] = useState<PlanPeriodicity>("monthly");
  const [mpPlanId, setMpPlanId] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadPlans();
  }, [userProfile?.uid]);

  const loadPlans = async () => {
    if (userProfile?.uid) {
      setLoading(true);
      try {
        const data = await planService.getPlansByProfessional(userProfile.uid);
        setPlans(data);
      } catch (err) {
        console.error("Erro ao carregar planos:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setEditingPlanId(null);
    setTitle("");
    setPrice("");
    setPeriodicity("monthly");
    setMpPlanId("");
    setError(null);
    setSuccess(null);
  };

  const editPlan = (plan: Plan) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setEditingPlanId(plan.id!);
    setTitle(plan.title);
    setPrice(plan.price.toString());
    setPeriodicity(plan.periodicity);
    setMpPlanId(plan.mp_plan_id || "");
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      if (!userProfile?.uid) throw new Error("Usuário não logado");
      if (!title || !price) throw new Error("Preencha título e valor");
      
      const numPrice = parseFloat(price.replace(",", "."));
      if (isNaN(numPrice) || numPrice < 0) throw new Error("Valor inválido");

      const planData: Omit<Plan, "id"> = {
        profissional_uid: userProfile.uid,
        title,
        price: numPrice,
        periodicity,
        mp_plan_id: mpPlanId,
      };

      if (editingPlanId) {
        await planService.updatePlan(editingPlanId, planData);
        setSuccess("Plano atualizado com sucesso!");
      } else {
        await planService.createPlan(planData);
        setSuccess("Plano criado com sucesso!");
      }

      await loadPlans();
      if (!editingPlanId) resetForm(); // Limpa form apenas se for criação
      setTimeout(() => setSuccess(null), 3000);

    } catch (err: any) {
      setError(err.message || "Erro ao salvar o plano");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (planId: string) => {
    if (!confirm("Tem certeza? Esta ação removerá o acesso dos alunos aos conteúdos limitados por este plano e não pode ser desfeita.")) {
      return;
    }

    setIsDeleting(planId);
    try {
      if (!userProfile?.uid) throw new Error("Usuário não logado");

      // 1. Cascading Delete: Remover o plano dos allowed_plans de todos os contents do profissional
      await contentService.removePlanFromAllContents(planId, userProfile.uid);
      
      // 2. Apagar o documento do plano
      await planService.deletePlan(planId);
      
      setSuccess("Plano excluído definitivamente.");
      await loadPlans();
      setTimeout(() => setSuccess(null), 3000);

      // Se o plano que estava sendo editado for apagado, reseta o form
      if (editingPlanId === planId) resetForm();

    } catch (err: any) {
      console.error(err);
      setError("Erro ao excluir o plano.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsDeleting(null);
    }
  };

  if (authLoading || loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center"><Loader2 className="w-8 h-8 text-emerald-400 animate-spin" /></div>;

  const periodicityLabels: Record<PlanPeriodicity, string> = {
    monthly: "Mensal",
    quarterly: "Trimestral",
    semiannual: "Semestral",
    yearly: "Anual"
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-950 pb-24 relative min-h-screen">
      <div className="p-6 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center mb-8 gap-4 pt-4">
          <Link href={`/${slug}/dashboard`}>
            <button className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-all cursor-pointer hover:scale-110">
              <ArrowLeft className="w-6 h-6" />
            </button>
          </Link>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
              <Tag className="w-6 h-6 text-emerald-400" />
              Gestão de Planos
            </h2>
            <p className="text-gray-400 mt-1">Crie e gerencie os planos de assinatura da sua plataforma.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Coluna da Esquerda: Formulário */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 sticky top-6">
              <h3 className="font-bold text-white text-lg mb-6 flex items-center gap-2">
                {editingPlanId ? <Edit2 className="w-5 h-5 text-blue-400" /> : <Plus className="w-5 h-5 text-emerald-400" />}
                {editingPlanId ? "Editar Plano" : "Novo Plano"}
              </h3>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/50 rounded-xl text-emerald-400 text-sm">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-xs font-medium mb-1">Título do Plano</label>
                  <input
                    type="text"
                    placeholder="Ex: Premium Anual"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white text-sm outline-none focus:border-emerald-500 transition"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-400 text-xs font-medium mb-1">Valor (R$)</label>
                    <input
                      type="text"
                      placeholder="Ex: 99.90"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white text-sm outline-none focus:border-emerald-500 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs font-medium mb-1">Período</label>
                    <select
                      value={periodicity}
                      onChange={(e) => setPeriodicity(e.target.value as PlanPeriodicity)}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white text-sm outline-none focus:border-emerald-500 transition appearance-none cursor-pointer"
                    >
                      <option value="monthly">Mensal</option>
                      <option value="quarterly">Trimestral</option>
                      <option value="semiannual">Semestral</option>
                      <option value="yearly">Anual</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-xs font-medium mb-1">ID Mercado Pago (Opcional)</label>
                  <input
                    type="text"
                    placeholder="Ex: 2c9380847... (API)"
                    value={mpPlanId}
                    onChange={(e) => setMpPlanId(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white text-sm outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold p-3 rounded-xl flex justify-center items-center gap-2 transition-all disabled:opacity-50 cursor-pointer hover:scale-[1.02]"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {editingPlanId ? "Atualizar" : "Criar Plano"}
                  </button>
                  
                  {editingPlanId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="w-full mt-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium p-3 rounded-xl transition-all text-sm cursor-pointer hover:scale-[1.02]"
                    >
                      Cancelar Edição
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Coluna da Direita: Lista de Planos */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
              <h3 className="font-bold text-white text-lg mb-6">Seus Planos Ativos ({plans.length})</h3>
              
              {plans.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-gray-700 rounded-2xl flex flex-col items-center">
                  <Tag className="w-12 h-12 text-gray-600 mb-3" />
                  <p className="text-gray-400">Você ainda não tem nenhum plano cadastrado.</p>
                  <p className="text-sm text-gray-500 mt-1">Crie seu primeiro plano ao lado para começar.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {plans.map(plan => (
                    <div key={plan.id} className="bg-gray-950 border border-gray-800 rounded-2xl p-5 relative group overflow-hidden transition hover:border-gray-700">
                      
                      {/* Badge Período */}
                      <div className="absolute top-0 right-0 bg-gray-800 text-xs px-3 py-1 rounded-bl-xl text-gray-400 font-medium">
                        {periodicityLabels[plan.periodicity]}
                      </div>

                      <h4 className="text-white font-bold text-lg mb-1 pr-16 truncate">{plan.title}</h4>
                      <p className="text-emerald-400 font-black text-2xl mb-4">
                        <span className="text-sm font-medium mr-1 text-gray-500">R$</span>
                        {plan.price.toFixed(2)}
                      </p>

                      <div className="flex gap-2 border-t border-gray-800 pt-4 mt-2">
                        <button 
                          onClick={() => editPlan(plan)}
                          className="flex-1 bg-gray-800 hover:bg-gray-700 text-white rounded-xl py-2 flex items-center justify-center gap-2 text-sm transition-all cursor-pointer hover:scale-105"
                        >
                          <Edit2 className="w-4 h-4" /> Editar
                        </button>
                        
                        <button 
                          onClick={() => handleDelete(plan.id!)}
                          disabled={isDeleting === plan.id}
                          className="w-12 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 hover:border-red-500/40 rounded-xl py-2 flex items-center justify-center transition-all disabled:opacity-50 cursor-pointer hover:scale-105"
                          title="Excluir Plano"
                        >
                          {isDeleting === plan.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400 text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>Ao criar um plano aqui, ele ficará disponível para você limitar o acesso aos seus vídeos na aba <strong>Novo Vídeo</strong>. Se você excluir um plano, todos os vídeos que possuiam aquele plano como restrição serão atualizados para não permitir mais o acesso de quem tinha aquela assinatura.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
