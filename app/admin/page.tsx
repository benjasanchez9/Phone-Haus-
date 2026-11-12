import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/server";
import { PRODUCT_COLUMNS, type ProductRow } from "@/lib/product-row";
import { AdminPanel } from "@/components/admin/AdminPanel";

export default async function AdminPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const { data, error } = await admin.supabase
    .from("productos")
    .select(PRODUCT_COLUMNS)
    .order("creado_en", { ascending: false });

  if (error) {
    return <p className="text-danger">No se pudieron cargar los artículos: {error.message}</p>;
  }

  const email = typeof admin.claims.email === "string" ? admin.claims.email : "";
  return <AdminPanel rows={(data ?? []) as unknown as ProductRow[]} email={email} />;
}
