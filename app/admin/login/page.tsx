import { redirect } from "next/navigation";
import { authConfigured } from "@/lib/auth";
import { isAdmin } from "@/lib/admin-guard";
import LoginForm from "@/components/admin/LoginForm";

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return <LoginForm configured={authConfigured()} />;
}
