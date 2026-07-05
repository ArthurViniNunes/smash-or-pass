import type { Metadata } from "next";
import UsersAdminView from "@/components/admin/UsersAdminView";

export const metadata: Metadata = {
  title: "Usuários | Painel administrativo",
  description: "Consulte e gerencie as contas cadastradas no sistema.",
};

export default function AdminUsersPage() {
  return <UsersAdminView />;
}
