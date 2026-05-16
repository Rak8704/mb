"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export const MobileMenuButton = () => {
  const handleClick = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("open-mobile-sidebar"));
    }
  };

  return (
    <Button
      onClick={handleClick}
      size="sm"
      className="lg:hidden bg-primary text-primary-foreground"
      aria-label="Open menu"
    >
      <Menu className="mr-2 h-4 w-4" />
      Menu
    </Button>
  );
};