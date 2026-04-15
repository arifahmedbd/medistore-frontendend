import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/modules/dashboard sidebar/DashboardSidebar";
import { getSessionAction } from "@/actions/session.action";

export default async function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionAction();
   if (!session?.data) redirect("/login");
   
   const user = session?.data?.data;

  if (!["SELLER"].includes(user.role as string)) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#070c14] text-gray-900 dark:text-white transition-colors">
<DashboardSidebar role="SELLER" user={user}></DashboardSidebar>      <main className="flex-1 ml-0 md:ml-64 transition-all bg-gray-50 dark:bg-[#0b1c2a]">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}