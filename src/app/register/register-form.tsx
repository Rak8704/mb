"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Gift } from "lucide-react";
import { toast } from "sonner";

export function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [referralCode, setReferralCode] = useState(searchParams?.get("ref") || "");
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
            // Call our custom API endpoint
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    referralCode: referralCode.trim()
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 409) {
                    setError("Email already registered. Please login instead.");
                } else {
                    setError(data.error || "Registration failed. Please try again.");
                }
                setLoading(false);
                return;
            }

            // Store token in localStorage
            if (data.token) {
                localStorage.setItem("bearer_token", data.token);
            }

            // Store user data
            localStorage.setItem("user", JSON.stringify(data.data));

            // Show success message
            toast.success('Account created successfully!');

            // Clear announcement flag
            localStorage.removeItem("announcement_last_seen");
            
            // Redirect to home
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
                            <p className="mt-1 text-xs text-muted-foreground">
                                Have a referral code? Enter it to get assigned to an agent!
                            </p>
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
