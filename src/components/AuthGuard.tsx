"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Dumbbell } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { currentUser, userProfile, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const urlSlug = params?.slug as string | undefined;

  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        // Usuário não está logado
        router.push("/");
      } else if (userProfile && userProfile.paymentStatus !== "paid") {
        // Usuário logado, mas não pagou
        router.push("/paywall");
      } else if (userProfile && urlSlug && userProfile.slug !== urlSlug) {
        // O slug na URL não pertence ao profissional logado
        // Redireciona para o slug correto (ou apenas bloqueia, aqui redirecionamos para segurança)
        router.push(`/${userProfile.slug}/dashboard`);
      }
    }
  }, [currentUser, userProfile, loading, router, urlSlug]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center h-full min-h-screen bg-gray-950">
        <Dumbbell className="w-12 h-12 text-emerald-500 animate-spin" />
        <p className="mt-4 text-emerald-400 font-medium">Carregando...</p>
      </div>
    );
  }

  // Se não estiver carregando, e currentUser existir (e for pago, e o slug coincidir se presente no roteiro)
  if (!currentUser || (userProfile && userProfile.paymentStatus !== "paid") || (userProfile && urlSlug && userProfile.slug !== urlSlug)) {
     return null; // Retorna null enquanto aguarda o redirect do router
  }

  return <>{children}</>;
}
