"use client";

import { ArrowLeft, Camera, Send, ImageIcon, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useParams } from "next/navigation";

export default function ChatDetail() {
  const params = useParams();
  const id = params?.id || "1";
  
  const [showGallery, setShowGallery] = useState(false);

  // Mock progress photos
  const progressPhotos = [
    { id: 1, url: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=600&fit=crop", date: "15 Abr 2023", comments: 5 },
    { id: 2, url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=600&fit=crop", date: "16 Mai 2023", comments: 6 },
    { id: 3, url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=600&fit=crop", date: "17 Jun 2023", comments: 7 },
    { id: 4, url: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=600&fit=crop", date: "06 Ago 2023", comments: 0 },
    { id: 5, url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=600&fit=crop", date: "01 Set 2023", comments: 0 },
    { id: 6, url: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=600&fit=crop", date: "06 Out 2023", comments: 0 },
  ];

  return (
    <div className="flex-1 flex flex-col bg-gray-950 h-screen w-full relative overflow-hidden">
      <div className="bg-gray-900 border-b border-gray-800 z-10 w-full relative">
        <div className="max-w-4xl mx-auto p-4 flex items-center pt-8 md:pt-4 justify-between">
          <div className="flex items-center">
            <Link href="/chat" className="mr-4 text-gray-400 hover:text-white transition">
              <ArrowLeft />
            </Link>
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mr-3 font-bold text-emerald-400 cursor-pointer" onClick={() => setShowGallery(true)}>
              MC
            </div>
            <div>
              <h3 className="font-bold text-sm md:text-base cursor-pointer hover:text-emerald-400 transition" onClick={() => setShowGallery(true)}>Marcos (Aluno)</h3>
              <p className="text-xs text-emerald-400">Online</p>
            </div>
          </div>
          
          <button 
            onClick={() => setShowGallery(true)}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg text-sm transition"
          >
            <ImageIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Evolução</span>
          </button>
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

      {/* Gallery Modal */}
      {showGallery && (
        <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 w-full max-w-2xl rounded-2xl flex flex-col max-h-[90vh] shadow-2xl border border-gray-800">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900 rounded-t-2xl">
              <h2 className="text-xl font-bold">Fotos de Evolução</h2>
              <button 
                onClick={() => setShowGallery(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-4 md:p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                {progressPhotos.map((photo) => (
                  <div key={photo.id} className="flex flex-col group cursor-pointer">
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-gray-800 mb-2">
                      <Image 
                        src={photo.url} 
                        fill 
                        alt={`Evolução ${photo.date}`} 
                        className="object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                    <div className="flex justify-between items-center px-1">
                      <span className="text-sm text-gray-300">{photo.date}</span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" /> {photo.comments}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
