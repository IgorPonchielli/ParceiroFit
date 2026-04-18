import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Workspace } from "@/types/models";

const WORKSPACES_COLLECTION = "workspaces";

export const workspaceService = {
  /**
   * Obtém as configurações do workspace (professional workspace) pelo ID do Workspace.
   */
  async getWorkspace(workspaceId: string): Promise<Workspace | null> {
    try {
      const docRef = doc(db, WORKSPACES_COLLECTION, workspaceId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Workspace;
      }
      return null;
    } catch (error) {
      console.error("Erro ao buscar workspace: ", error);
      throw error;
    }
  },

  /**
   * Busca um workspace pelo seu slug. Útil para rotas dinâmicas como /:slug
   */
  async getWorkspaceBySlug(slug: string): Promise<Workspace | null> {
    try {
      const q = query(collection(db, WORKSPACES_COLLECTION), where("slug", "==", slug));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        return { id: docSnap.id, ...docSnap.data() } as Workspace;
      }
      return null;
    } catch (error) {
      console.error("Erro ao buscar workspace por slug: ", error);
      throw error;
    }
  },

  /**
   * Busca um workspace pelo ID do profissional dono.
   */
  async getWorkspaceByProfessionalId(professionalId: string): Promise<Workspace | null> {
    try {
      const q = query(collection(db, WORKSPACES_COLLECTION), where("professionalId", "==", professionalId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        return { id: docSnap.id, ...docSnap.data() } as Workspace;
      }
      return null;
    } catch (error) {
      console.error("Erro ao buscar workspace pelo ID do profissional: ", error);
      throw error;
    }
  },

  /**
   * Cria um workspace para um novo profissional.
   */
  async createWorkspace(workspaceId: string, data: Omit<Workspace, "id">): Promise<void> {
    try {
      const docRef = doc(db, WORKSPACES_COLLECTION, workspaceId);
      await setDoc(docRef, data);
    } catch (error) {
      console.error("Erro ao criar workspace: ", error);
      throw error;
    }
  },

  /**
   * Atualiza as configurações de um workspace.
   */
  async updateWorkspace(workspaceId: string, data: Partial<Workspace>): Promise<void> {
    try {
      const docRef = doc(db, WORKSPACES_COLLECTION, workspaceId);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error("Erro ao atualizar workspace: ", error);
      throw error;
    }
  }
};
