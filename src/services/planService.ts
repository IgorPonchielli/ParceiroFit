import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where, deleteDoc, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Plan } from "@/types/models";

const PLANS_COLLECTION = "plans";

export const planService = {
  /**
   * Obtém um plano pelo seu ID.
   */
  async getPlan(id: string): Promise<Plan | null> {
    try {
      const docRef = doc(db, PLANS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Plan;
      }
      return null;
    } catch (error) {
      console.error("Erro ao buscar plano: ", error);
      throw error;
    }
  },

  /**
   * Busca todos os planos de um profissional específico.
   */
  async getPlansByProfessional(profissional_uid: string): Promise<Plan[]> {
    try {
      const q = query(collection(db, PLANS_COLLECTION), where("profissional_uid", "==", profissional_uid));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Plan[];
    } catch (error) {
      console.error("Erro ao buscar planos por profissional: ", error);
      throw error;
    }
  },

  /**
   * Cria um novo plano.
   */
  async createPlan(data: Omit<Plan, "id">): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, PLANS_COLLECTION), data);
      return docRef.id;
    } catch (error) {
      console.error("Erro ao criar plano: ", error);
      throw error;
    }
  },

  /**
   * Atualiza os dados de um plano existente.
   */
  async updatePlan(id: string, data: Partial<Plan>): Promise<void> {
    try {
      const docRef = doc(db, PLANS_COLLECTION, id);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error("Erro ao atualizar plano: ", error);
      throw error;
    }
  },

  /**
   * Deleta um plano.
   */
  async deletePlan(id: string): Promise<void> {
    try {
      const docRef = doc(db, PLANS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Erro ao deletar plano: ", error);
      throw error;
    }
  }
};
