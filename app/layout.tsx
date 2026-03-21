import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/react'
import { Footer, Layout, Navbar, ThemeSwitch } from 'nextra-theme-blog'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'

import 'styles/globals.css'

const SITE_URL = 'https://biewen.me'
const SITE_NAME = '别问'
const YEAR = new Date().getFullYear()

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_NAME,
  icons: {
    icon: '/favicon.ico',
  },
  alternates: {
    types: {
      'application/rss+xml': [
        {
          url: '/feed.xml',
          title: 'RSS',
        },
      ],
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pageMap = await getPageMap()

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <Head backgroundColor={{ dark: '#0f172a', light: '#ffffff' }} />
      <body>
        <Layout>
          <Navbar pageMap={pageMap}>
            <ThemeSwitch />
          </Navbar>
          {children}
          <Footer>
            <abbr
              title="This site and all its content are licensed under a Creative Commons Attribution-NonCommercial 4.0 International License."
              style={{ cursor: 'help' }}
            >
              CC BY-NC 4.0
            </abbr>{' '}
            <time>{YEAR}</time> © Shaodahong.
            <a href="/feed.xml" style={{ float: 'right' }}>
              RSS
            </a>
          </Footer>
        </Layout>
        <Analytics />
        <Script
          async
          src="https://analytics.umami.is/script.js"
          data-website-id="6204fa0a-7412-4773-a5c9-d0c16a9bf287"
          strategy="beforeInteractive"
        />
        <Script
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "l6a7sjxyan");`,
          }}
        />
      </body>
    </html>
  )
}
