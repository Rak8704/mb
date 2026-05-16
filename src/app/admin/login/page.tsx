"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
      if (!email || !password || !name) {
        toast.error("Please fill in all required fields");
        return;
      }
    }

    try {
      setLoading(true);

      if (isLogin) {
        // 登录逻辑 - 调用你的 API
        const response = await fetch("/api/admin/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          toast.error(data.error || "Login failed");
          setLoading(false);
          return;
        }

        // 保存 token 到 localStorage
        if (data.token) {
          localStorage.setItem("admin_token", data.token);
          localStorage.setItem("admin_user", JSON.stringify(data.admin));
        }

        toast.success("Admin login successful!");
        
        // 重定向到 admin 页面
        window.location.href = "/admin";
      } else {
        // 注册逻辑 - 调用你的 API
        const response = await fetch("/api/admin/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            phone: phone || null,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          toast.error(data.error || "Registration failed");
          setLoading(false);
          return;
        }

        toast.success("Admin account created successfully!");
        
        // 自动切换到登录模式
        setIsLogin(true);
        setEmail(email);
        setPassword("");
        setName("");
        setPhone("");
      }
    } catch (error: any) {
      toast.error(error?.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 检查是否已经登录
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      // 验证 token 是否有效
      fetch("/api/admin/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.valid) {
            router.push("/admin");
          } else {
            localStorage.removeItem("admin_token");
            localStorage.removeItem("admin_user");
          }
        })
        .catch(() => {
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_user");
        });
    }
  }, [router]);

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
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Admin Name"
                    disabled={loading}
                    className="h-10"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
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
                Admin Email *
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
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock size={16} />
                Password *
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
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={loading}
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
            disabled={loading}
          >
            ← Back to Main Site
          </button>
        </div>
      </div>
    </div>
  );
}
