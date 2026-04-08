"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Star, ArrowRight, User } from "lucide-react";
import Link from "next/link";

import { userService } from "@/services/userService";
import { User as AppUser } from "@/types/models";

export default function Explore() {
  const [searchTerm, setSearchTerm] = useState("");
  const [professionals, setProfessionals] = useState<AppUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const data = await userService.getProfessionals();
        setProfessionals(data);
      } catch (error) {
        console.error("Erro ao buscar profissionais:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfessionals();
  }, []);
  
  const filteredProfessionals = professionals.filter(p => 
    p.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center p-6">
      <div className="w-full max-w-2xl mt-12">
        <h1 className="text-3xl font-bold mb-8 text-center italic tracking-tight">
          ENCONTRE SEU <span className="text-emerald-400 uppercase">PARCEIRO FIT</span>
        </h1>
        
        {/* Barra de Busca estilo Instagram */}
        <div className="relative mb-8 group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500 transition-colors group-focus-within:text-emerald-400" />
          </div>
          <input
            type="text"
            placeholder="Pesquisar profissionais ou links..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 text-white rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-lg shadow-2xl placeholder:text-gray-600"
          />
        </div>

        {/* Resultados */}
        {searchTerm.length > 0 && (
          <div className="space-y-4">
            <div className="bg-gray-900/30 rounded-3xl border border-gray-800/50 overflow-hidden divide-y divide-gray-800/50">
              {filteredProfessionals.length > 0 ? (
                filteredProfessionals.map((p) => (
                  <Link 
                    key={p.uid} 
                    href={`/${p.slug}`}
                    className="flex items-center gap-4 p-4 hover:bg-gray-800/50 transition-all group"
                  >
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-emerald-500 to-blue-500">
                        <div className="w-full h-full rounded-full border-2 border-gray-950 overflow-hidden bg-gray-800">
                          {p.avatarUrl ? (
                            <img src={p.avatarUrl} alt={p.displayName} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-full h-full p-3 text-gray-600" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white truncate group-hover:text-emerald-400 transition-colors">
                        {p.displayName}
                      </h3>
                      <p className="text-gray-500 text-sm truncate">
                        @{p.slug}
                      </p>
                    </div>
                    
                    <ArrowRight className="w-5 h-5 text-gray-700 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                  </Link>
                ))
              ) : (
                <div className="p-10 text-center text-gray-500">
                  Nenhum profissional encontrado com esse nome ou link.
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Footer Minimalista */}
        <div className="mt-12 text-center text-gray-600 text-[10px] uppercase tracking-widest leading-loose">
          A maior rede de profissionais fitness do Brasil.<br/>
          &copy; 2026 ParceiroFit
        </div>
      </div>
    </div>
  );
}
