import { getAdminCategoriesAction } from "@/actions/admin.action";
import CategoriesClient from "@/components/modules/adminDashboard/CategoriesClient";

export default async function AdminCategoriesPage() {
  const res        = await getAdminCategoriesAction();
  const categories = res?.data ?? [];
  return <CategoriesClient categories={categories} />;
}