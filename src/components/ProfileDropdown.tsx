"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export function ProfileDropdown() {
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
      router.push("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  // Avatar de fallback caso não tenha no firestore / auth
  const avatarUrl = userProfile?.avatarUrl || "https://i.pravatar.cc/150?img=11";

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-emerald-500 relative bg-gray-800 transition-all cursor-pointer hover:scale-105"
      >
        <Image src={avatarUrl} alt="Profile" fill className="object-cover" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-800 mb-2">
            <p className="text-sm text-white font-medium truncate">
              {userProfile?.displayName || "Usuário"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {currentUser?.email || ""}
            </p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-800 transition-all cursor-pointer flex items-center gap-2 text-sm"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
