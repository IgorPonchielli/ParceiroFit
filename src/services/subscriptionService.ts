import { collection, doc, getDoc, getDocs, query, updateDoc, where, deleteDoc, addDoc, limit, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Subscription } from "@/types/models";

const SUBSCRIPTIONS_COLLECTION = "subscriptions";

export const subscriptionService = {
  /**
   * Obtém uma assinatura pelo seu ID.
   */
  async getSubscription(id: string): Promise<Subscription | null> {
    try {
      const docRef = doc(db, SUBSCRIPTIONS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Subscription;
      }
      return null;
    } catch (error) {
      console.error("Erro ao buscar assinatura: ", error);
      throw error;
    }
  },

  /**
   * Busca a assinatura ativa de um usuário para um profissional específico.
   */
  async getActiveSubscription(client_uid: string, profissional_uid: string): Promise<Subscription | null> {
    try {
      const q = query(
        collection(db, SUBSCRIPTIONS_COLLECTION),
        where("client_uid", "==", client_uid),
        where("profissional_uid", "==", profissional_uid),
        where("status", "==", "active"),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        return { id: docSnap.id, ...docSnap.data() } as Subscription;
      }
      return null;
    } catch (error) {
      console.error("Erro ao buscar assinatura ativa: ", error);
      throw error;
    }
  },

  /**
   * Cria uma nova assinatura.
   */
  async createSubscription(data: Omit<Subscription, "id" | "createdAt" | "updatedAt">): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, SUBSCRIPTIONS_COLLECTION), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Erro ao criar assinatura: ", error);
      throw error;
    }
  },

  /**
   * Atualiza os dados de uma assinatura.
   */
  async updateSubscription(id: string, data: Partial<Subscription>): Promise<void> {
    try {
      const docRef = doc(db, SUBSCRIPTIONS_COLLECTION, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Erro ao atualizar assinatura: ", error);
      throw error;
    }
  },

  /**
   * Deleta uma assinatura.
   */
  async deleteSubscription(id: string): Promise<void> {
    try {
      const docRef = doc(db, SUBSCRIPTIONS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Erro ao deletar assinatura: ", error);
      throw error;
    }
  }
};
