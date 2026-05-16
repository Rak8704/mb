"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Call logout API
      await fetch('/api/logout', {
        method: 'POST',
      });

      // Clear local storage
      localStorage.removeItem("bearer_token");
      localStorage.removeItem("user");
      
      // Clear session storage
      sessionStorage.clear();
      
      // Redirect to login
      router.push('/login');
      router.refresh();

    } catch (error) {
      console.error("Logout error:", error);
      // Force clear anyway
      localStorage.clear();
      router.push('/login');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="rounded-md bg-destructive px-3 py-1 text-sm text-destructive-foreground hover:opacity-90"
    >
      Logout
    </button>
  );
}
