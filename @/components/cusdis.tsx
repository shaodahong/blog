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
    let contentObserver: MutationObserver | null = null
    let resizeObserver: ResizeObserver | null = null
    let detachIframeLoad: (() => void) | null = null
    let heightSyncTimers: number[] = []

    const cleanupEmbeddedObservers = () => {
      detachIframeLoad?.()
      detachIframeLoad = null
      contentObserver?.disconnect()
      contentObserver = null
      resizeObserver?.disconnect()
      resizeObserver = null
      heightSyncTimers.forEach((timer) => window.clearTimeout(timer))
      heightSyncTimers = []
    }

    const syncIframeHeight = (iframe: HTMLIFrameElement) => {
      const doc = iframe.contentDocument

      if (!doc) {
        return
      }

      const nextHeight = Math.max(
        doc.documentElement?.scrollHeight ?? 0,
        doc.body?.scrollHeight ?? 0,
        doc.documentElement?.offsetHeight ?? 0,
        doc.body?.offsetHeight ?? 0
      )

      if (nextHeight > 0) {
        iframe.style.height = `${nextHeight}px`
        setHasMeasuredHeight(true)
      }
    }

    const watchEmbeddedContent = (iframe: HTMLIFrameElement) => {
      cleanupEmbeddedObservers()

      const attachContentObservers = () => {
        const doc = iframe.contentDocument

        if (!doc) {
          return
        }

        syncIframeHeight(iframe)

        const target = doc.body ?? doc.documentElement

        if (!target) {
          return
        }

        contentObserver = new MutationObserver(() => syncIframeHeight(iframe))
        contentObserver.observe(target, {
          attributes: true,
          characterData: true,
          childList: true,
          subtree: true,
        })

        if (typeof ResizeObserver !== 'undefined') {
          resizeObserver = new ResizeObserver(() => syncIframeHeight(iframe))
          resizeObserver.observe(target)
        }
      }

      const onLoad = () => attachContentObservers()

      iframe.addEventListener('load', onLoad)
      detachIframeLoad = () => iframe.removeEventListener('load', onLoad)

      attachContentObservers()
      heightSyncTimers = [
        window.setTimeout(() => syncIframeHeight(iframe), 300),
        window.setTimeout(() => syncIframeHeight(iframe), 1000),
      ]
    }

    const watchIframeHeight = () => {
      cleanupEmbeddedObservers()

      const iframe = thread.querySelector<HTMLIFrameElement>('iframe')

      if (!iframe) {
        return
      }

      watchEmbeddedContent(iframe)
    }

    watchIframeHeight()

    iframeObserver = new MutationObserver(watchIframeHeight)
    iframeObserver.observe(thread, {
      childList: true,
    })

    return () => {
      cleanupEmbeddedObservers()
      iframeObserver?.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!scriptLoaded) {
      return
    }

    if (!bootstrappedRef.current) {
      bootstrappedRef.current = true
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
