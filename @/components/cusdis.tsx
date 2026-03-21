'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'

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
  const [hasMeasuredHeight, setHasMeasuredHeight] = useState(false)
  const [pageTheme, setPageTheme] = useState<'light' | 'dark'>('light')
  const bootstrappedRef = useRef(false)
  const threadRef = useRef<HTMLDivElement>(null)
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
    const thread = threadRef.current

    if (!thread) {
      return
    }

    let iframeObserver: MutationObserver | null = null
    let styleObserver: MutationObserver | null = null

    const cleanupIframeObserver = () => {
      styleObserver?.disconnect()
      styleObserver = null
    }

    const attachIframeObserver = () => {
      cleanupIframeObserver()

      const iframe = thread.querySelector<HTMLIFrameElement>('iframe')

      if (!iframe) {
        return
      }

      const syncMeasuredHeight = () => {
        const height = Number.parseFloat(iframe.style.height || '0')

        if (height > 0) {
          setHasMeasuredHeight(true)
        }
      }

      syncMeasuredHeight()

      styleObserver = new MutationObserver(syncMeasuredHeight)
      styleObserver.observe(iframe, {
        attributeFilter: ['style'],
        attributes: true,
      })
    }

    attachIframeObserver()

    iframeObserver = new MutationObserver(attachIframeObserver)
    iframeObserver.observe(thread, {
      childList: true,
    })

    return () => {
      cleanupIframeObserver()
      iframeObserver?.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!scriptLoaded) {
      return
    }

    if (!bootstrappedRef.current) {
      bootstrappedRef.current = true
      window.CUSDIS?.initial?.()
      return
    }

    setHasMeasuredHeight(false)
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
        ref={threadRef}
        id="cusdis_thread"
        style={hasMeasuredHeight ? undefined : { height: 0, overflow: 'hidden' }}
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
        onReady={() => {
          setScriptLoaded(true)
          setHasMeasuredHeight(false)
        }}
      />
    </div>
  )
}
