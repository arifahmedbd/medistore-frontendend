
import { getSessionAction } from "@/actions/session.action";
import CheckoutClient from "@/components/customer/CheckoutClient";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const sessionRes = await getSessionAction();
  const user = sessionRes?.data?.data as any;
  if (!user) redirect("/login");

  return <CheckoutClient defaultName={user.name ?? ""} defaultPhone={user.phone ?? ""} />;
}