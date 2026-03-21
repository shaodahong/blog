'use client'

import { Comments } from 'nextra-theme-blog'

const CUSDIS_APP_ID = '24822426-2ff6-44f7-aaaa-42852d81f11b'

export function Cusdis() {
  return <Comments appId={CUSDIS_APP_ID} />
}
