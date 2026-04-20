"use client";

import { ArrowLeft, Search, MoreHorizontal, MessageSquare, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfessionalChatInboxClient() {
  const { slug } = useParams();
  const { userProfile } = useAuth();

  const threads = [
    {
      id: "1",
      name: "Marcos (Aluno)",
      avatar: "MC",
      lastMessage: "Professor, terminei a semana 2. Olha como está secando! Posso manter o carbo baixo?",
      date: "15 Abr 2023",
      comments: 5,
      unread: true,
      avatarColor: "bg-emerald-500/20 text-emerald-400",
      image: "https://i.pravatar.cc/150?img=11"
    },
    {
      id: "2",
      name: "Joana Dias",
      avatar: "JD",
      lastMessage: "Qual a substituição para o agachamento livre? Minha academia não tem gaiola.",
      date: "14 Abr 2023",
      comments: 2,
      unread: false,
      avatarColor: "bg-purple-500/20 text-purple-400",
      image: "https://i.pravatar.cc/150?img=5"
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-gray-950 h-screen w-full relative overflow-hidden">
      <div className="bg-gray-900 border-b border-gray-800 z-10 w-full relative pt-8 md:pt-4 p-4">
        <div className="max-w-4xl mx-auto text-white">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Link href={`/${slug}/dashboard`} className="mr-4 text-gray-400 hover:text-white transition-all cursor-pointer hover:scale-110">
                <ArrowLeft />
              </Link>
              <h1 className="text-xl md:text-2xl font-bold uppercase tracking-tight">Fórum / Alunos</h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white transition-all cursor-pointer hover:scale-110">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex items-center gap-2 bg-gray-800 p-1 rounded-xl w-full md:w-auto">
              <button className="px-6 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm w-1/2 md:w-auto cursor-pointer hover:scale-105">
                Recentes
              </button>
              <button className="px-6 py-2 text-gray-400 hover:text-white rounded-lg text-sm font-medium transition-all w-1/2 md:w-auto cursor-pointer hover:scale-105">
                Discussões
              </button>
            </div>
            
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Buscar aluno..." 
                className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 text-white transition"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto w-full pb-24 md:pb-6 p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
            {threads.map((thread, i) => {
              return (
                <div key={thread.id} className={`p-4 sm:p-5 flex gap-4 hover:bg-gray-800 transition cursor-pointer text-white ${i !== threads.length - 1 ? 'border-b border-gray-800' : ''}`}>
                  <div className="shrink-0 relative">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border border-gray-700 relative">
                      <Image src={thread.image} alt={thread.name} fill className="object-cover" />
                    </div>
                    {thread.unread && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-gray-900"></span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-bold text-sm sm:text-base truncate pr-2 ${thread.unread ? 'text-white' : 'text-gray-300'}`}>
                        {thread.name}
                      </h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap">{thread.date}</span>
                    </div>
                    
                    <p className={`text-sm truncate mb-2 ${thread.unread ? 'text-gray-300 font-medium' : 'text-gray-500'}`}>
                      {thread.lastMessage}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                      <div className="flex items-center gap-1.5 hover:text-emerald-400 transition">
                        <MessageSquare className="w-3.5 h-3.5" /> 
                        {thread.comments} {thread.comments === 1 ? 'comentário' : 'comentários'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Action Button (Mobile) */}
      <button className="md:hidden fixed bottom-24 right-4 w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer hover:scale-110">
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
