
"use client";

import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Target, LogOut, Briefcase, BarChart, TrendingUp, MessageCircle, BookOpen, Puzzle, BookUser, User, Info } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-semibold">InvestTrack</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/dashboard">
              <SidebarMenuButton isActive={pathname.startsWith('/dashboard')}>
                <Target />
                Goals
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/financial-assessment">
              <SidebarMenuButton isActive={pathname.startsWith('/financial-assessment')}>
                <BarChart />
                Financial Assessment
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/growth-chart">
              <SidebarMenuButton isActive={pathname.startsWith('/growth-chart')}>
                <BarChart />
                Growth Chart
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <Link href="/simulation">
              <SidebarMenuButton isActive={pathname.startsWith('/simulation')}>
                <TrendingUp />
                Simulation
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <Link href="/lessons">
              <SidebarMenuButton isActive={pathname.startsWith('/lessons')}>
                <BookOpen />
                Lesson Based Learning
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/quizzes-myths">
              <SidebarMenuButton isActive={pathname.startsWith('/quizzes-myths')}>
                <Puzzle />
                Quizzes & Myths
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/chat-room">
              <SidebarMenuButton isActive={pathname.startsWith('/chat-room')}>
                <MessageCircle />
                Chat Room
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/success-stories">
              <SidebarMenuButton isActive={pathname.startsWith('/success-stories')}>
                <BookUser />
                Success Stories
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
           <SidebarMenuItem>
            <Link href="/profile">
              <SidebarMenuButton isActive={pathname.startsWith('/profile')}>
                <User />
                Profile
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/about">
              <SidebarMenuButton isActive={pathname.startsWith('/about')}>
                <Info />
                About
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut}>
              <LogOut />
              Logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
