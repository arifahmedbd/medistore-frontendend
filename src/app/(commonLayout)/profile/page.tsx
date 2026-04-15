import { getMyProfileAction, getSessionAction } from "@/actions/customer.action";
import ProfileClient from "@/components/modules/user/ProfileClient";
import { redirect } from "next/navigation";


export default async function ProfilePage() {
  const session = await getSessionAction()
  if (!session) redirect("/login");

  const res     = await getMyProfileAction();
  const profile = res?.data?.data;

  return <ProfileClient profile={profile} />;
}