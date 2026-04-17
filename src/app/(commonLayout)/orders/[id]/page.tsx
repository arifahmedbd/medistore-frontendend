
import { getMyOrderByIdAction } from "@/actions/customer.action";
import { getSessionAction } from "@/actions/session.action";
import OrderDetailClient from "@/components/customer/OrderDetailClient";
import { redirect, notFound } from "next/navigation";


interface Props { params: Promise<{ id: string }> }

export default async function OrderDetailPage({ params }: Props) {
  const [session, { id }] = await Promise.all([
     getSessionAction(),
    params,
  ]);
  if (!session) redirect("/login");

  const res   = await getMyOrderByIdAction(id);
  const order = res?.data;
  if (!order) return notFound();

  return <OrderDetailClient order={order} />;
}