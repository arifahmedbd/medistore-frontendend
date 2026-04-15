import { getAdminUsersAction } from "@/actions/admin.action";
import UsersClient from "@/components/modules/adminDashboard/UsersClient";


interface Props {
  searchParams?: Promise<{ search?: string; role?: string; status?: string; page?: string }>;
}

export default async function AdminUsersPage({ searchParams }: Props) {
  const sp     = await searchParams;
  const search = sp?.search ?? "";
  const role   = (sp?.role   as "CUSTOMER"|"SELLER"|"ADMIN"|undefined) ?? undefined;
  const status = (sp?.status as "ACTIVE"|"BANNED"|undefined) ?? undefined;
  const page   = parseInt(sp?.page ?? "1", 10) || 1;

  const res        = await getAdminUsersAction({ page, search, role, status });
  const users      = res?.data?.users      ?? [];
  const totalPages = res?.data?.totalPages ?? 1;
  const total      = res?.data?.total      ?? 0;

  return (
    <UsersClient
      users={users} totalPages={totalPages} total={total}
      page={page} search={search}
      roleFilter={role ?? ""} statusFilter={status ?? ""}
    />
  );
}