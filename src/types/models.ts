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
