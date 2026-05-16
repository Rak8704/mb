"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Shield, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      if (!email || !password) {
        toast.error("Please enter both email and password");
        return;
      }
    } else {
      if (!email || !password || !name || !phone) {
        toast.error("Please fill in all fields");
        return;
      }
    }

    try {
      setLoading(true);

      if (isLogin) {
        // LOGIN LOGIC
        const { data, error } = await authClient.signIn.email({
          email,
          password,
          callbackURL: "/admin",
        });

        if (error?.code) {
          toast.error("Invalid credentials. Please check your email and password.");
          setLoading(false);
          return;
        }

        // Verify admin role
        const token = localStorage.getItem("bearer_token");
        const balanceRes = await fetch("/api/user/balance", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (balanceRes.ok) {
          const balanceData = await balanceRes.json();
          if (balanceData.role !== "admin") {
            await authClient.signOut();
            toast.error("Access denied. Admin privileges required.");
            setLoading(false);
            return;
          }
          toast.success("Admin login successful!");
          // Force a hard navigation to ensure session state is fresh
          window.location.href = "/admin";
        } else {
          window.location.href = "/admin";
        }
      } else {
        // SIGN UP LOGIC
        const { data, error } = await authClient.signUp.email({
          email,
          password,
          name,
          callbackURL: "/admin",
          // @ts-ignore
          role: "admin",
          phoneNumber: phone
        });

        if (error) {
          toast.error(error.message || "Failed to create admin account");
          setLoading(false);
          return;
        }

        toast.success("Admin account created successfully!");
        // Force a hard navigation to ensure session state is fresh
        window.location.href = "/admin";
      }
    } catch (error: any) {
      toast.error(error?.message || "Authentication failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Admin Portal</h1>
          <p className="text-muted-foreground">
            {isLogin ? "Secure access for administrators only" : "Create a new administrator account"}
          </p>
        </div>

        {/* Auth Form */}
        <div className="rounded-lg border border-border bg-card p-8 shadow-lg">
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Admin Name"
                    disabled={loading}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1234567890"
                    disabled={loading}
                    className="h-10"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail size={16} />
                Admin Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nicebet.com"
                disabled={loading}
                className="h-10"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock size={16} />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="h-10 pr-10"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold bg-green-600 hover:bg-green-700 text-white mt-2"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {isLogin ? "Verifying..." : "Creating Account..."}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Shield size={18} />
                  {isLogin ? "SIGN IN AS ADMIN" : "CREATE ADMIN ACCOUNT"}
                </span>
              )}
            </Button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Need to create a new admin?" : "Already have an admin account?"}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-primary hover:underline font-medium"
              >
                {isLogin ? "Create Admin" : "Sign In"}
              </button>
            </p>
          </div>

          {/* Demo Credentials Hint (Only on Login) */}
          {isLogin && (
            <div className="mt-6 p-4 rounded-md bg-muted/50 border border-border/50">
              <div className="flex items-center gap-2 mb-2 text-green-500 font-medium text-sm">
                <Shield size={14} />
                <span>Demo Admin Credentials:</span>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground font-mono">
                <p>Email: <span className="text-foreground">admin@nicebet.com</span></p>
                <p>Password: <span className="text-foreground">admin123</span></p>
              </div>
            </div>
          )}

          <div className="mt-4 text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-yellow-500/80">
              <Lock size={12} />
              <span>This is a secure admin area. All activities are logged.</span>
            </div>
          </div>
        </div>

        {/* Back to Main Site */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/")}
            className="text-sm text-muted-foreground hover:text-foreground underline"
          >
            ← Back to Main Site
          </button>
        </div>
      </div>
    </div>
  );
}