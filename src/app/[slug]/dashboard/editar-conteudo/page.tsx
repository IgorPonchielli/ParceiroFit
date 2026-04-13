import EditarConteudoClient from "./EditarConteudoClient";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function EditarConteudoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950 flex items-center justify-center"><Loader2 className="w-8 h-8 text-emerald-400 animate-spin" /></div>}>
      <EditarConteudoClient />
    </Suspense>
  );
}
