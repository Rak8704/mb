"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Gift } from "lucide-react";
import { toast } from "sonner";

export function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [referralCode, setReferralCode] = useState(searchParams?.get("ref") || ""); // Get from URL or empty
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        if (password !== confirm) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            // First, sign up the user
            const { error: signUpError } = await authClient.signUp.email({
                email,
                name,
                password,
            });

            if (signUpError) {
                if (signUpError.code === "USER_ALREADY_EXISTS") {
                    setError("Email already registered. Please login instead.");
                } else if (signUpError.message?.includes("Password")) {
                    setError(signUpError.message);
                } else {
                    setError("Registration failed. Please try again.");
                }
                setLoading(false);
                return;
            }

            // If referral code is provided, process it
            if (referralCode && referralCode.trim() !== '') {
                try {
                    // Wait a bit for token to be set
                    await new Promise(resolve => setTimeout(resolve, 500));
                    const token = localStorage.getItem("bearer_token");

                    console.log('Applying referral code:', referralCode.trim());

                    const response = await fetch('/api/referral/apply', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            ...(token ? { Authorization: `Bearer ${token}` } : {}),
                        },
                        body: JSON.stringify({ referralCode: referralCode.trim() }),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        console.log('✅ Referral code applied successfully:', data);
                        toast.success('Referral code applied! You have been assigned to an agent.');
                    } else {
                        console.warn('Referral code application failed, but registration succeeded');
                    }
                } catch (refError) {
                    console.warn('Error applying referral code:', refError);
                    // Don't fail registration if referral fails
                }
            } else {
                // No referral code - user will be auto-assigned by the server hook
                console.log('✅ User created! Auto-assignment handled by server.');
            }

            // Clear announcement flag so popup shows after registration
            localStorage.removeItem("announcement_last_seen");
            router.push("/");
        } catch (err) {
            setError("Registration failed. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="container py-12">
                <div className="mx-auto w-full max-w-md rounded-lg border border-border bg-card p-6 shadow">
                    <h1 className="mb-6 text-center text-2xl font-bold">Create account</h1>
                    {error && (
                        <div className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive-foreground">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm">Name</label>
                            <input
                                type="text"
                                className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                autoComplete="name"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm">Email</label>
                            <input
                                type="email"
                                className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm">Password</label>
                            <input
                                type="password"
                                className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                autoComplete="off"
                            />
                            <p className="mt-1 text-xs text-muted-foreground">Minimum 6 characters</p>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm">Confirm Password</label>
                            <input
                                type="password"
                                className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                required
                                autoComplete="off"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm flex items-center gap-2">
                                <Gift className="h-4 w-4 text-primary" />
                                Referral Code <span className="text-xs text-muted-foreground">(Optional)</span>
                            </label>
                            <input
                                type="text"
                                className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
                                value={referralCode}
                                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                                placeholder="Enter referral code"
                                autoComplete="off"
                            />
                            <p className="mt-1 text-xs text-muted-foreground">Have a referral code? Enter it to get assigned to an agent!</p>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 w-full rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
                        >
                            {loading ? "Creating..." : "Register"}
                        </button>
                    </form>
                    <p className="mt-4 text-center text-sm text-muted-foreground">
                        Already have an account? <Link href="/login" className="text-primary underline">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
