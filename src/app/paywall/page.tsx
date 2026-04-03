import { Lock, Check, CreditCard } from "lucide-react";
import Link from "next/link";

export default function Paywall() {
  return (
    <div className="flex-1 flex flex-col p-6 bg-gray-950 items-center justify-center">
      <div className="w-full max-w-md flex flex-col justify-center items-center text-center mt-10">
        <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
          <Lock className="w-12 h-12 text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Ative sua Conta</h2>
        <p className="text-gray-400 mb-8 text-sm md:text-base">
          Para garantir alta performance e ferramentas exclusivas, cobramos uma taxa única de setup. Liberte seu potencial agora!
        </p>

        <div className="bg-gray-800 rounded-2xl p-6 w-full border border-gray-700 mb-8 shadow-xl">
          <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-4">
            <span className="text-gray-400">Taxa de Ativação</span>
            <span className="text-white font-bold text-xl">R$ 50,00</span>
          </div>
          <ul className="text-left text-sm text-gray-300 space-y-3">
            <li className="flex items-center">
              <Check className="w-4 h-4 text-emerald-400 mr-2" /> Página Customizada
            </li>
            <li className="flex items-center">
              <Check className="w-4 h-4 text-emerald-400 mr-2" /> Upload ilimitado (via YT)
            </li>
            <li className="flex items-center">
              <Check className="w-4 h-4 text-emerald-400 mr-2" /> Cobranças Automatizadas
            </li>
          </ul>
        </div>

        <Link href="/dashboard" className="w-full">
          <button className="w-full bg-[#009EE3] hover:bg-[#008CDE] text-white font-bold py-4 rounded-xl flex items-center justify-center transition-colors shadow-lg shadow-blue-900/50">
            <CreditCard className="w-5 h-5 mr-2" />
            Pagar com Mercado Pago
          </button>
        </Link>
      </div>
    </div>
  );
}
