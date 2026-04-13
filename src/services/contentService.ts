import { collection, doc, getDoc, getDocs, updateDoc, deleteDoc, addDoc, serverTimestamp, query, where, orderBy, or, and, arrayRemove } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Content } from "@/types/models";
import { subscriptionService } from "./subscriptionService";

const CONTENTS_COLLECTION = "contents";

export const contentService = {
  /**
   * Obtém um conteúdo pelo seu ID.
   */
  async getContent(id: string): Promise<Content | null> {
    try {
      const docRef = doc(db, CONTENTS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Content;
      }
      return null;
    } catch (error) {
      console.error("Erro ao buscar conteúdo: ", error);
      throw error;
    }
  },

  /**
   * Busca todos os conteúdos de um profissional (usado na dashboard do profissional).
   */
  async getContentsByProfessional(profissional_uid: string): Promise<Content[]> {
    try {
      const q = query(
        collection(db, CONTENTS_COLLECTION),
        where("profissional_uid", "==", profissional_uid)
      );
      const querySnapshot = await getDocs(q);
      const contents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Content[];
      
      // Ordenação local para evitar erro de índice composto no Firestore
      return contents.sort((a, b) => {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateB - dateA;
      });
    } catch (error) {
      console.error("Erro ao buscar conteúdos do profissional: ", error);
      throw error;
    }
  },

  /**
   * Cria um novo conteúdo do tipo vídeo.
   */
  async createVideoContent(data: Omit<Content, "id" | "type" | "createdAt" | "updatedAt">): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, CONTENTS_COLLECTION), {
        ...data,
        type: "video",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Erro ao criar conteúdo de vídeo: ", error);
      throw error;
    }
  },

  /**
   * Cria um novo conteúdo do tipo artigo.
   */
  async createArticleContent(data: Omit<Content, "id" | "type" | "createdAt" | "updatedAt">): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, CONTENTS_COLLECTION), {
        ...data,
        type: "article",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Erro ao criar conteúdo de artigo: ", error);
      throw error;
    }
  },

  /**
   * Atualiza um conteúdo de vídeo existente.
   */
  async updateVideoContent(id: string, data: Partial<Omit<Content, "id" | "type" | "createdAt" | "updatedAt">>): Promise<void> {
    try {
      const docRef = doc(db, CONTENTS_COLLECTION, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Erro ao atualizar conteúdo de vídeo: ", error);
      throw error;
    }
  },

  /**
   * Atualiza um conteúdo de artigo existente.
   */
  async updateArticleContent(id: string, data: Partial<Omit<Content, "id" | "type" | "createdAt" | "updatedAt">>): Promise<void> {
    try {
      const docRef = doc(db, CONTENTS_COLLECTION, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Erro ao atualizar conteúdo de artigo: ", error);
      throw error;
    }
  },

  /**
   * Deleta um conteúdo de vídeo.
   */
  async deleteVideoContent(id: string): Promise<void> {
    try {
      const docRef = doc(db, CONTENTS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Erro ao deletar conteúdo de vídeo: ", error);
      throw error;
    }
  },

  /**
   * Deleta um conteúdo de artigo.
   */
  async deleteArticleContent(id: string): Promise<void> {
    try {
      const docRef = doc(db, CONTENTS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Erro ao deletar conteúdo de artigo: ", error);
      throw error;
    }
  },

  /**
   * Busca conteúdos acessíveis para um usuário em um determinado workspace.
   * - Conteúdo Público: Se is_free == true.
   * - Conteúdo Privado: Se o usuário tem assinatura ativa cujo plan_id está em allowed_plans.
   */
  async getAccessibleContents(profissional_uid: string, client_uid?: string): Promise<Content[]> {
    try {
      let planId: string | null = null;

      if (client_uid) {
        const subscription = await subscriptionService.getActiveSubscription(client_uid, profissional_uid);
        if (subscription) {
          planId = subscription.plan_id;
        }
      }

      let q;
      if (planId) {
        // Se tem plano, vê os grátis OU os que o plano permite
        q = query(
          collection(db, CONTENTS_COLLECTION),
          and(
            where("profissional_uid", "==", profissional_uid),
            or(
              where("is_free", "==", true),
              where("allowed_plans", "array-contains", planId)
            )
          )
        );
      } else {
        // Se não tem plano (ou não está logado), vê apenas os grátis
        q = query(
          collection(db, CONTENTS_COLLECTION),
          where("profissional_uid", "==", profissional_uid),
          where("is_free", "==", true)
        );
      }

      const querySnapshot = await getDocs(q);
      const contents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Content[];
      
      // Ordenação local para evitar erro de índice no Firestore
      return contents.sort((a, b) => {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateB - dateA;
      });
    } catch (error) {
      console.error("Erro ao buscar conteúdos acessíveis: ", error);
      throw error;
    }
  },

  /**
   * Remove a referência a um plano específico de todos os conteúdos de um profissional.
   * Útil ao excluir um plano (cascading delete).
   */
  async removePlanFromAllContents(planId: string, profissional_uid: string): Promise<void> {
    try {
      const q = query(
        collection(db, CONTENTS_COLLECTION),
        where("profissional_uid", "==", profissional_uid),
        // Apenas documentos que contenham o plano na lista
        where("allowed_plans", "array-contains", planId)
      );

      const querySnapshot = await getDocs(q);

      // Usando array de promessas para atualizar vários documentos em paralelo
      const updatePromises = querySnapshot.docs.map(document => {
        const docRef = doc(db, CONTENTS_COLLECTION, document.id);
        return updateDoc(docRef, {
          allowed_plans: arrayRemove(planId),
          updatedAt: serverTimestamp(),
        });
      });

      await Promise.all(updatePromises);
      
    } catch (error) {
      console.error("Erro ao remover o plano dos conteúdos vinculados: ", error);
      throw error;
    }
  }
};
