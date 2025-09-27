"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import Logo from "../logo";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "../theme-toggle";

export default function DashboardHeader() {
  const isMobile = useIsMobile();
  return (
    <header className="sticky top-0 z-40 border-b bg-background px-4 sm:px-6 lg:px-8">
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
            {isMobile && <Logo />}
        </div>
        <div className="flex items-center gap-4">
            <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
