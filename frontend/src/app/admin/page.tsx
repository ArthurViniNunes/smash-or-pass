import type { Metadata } from "next";
import AdminHome from "@/components/admin/AdminHome";

export const metadata: Metadata = {
  title: "Painel administrativo | Smash or Pass",
  description:
    "Central de gerenciamento de receitas, usuários e métricas do sistema.",
};

export default function AdminPage() {
  return <AdminHome />;
}