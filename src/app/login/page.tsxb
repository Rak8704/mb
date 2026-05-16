import { Suspense } from "react";
import LoginForm from "@/components/sections/login-form";

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Suspense fallback={
        <div className="container py-12">
          <div className="mx-auto w-full max-w-md rounded-lg border border-border bg-card p-6 shadow">
            <div className="h-8 mb-6 bg-muted animate-pulse rounded" />
            <div className="space-y-4">
              <div className="h-10 bg-muted animate-pulse rounded" />
              <div className="h-10 bg-muted animate-pulse rounded" />
              <div className="h-10 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}