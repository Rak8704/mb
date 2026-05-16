"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient, useSession } from "@/lib/auth-client";

export const AuthButtons = () => {
  const router = useRouter();
  const { data: session, isPending, refetch } = useSession();

  const handleSignOut = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("bearer_token") : "";
    const { error } = await authClient.signOut();
    if (!error) {
      if (typeof window !== "undefined") localStorage.removeItem("bearer_token");
      refetch();
      router.push("/");
    }
  };

  if (isPending) {
    return (
      <div className="h-8 w-24 animate-pulse rounded-md bg-muted" aria-hidden />
    );
  }

  if (!session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="flex items-center rounded-md bg-secondary px-3 py-1.5 text-xs font-medium uppercase leading-tight text-secondary-foreground md:text-sm"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="flex items-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium uppercase leading-tight text-primary-foreground md:text-sm"
        >
          REGISTER
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/en/account"
        className="flex items-center rounded-md bg-muted px-3 py-1.5 text-xs font-medium uppercase leading-tight text-foreground md:text-sm"
      >
        {session.user.name || session.user.email || "Account"}
      </Link>
      <button
        onClick={handleSignOut}
        className="flex items-center rounded-md bg-destructive px-3 py-1.5 text-xs font-medium uppercase leading-tight text-destructive-foreground md:text-sm"
      >
        Sign out
      </button>
    </div>
  );
};

export default AuthButtons;