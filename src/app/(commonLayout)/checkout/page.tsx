
import { getSessionAction } from "@/actions/session.action";
import CheckoutClient from "@/components/customer/CheckoutClient";
import { redirect } from "next/navigation";

export default async function CheckoutPage() {
  const sessionRes = await getSessionAction()
  if (!sessionRes) redirect("/login");

  const user = sessionRes.data.user as any;
  return <CheckoutClient defaultName={user.name ?? ""} defaultPhone={user.phone ?? ""} />;
}