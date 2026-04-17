import { VerifyEmailClient } from "@/components/modules/authentication/verify-email-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify email | MediStore",
  description: "Confirm your MediStore account email address.",
};

type Props = {
  searchParams?: Promise<{ token?: string; callbackURL?: string }>;
};

export default async function VerifyEmailPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const token = sp.token;
  const callbackURL = sp.callbackURL;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <VerifyEmailClient token={token} callbackURL={callbackURL} />
    </div>
  );
}
