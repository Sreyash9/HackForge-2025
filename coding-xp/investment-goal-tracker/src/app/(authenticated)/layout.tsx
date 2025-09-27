
'use client';

import { AppSidebar } from "@/components/layout/sidebar";
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { GlobalChatbot } from "@/components/chatbot/global-chatbot";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useI18n } from "@/lib/i18n";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { cn } from "@/lib/utils";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useI18n();
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname.startsWith('/dashboard')) {
      return t('goals');
    }
    if (pathname.startsWith('/lessons')) {
      return 'Lesson Based Learning';
    }
     if (pathname.startsWith('/quizzes-myths')) {
      return 'Quizzes & Myths';
    }
    if (pathname.startsWith('/growth-chart')) {
      return t('compoundGrowth');
    }
    if (pathname.startsWith('/financial-assessment')) {
      return 'Financial Assessment';
    }
     if (pathname.startsWith('/simulation')) {
      return t('investmentSimulation');
    }
    if (pathname.startsWith('/chat-room')) {
      return 'Chat Room';
    }
    if (pathname.startsWith('/success-stories')) {
      return 'Success Stories';
    }
    if (pathname.startsWith('/profile')) {
      return 'Profile';
    }
    if (pathname.startsWith('/about')) {
      return 'About Project';
    }
    return t('dashboard');
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <AppSidebar />
      </Sidebar>
      <SidebarInset>
  <header className="flex h-14 items-center gap-4 border-b border-sidebar-border bg-sidebar text-sidebar-foreground p-4 lg:h-[60px] lg:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="w-full flex-1">
            <h1 className={cn("text-lg font-semibold md:text-2xl", "bg-gradient-to-r from-sidebar-accent-foreground to-sidebar-foreground/80 text-transparent bg-clip-text")}>{getTitle()}</h1>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 p-4 min-h-[calc(100vh-60px-48px)] overflow-auto bg-background">{children}</main>
        <footer className="h-12 border-t border-sidebar-border bg-sidebar text-sidebar-foreground flex items-center justify-center text-sm">
          © {new Date().getFullYear()} Investment Tracker
        </footer>
        <GlobalChatbot />
      </SidebarInset>
    </SidebarProvider>
  );
}
