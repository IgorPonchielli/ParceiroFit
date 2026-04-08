import { collection, doc, getDoc, setDoc, updateDoc, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User } from "@/types/models";

const USERS_COLLECTION = "users";

export const userService = {
  /**
   * Obtém o perfil de um usuário pelo seu UID.
   */
  async getUser(uid: string): Promise<User | null> {
    try {
      const docRef = doc(db, USERS_COLLECTION, uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { uid: docSnap.id, ...docSnap.data() } as User;
      }
      return null;
    } catch (error) {
      console.error("Erro ao buscar usuário: ", error);
      throw error;
    }
  },

  /**
   * Cria um novo usuário no Firestore.
   */
  async createUser(user: User): Promise<void> {
    try {
      const docRef = doc(db, USERS_COLLECTION, user.uid);
      await setDoc(docRef, user);
    } catch (error) {
      console.error("Erro ao criar usuário: ", error);
      throw error;
    }
  },

  /**
   * Atualiza os dados de um usuário existente.
   */
  async updateUser(uid: string, data: Partial<User>): Promise<void> {
    try {
      const docRef = doc(db, USERS_COLLECTION, uid);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error("Erro ao atualizar usuário: ", error);
      throw error;
    }
  },
  
  /**
   * Verifica se um e-mail já está cadastrado no Firestore.
   */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const q = query(
        collection(db, USERS_COLLECTION),
        where("email", "==", email),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        return { uid: docSnap.id, ...docSnap.data() } as User;
      }
      return null;
    } catch (error) {
      console.error("Erro ao buscar usuário por email: ", error);
      throw error;
    }
  },

  /**
   * Obtém todos os usuários com o papel de profissional.
   */
  async getProfessionals(): Promise<User[]> {
    try {
      const q = query(
        collection(db, USERS_COLLECTION),
        where("role", "==", "professional")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })) as User[];
    } catch (error) {
      console.error("Erro ao buscar profissionais: ", error);
      throw error;
    }
  }
};
