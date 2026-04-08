"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User as FirebaseUser, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { auth } from "@/lib/firebase";
import { userService } from "@/services/userService";
import { workspaceService } from "@/services/workspaceService";
import { User as AppUser, Role } from "@/types/models";

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: AppUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, displayName: string, slug?: string, role?: Role) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  loading: true,
  logout: async () => {},
  login: async () => {},
  register: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          const profile = await userService.getUser(user.uid);
          
          // Fallback para usuários antigos que não têm slug no documento 'users'
          if (profile && !profile.slug && profile.role === "professional") {
            const workspace = await workspaceService.getWorkspace(user.uid);
            if (workspace) {
              profile.slug = workspace.slug;
              // Salva o slug no documento do usuário agora que o encontramos
              await userService.updateUser(user.uid, { slug: workspace.slug });
            }
          }
          
          setUserProfile(profile);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
      throw error;
    }
  };

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const register = async (email: string, pass: string, displayName: string, slug: string = "", role: Role = "professional") => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const uid = userCredential.user.uid;
    const now = Timestamp.now();

    // 1. Criar Perfil de Usuário
    await userService.createUser({
      uid,
      email,
      displayName,
      role,
      paymentStatus: role === "professional" ? "paid" : "paid", // For now students are always "paid" or we can default to paid
      avatarUrl: "",
      slug: slug ? slug.toLowerCase().trim() : "",
      createdAt: now,
      updatedAt: now,
    });

    // 2. Criar Workspace Padrão apenas para Profissionais
    if (role === "professional") {
      await workspaceService.createWorkspace(uid, {
        professionalId: uid,
        slug: slug.toLowerCase().trim(),
        biography: "Transformando vidas através do movimento. Consultoria online, treinos periodizados e nutrição na medida certa. 💪",
        coverUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&h=600&fit=crop",
        mpAccessToken: "Mercado Pago OAuth Token (Mockup)",
        theme: {
          primary: "#10b981", // Emerald 500
          secondary: "#064e3b", // Emerald 900
        }
      });
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, loading, logout, login, register }}>
      {children}
    </AuthContext.Provider>
  );
};
