"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Loader2, Square, CheckSquare } from "lucide-react";
import { workspaceService } from "@/services/workspaceService";
import { Workspace, Session } from "@/types/models";

interface SessionSelectorProps {
  professionalId: string;
  selectedSessionIds: string[];
  onChange: (sessionIds: string[]) => void;
  onNewSessionCreated?: (session: Session) => void;
}

export function SessionSelector({ professionalId, selectedSessionIds, onChange, onNewSessionCreated }: SessionSelectorProps) {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form para nova sessão
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsCreatingNew(false); // reseta ao fechar
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function loadSessions() {
      if (!professionalId) return;
      try {
        const ws = await workspaceService.getWorkspaceByProfessionalId(professionalId);
        setWorkspace(ws);
      } catch (err) {
        console.error("Erro ao carregar sessões", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSessions();
  }, [professionalId]);

  const toggleSession = (sessionId: string) => {
    if (selectedSessionIds.includes(sessionId)) {
      onChange(selectedSessionIds.filter(id => id !== sessionId));
    } else {
      onChange([...selectedSessionIds, sessionId]);
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !professionalId) return;

    setIsSubmitting(true);
    try {
      const newSession: Session = {
        id: Math.random().toString(36).substr(2, 10),
        title: newTitle.trim(),
        description: newDescription.trim()
      };

      // Chama preenchimento em memória no form PAI (que vai segurar até o Salvar)
      if (onNewSessionCreated) {
        onNewSessionCreated(newSession);
      }
      
      // Atualizar local para refletir na UI imediatamente
      setWorkspace(prev => prev ? {
        ...prev,
        sessions: [...(prev.sessions || []), newSession]
      } : null);

      // Auto seleciona a recém criada
      onChange([...selectedSessionIds, newSession.id]);

      // Reseta form e volta para a lista
      setNewTitle("");
      setNewDescription("");
      setIsCreatingNew(false);
      
    } catch (err) {
      console.error("Erro ao criar sessão", err);
      alert("Erro ao criar sessão. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentSessions = workspace?.sessions || [];

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-gray-400 text-sm font-medium">Sessões</h3>
        <p className="text-gray-500 text-xs mt-1">Adicione seu conteúdo a uma ou mais sessões e organize o conteúdo para os alunos.</p>
      </div>

      <div className="relative w-full" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-white text-left flex justify-between items-center outline-none focus:border-emerald-500 transition-colors cursor-pointer"
        >
          <span className={selectedSessionIds.length === 0 ? "text-gray-500" : "text-white truncate"}>
            {selectedSessionIds.length === 0 
              ? "Selecionar" 
              : `${selectedSessionIds.length} ${selectedSessionIds.length === 1 ? 'sessão selecionada' : 'sessões selecionadas'}`}
          </span>
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </button>

        {isOpen && (
          <div className="absolute left-0 mt-2 w-full min-w-[300px] bg-gray-900 border border-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {!isCreatingNew ? (
              <>
                <div className="max-h-64 overflow-y-auto p-2">
                  {isLoading ? (
                    <div className="p-4 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-gray-500" /></div>
                  ) : currentSessions.length === 0 ? (
                    <div className="p-4 text-sm text-gray-500 text-center">Nenhuma sessão criada.</div>
                  ) : (
                    <div className="space-y-1">
                      {currentSessions.map(session => {
                        const isSelected = selectedSessionIds.includes(session.id);
                        return (
                          <div 
                            key={session.id}
                            onClick={() => toggleSession(session.id)}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors"
                          >
                            <div className="text-gray-400 shrink-0 flex items-center">
                              {isSelected ? <CheckSquare className="w-5 h-5 text-emerald-500" /> : <Square className="w-5 h-5" />}
                            </div>
                            <span className="text-sm font-medium text-gray-200 truncate">{session.title}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                <div className="border-t border-gray-800 bg-gray-950 p-3 flex justify-between items-center">
                  <button 
                    type="button"
                    onClick={() => setIsCreatingNew(true)}
                    className="flex items-center gap-2 text-sm font-medium text-white hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    Nova sessão <ChevronDown className="w-4 h-4 ml-1" />
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    Concluir
                  </button>
                </div>
              </>
            ) : (
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Título (obrigatório)</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Adicione um título"
                    className="w-full bg-transparent border border-gray-700 rounded-lg text-white p-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Descrição</label>
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Adicione uma descrição"
                    className="w-full bg-transparent border border-gray-700 rounded-lg text-white p-3 text-sm focus:outline-none focus:border-emerald-500 resize-none h-20 transition-colors"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    type="button"
                    onClick={() => setIsCreatingNew(false)}
                    className="px-4 py-2 text-sm text-gray-400 font-medium hover:text-white transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="button"
                    onClick={handleCreateSession}
                    disabled={isSubmitting || !newTitle.trim()}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-gray-950 text-sm font-bold rounded-lg flex items-center transition-all cursor-pointer hover:scale-105"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2 text-gray-500" /> : null}
                    Concluir
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
