import { redirect } from "next/navigation";
import AdminEditor from "@/components/admin/AdminEditor";
import { isAdmin } from "@/lib/admin-guard";
import { getContentFresh, getVersions, storeEnabled } from "@/lib/store";

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const [content, versions] = await Promise.all([getContentFresh(), getVersions().catch(() => [])]);
  return <AdminEditor initial={content} versions={versions} storeReady={storeEnabled()} />;
}
