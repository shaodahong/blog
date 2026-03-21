'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Button } from 'nextra/components'

export function BackButton() {
  const router = useRouter()
  const pathname = usePathname()
  const isNestedPage = (pathname ?? '/').split('/').length > 2

  if (!isNestedPage) {
    return null
  }

  return (
    <Button onClick={() => router.back()} className="x:print:hidden x:underline">
      Back
    </Button>
  )
}
