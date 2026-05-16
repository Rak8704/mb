"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export const BetsSection = () => {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  if (isPending) return <div className="p-6">Loading...</div>;
  if (!session?.user) {
    router.push("/login?redirect=/en/bets");
    return null;
  }

  return (
    <div className="container py-8">
      <div className="rounded-lg border border-border bg-card p-6">
        <h1 className="mb-4 text-2xl font-bold">My Bets</h1>
        <p className="text-sm text-muted-foreground">Your recent bets will appear here.</p>
        <p className="mt-4 text-sm"><Link href="/en/account" className="text-primary underline">Back to Account</Link></p>
      </div>
    </div>
  );
};

export default BetsSection;