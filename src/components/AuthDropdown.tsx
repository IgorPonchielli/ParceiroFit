"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { LogOut, LogIn, UserPlus, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function AuthDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout, userProfile, currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const avatarUrl = userProfile?.avatarUrl || "https://i.pravatar.cc/150?img=11";

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center transition-all duration-300 ${
          currentUser 
            ? "w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-emerald-500 overflow-hidden" 
            : "w-10 h-10 md:w-12 md:h-12 bg-black/50 backdrop-blur rounded-full border border-gray-800 hover:bg-black/70"
        }`}
      >
        {currentUser ? (
          <div className="relative w-full h-full">
            <Image src={avatarUrl} alt="Profile" fill className="object-cover" />
          </div>
        ) : (
          isOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl py-3 z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {currentUser ? (
            <>
              <div className="px-5 py-3 border-b border-gray-900 mb-2">
                <p className="text-sm text-white font-bold truncate">
                  {userProfile?.displayName || "Usuário"}
                </p>
                <p className="text-[10px] text-gray-500 truncate uppercase tracking-widest mt-1">
                  {currentUser?.email || ""}
                </p>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-5 py-3 text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-3 text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                Sair da Conta
              </button>
            </>
          ) : (
            <div className="px-2 space-y-1">
              <Link 
                href="/login" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-900 rounded-xl transition-all"
              >
                <LogIn className="w-4 h-4" />
                Entrar
              </Link>
              <div className="p-1">
                <Link 
                  href="/register-user" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-emerald-400 border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 rounded-xl transition-all font-bold"
                >
                  <UserPlus className="w-4 h-4" />
                  Cadastrar-se
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
