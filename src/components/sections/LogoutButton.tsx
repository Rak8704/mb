// components/LogoutButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-client";
import { toast } from "sonner";

export function LogoutButton() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      const result = await logout();
      
      if (result.success) {
        toast.success("Logged out successfully");
      } else {
        toast.warning("Logged out with issues");
      }
      
      // Redirect to login page
      router.push("/login");
      router.refresh(); // Refresh the page
      
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
      
      // Force redirect anyway
      localStorage.clear();
      router.push("/login");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="rounded-md bg-destructive px-4 py-2 text-sm text-destructive-foreground hover:opacity-90"
    >
      Logout
    </button>
  );
}
