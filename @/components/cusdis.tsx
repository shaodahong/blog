'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

const CUSDIS_APP_ID = '24822426-2ff6-44f7-aaaa-42852d81f11b'
const CUSDIS_HOST = 'https://cusdis.com'
const SITE_URL = 'https://biewen.me'

declare global {
  interface Window {
    CUSDIS?: {
      initial?: () => void
      setTheme?: (theme?: string) => void
    }
  }
}

export function Cusdis() {
  const pathname = usePathname()
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [pageTheme, setPageTheme] = useState<'light' | 'dark'>('light')
  const pageId = pathname ?? '/'
  const pageUrl = useMemo(() => `${SITE_URL}${pageId}`, [pageId])

  useEffect(() => {
    const root = document.documentElement
    const updateTheme = () => {
      setPageTheme(root.classList.contains('dark') ? 'dark' : 'light')
    }

    updateTheme()

    const observer = new MutationObserver(updateTheme)
    observer.observe(root, {
      attributeFilter: ['class'],
      attributes: true,
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!scriptLoaded) {
      return
    }

    window.CUSDIS?.initial?.()
  }, [pageId, scriptLoaded])

  useEffect(() => {
    if (!scriptLoaded) {
      return
    }

    window.CUSDIS?.setTheme?.(pageTheme)
  }, [pageTheme, scriptLoaded])

  return (
    <div style={{ marginTop: '4rem' }}>
      <div
        id="cusdis_thread"
        style={{ minHeight: '160px' }}
        data-host={CUSDIS_HOST}
        data-app-id={CUSDIS_APP_ID}
        data-page-id={pageId}
        data-page-url={pageUrl}
        data-page-title={typeof document === 'undefined' ? '' : document.title}
        data-theme={pageTheme}
      />
      <Script
        async
        src={`${CUSDIS_HOST}/js/cusdis.es.js`}
        strategy="lazyOnload"
        onReady={() => setScriptLoaded(true)}
      />
    </div>
  )
}
