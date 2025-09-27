"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const AuthForm = dynamic(
  () =>
    import("@/components/auth/auth-form").then((mod) => mod.AuthForm),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[550px] w-full max-w-md rounded-2xl" />,
  }
);

export function AuthLoader() {
    return <AuthForm />;
}
