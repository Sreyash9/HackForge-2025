"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useTranslations } from "@/hooks/useTranslations"

export function AuthButtons() {
  const { t } = useTranslations()

  return (
    <div className="flex items-center gap-2">
      <Link href="/auth/login">
        <Button variant="ghost" size="sm">
          {t.login}
        </Button>
      </Link>
      <Link href="/auth/signup">
        <Button size="sm">{t.signup}</Button>
      </Link>
    </div>
  )
}
