"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type VerifyState = "loading" | "success" | "error" | "missing";

function safeRedirectPath(href: string | undefined): string {
  if (!href || !href.startsWith("/") || href.startsWith("//")) return "/";
  return href;
}

export function VerifyEmailClient({
  token,
  callbackURL,
}: {
  token: string | undefined;
  callbackURL: string | undefined;
}) {
  const router = useRouter();
  const [state, setState] = useState<VerifyState>(
    token ? "loading" : "missing",
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const redirectTo = safeRedirectPath(callbackURL);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    let redirectTimer: ReturnType<typeof setTimeout> | undefined;

    (async () => {
      const { error } = await authClient.verifyEmail({
        query: { token },
      });

      if (cancelled) return;

      if (error) {
        setState("error");
        setErrorMessage(error.message ?? "Verification failed.");
        toast.error(error.message ?? "Verification failed.");
        return;
      }

      setState("success");
      toast.success("Email verified successfully.");
      router.refresh();
      redirectTimer = setTimeout(() => {
        router.push(redirectTo);
      }, 1500);
    })();

    return () => {
      cancelled = true;
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [token, redirectTo, router]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Email verification</CardTitle>
        <CardDescription>
          {state === "loading" && "Confirming your email address…"}
          {state === "success" && "You are all set."}
          {state === "error" && "We could not verify this link."}
          {state === "missing" && "This page needs a valid link from your email."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4 py-2">
        {state === "loading" && (
          <Loader2 className="size-12 text-[#2ecc8a] animate-spin" aria-hidden />
        )}
        {state === "success" && (
          <CheckCircle2 className="size-12 text-[#2ecc8a]" aria-hidden />
        )}
        {(state === "error" || state === "missing") && (
          <XCircle className="size-12 text-destructive" aria-hidden />
        )}
        {state === "error" && (
          <p className="text-center text-sm text-muted-foreground">{errorMessage}</p>
        )}
        {state === "missing" && (
          <p className="text-center text-sm text-muted-foreground">
            Open the verification message we sent you and tap{" "}
            <strong>Verify Email</strong>, or paste the full link into this
            browser.
          </p>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center">
        {(state === "error" || state === "missing") && (
          <>
            <Button asChild variant="default" className="w-full sm:w-auto">
              <Link href="/login">Go to login</Link>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/register">Register</Link>
            </Button>
          </>
        )}
        {state === "success" && (
          <Button asChild className="w-full sm:w-auto">
            <Link href={redirectTo}>Continue</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
