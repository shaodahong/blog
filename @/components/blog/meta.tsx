import type { ReactNode } from 'react'
import Link from 'next/link'

import { BackButton } from '@/components/blog/back-button'

type ReadingTime = {
  text?: string
}

type BlogMetaProps = {
  author?: string
  children?: ReactNode
  date?: string
  readingTime?: ReadingTime
  tag?: string
  tags?: string[]
}

function normalizeTags(tag?: string, tags?: string[]) {
  if (Array.isArray(tags)) {
    return tags
  }

  if (typeof tag === 'string') {
    return tag
      .split(',')
      .map(item => item.trim())
      .filter(Boolean)
  }

  return []
}

export function BlogMeta(props: BlogMetaProps) {
  const { author, children, readingTime, tag, tags } = props
  const tagList = normalizeTags(tag, tags)
  const tagElements = tagList.map(item => (
    <Link key={item} href={`/tags/${encodeURIComponent(item)}`} className="nextra-tag">
      {item}
    </Link>
  ))
  const readingTimeText = readingTime?.text

  return (
    <div
      className={`x:mb-8 x:flex x:gap-3 ${readingTimeText ? 'x:items-start' : 'x:items-center'}`}
    >
      <div className="x:grow x:dark:text-gray-400 x:text-gray-600">
        <div className="x:flex x:flex-wrap x:items-center x:gap-1">
          {author}
          {author && children ? ',' : null}
          {children}
          {(author || children) && (readingTime || tagList.length) ? (
            <span className="x:px-1">&bull;</span>
          ) : null}
          {readingTimeText || tagElements}
        </div>
        {readingTime ? (
          <div className="x:mt-1 x:flex x:flex-wrap x:items-center x:gap-1">
            {tagElements}
          </div>
        ) : null}
      </div>
      <BackButton />
    </div>
  )
}
