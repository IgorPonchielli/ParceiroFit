import { Timestamp } from "firebase/firestore";

export type Role = "admin" | "professional" | "client";
export type PaymentStatus = "pending" | "paid";

export interface User {
  uid: string;
  email: string;
  displayName: string;
  avatarUrl?: string; // Add this line
  slug?: string; // Adicionando slug para roteamento profissional
  role: Role;
  paymentStatus: PaymentStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface WorkspaceTheme {
  primary: string;
  secondary: string;
}

export interface Workspace {
  id?: string;
  professionalId: string;
  slug: string;
  biography: string;
  coverUrl: string;
  theme: WorkspaceTheme;
  mpAccessToken: string;
}

export interface Content {
  id?: string;
  profissional_uid: string;
  type: "video" | "article";
  title: string;
  description: string;
  youtube_id?: string; // Preenchido apenas se o tipo for "video"
  is_free: boolean;
  allowed_plans: string[]; // Lista de IDs de planos
  article_media?: string[]; // URLs de imagens para artigos
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type PlanPeriodicity = "monthly" | "quarterly" | "semiannual" | "yearly";

export interface Plan {
  id?: string;
  profissional_uid: string;
  title: string;
  price: number;
  periodicity: PlanPeriodicity;
  mp_plan_id: string; // ID gerado na API do Mercado Pago
}

export type SubscriptionStatus = "active" | "inactive" | "pending" | "cancelled";

export interface Subscription {
  id?: string;
  client_uid: string;
  profissional_uid: string;
  plan_id: string;
  status: SubscriptionStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
