
import { getSessionAction } from "@/actions/session.action";
import CheckoutClient from "@/components/customer/CheckoutClient";
import { redirect } from "next/navigation";

export default async function CheckoutPage() {
  const sessionRes = await getSessionAction()
  if (!sessionRes) redirect("/login");

  const user = sessionRes?.data?.data as any;
  console.log(user,"ss")
  return <CheckoutClient defaultName={user.name ?? ""} defaultPhone={user.phone ?? ""} />;
}