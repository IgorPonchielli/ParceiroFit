import { ArrowLeft, Camera, Send } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Chat() {
  return (
    <div className="flex-1 flex flex-col bg-gray-950 h-screen w-full relative overflow-hidden">
      <div className="bg-gray-900 border-b border-gray-800 z-10 w-full">
        <div className="max-w-4xl mx-auto p-4 flex items-center pt-8 md:pt-4">
          <Link href="/dashboard" className="mr-4 text-gray-400 hover:text-white transition">
            <ArrowLeft />
          </Link>
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mr-3 font-bold text-emerald-400">
            MC
          </div>
          <div>
            <h3 className="font-bold text-sm md:text-base">Marcos (Aluno)</h3>
            <p className="text-xs text-emerald-400">Online</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto w-full pb-24">
        <div className="max-w-4xl mx-auto p-4 space-y-6">
          {/* Mensagem Aluno */}
          <div className="flex flex-col items-start max-w-[85%] md:max-w-[70%]">
            <div className="bg-gray-800 p-3 md:p-4 rounded-2xl rounded-tl-sm text-sm md:text-base shadow-md">
              Professor, terminei a semana 2. Olha como está secando! Posso manter o carbo baixo?
            </div>
            <div className="mt-2 w-32 h-40 md:w-48 md:h-64 bg-gray-800 rounded-xl overflow-hidden border border-gray-700 relative shadow-md">
              <Image src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=600&fit=crop" fill alt="Attachment" className="object-cover" />
            </div>
            <span className="text-[10px] md:text-xs text-gray-500 mt-1">10:42</span>
          </div>

          {/* Mensagem Prof */}
          <div className="flex flex-col items-end self-end max-w-[85%] md:max-w-[70%] ml-auto">
            <div className="bg-emerald-600 p-3 md:p-4 rounded-2xl rounded-tr-sm text-sm md:text-base text-white shadow-md">
              Excelente evolução Marcos! Segura o carbo por mais 3 dias e na sexta a gente faz um refeed. Vou liberar o módulo de abdômen pra você amanhã.
            </div>
            <span className="text-[10px] md:text-xs text-gray-500 mt-1">11:15</span>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 w-full bg-gray-900 border-t border-gray-800 z-10">
        <div className="max-w-4xl mx-auto p-4 pb-6 md:pb-4 flex items-center gap-2">
          <button className="p-2 md:p-3 text-gray-400 hover:text-emerald-400 bg-gray-800 rounded-full transition">
            <Camera className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <input
            type="text"
            placeholder="Escreva sua mensagem..."
            className="flex-1 bg-gray-800 rounded-full px-4 py-3 text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-emerald-500 text-white shadow-inner"
          />
          <button className="p-2 md:p-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full transition shadow-lg">
            <Send className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
