import { getCategoriesAction } from "@/actions/category.action";
import { getSellerMedicinesAction } from "@/actions/seller.action";
import InventoryClient from "@/components/modules/sellerDashboard/InventoryClient";



interface Props {
  searchParams?: Promise<{ search?: string; page?: string; action?: string }>;
}

export default async function SellerMedicinesPage({ searchParams }: Props) {
  const resolved = await searchParams;
  const search   = resolved?.search ?? "";
  const page     = parseInt(resolved?.page ?? "1", 10) || 1;
  const openAdd  = resolved?.action === "new";

  const [medRes, categoriesRes] = await Promise.all([
    getSellerMedicinesAction({ page, search }),
    getCategoriesAction(),
  ]);
  const medicines  = medRes?.data?.medicines ?? [];
  const categories  = categoriesRes;
  const totalPages = medRes?.data?.totalPages ?? 1;
  const total      = medRes?.data?.total ?? 0;
  return (
    <InventoryClient
      medicines={medicines}
      categories={categories ?? []}
      totalPages={totalPages}
      total={total}
      page={page}
      search={search}
      openAddModal={openAdd}
    />
  );
}