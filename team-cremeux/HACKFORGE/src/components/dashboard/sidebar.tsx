
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  IndianRupee,
  FileText,
  AlertTriangle,
  Settings,
  Receipt,
  Target,
  Rocket,
} from "lucide-react";
import Logo from "../logo";
import { ThemeToggle } from "../theme-toggle";

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/">
              <SidebarMenuButton isActive={pathname === '/'}>
                <LayoutDashboard />
                Dashboard
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/transactions">
              <SidebarMenuButton isActive={pathname === '/transactions'}>
                <IndianRupee />
                Transactions
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/invoices">
              <SidebarMenuButton isActive={pathname === '/invoices'}>
                <Receipt />
                Invoices
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/reports">
              <SidebarMenuButton isActive={pathname === '/reports'}>
                <FileText />
                Reports
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/alerts">
              <SidebarMenuButton isActive={pathname === '/alerts'}>
                <AlertTriangle />
                Alerts
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <Link href="/goals">
              <SidebarMenuButton isActive={pathname === '/goals'}>
                <Target />
                Goals
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/tax">
              <SidebarMenuButton isActive={pathname === '/tax'}>
                <FileText />
                Tax Center
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <Link href="/pricing">
              <SidebarMenuButton isActive={pathname === '/pricing'}>
                <Rocket />
                Upgrade
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/settings">
              <SidebarMenuButton isActive={pathname === '/settings'}>
                <Settings />
                Settings
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-2">
          <div className="flex items-center justify-between">
                <span>Theme</span>
                <ThemeToggle />
            </div>
      </SidebarFooter>
    </Sidebar>
  );
}
