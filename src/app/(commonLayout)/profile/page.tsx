
import { getMyProfileAction } from "@/actions/customer.action";
import { getSessionAction } from "@/actions/session.action";
import ProfileClient from "@/components/customer/ProfileClient";
import { redirect } from "next/navigation";


export default async function ProfilePage() {
  const session = await getSessionAction()
  if (!session) redirect("/login");

  const res     = await getMyProfileAction();
  const profile = res?.data
  console.log("pr", profile);

  return <ProfileClient profile={profile} />;
}