import { redirect } from "next/navigation";
import CartPageClient from "@/components/cart/CartPageClient";
import { getSessionAction } from "@/actions/session.action";

export default async function CartPage() {
  const session = await getSessionAction()
  if (!session) redirect("/login");
  return <CartPageClient />;
}