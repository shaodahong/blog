import type { MDXComponents } from 'nextra/mdx-components'
import { useMDXComponents as getThemeComponents } from 'nextra-theme-blog'

import { BlogMeta } from '@/components/blog/meta'
import { Cusdis } from '@/components/cusdis'
import { TimelineList } from '@/components/ui/timeline-list'

type WrapperComponent = NonNullable<MDXComponents['wrapper']>

type WrapperProps = Parameters<WrapperComponent>[0]

type BlogWrapperMetadata = NonNullable<WrapperProps['metadata']> & {
  author?: string
  date?: string
  readingTime?: {
    text?: string
  }
  tag?: string
  tags?: string[]
  title: string
}

type ThemeMDXComponents = ReturnType<typeof getThemeComponents> & {
  wrapper?: WrapperComponent
}

const themeComponents = getThemeComponents() as ThemeMDXComponents

const DATE_RE = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?(:\d{2}\.\d{3}Z)?$/
const DATE_RE_WITH_SLASH = /^\d{4}\/\d{1,2}\/\d{1,2}( \d{1,2}:\d{1,2})?$/

function isValidDate(date: string) {
  return DATE_RE.test(date) || DATE_RE_WITH_SLASH.test(date)
}

function Wrapper(props: WrapperProps) {
  const metadata = props.metadata as BlogWrapperMetadata
  const date = metadata.date

  if (date && !isValidDate(date)) {
    throw new Error(
      `Invalid date "${date}". Provide date in "YYYY/M/D", "YYYY/M/D H:m", "YYYY-MM-DD", "[YYYY-MM-DD]T[HH:mm]" or "[YYYY-MM-DD]T[HH:mm:ss.SSS]Z" format.`
    )
  }

  const dateObj = date ? new Date(date) : undefined

  return (
    <>
      <h1>{metadata.title}</h1>
      <BlogMeta
        author={metadata.author}
        date={metadata.date}
        readingTime={metadata.readingTime}
        tag={metadata.tag}
        tags={metadata.tags}
      >
        {dateObj ? (
          <time dateTime={dateObj.toISOString()}>{dateObj.toLocaleDateString()}</time>
        ) : null}
      </BlogMeta>
      {props.children}
      {props.bottomContent}
    </>
  )
}

export function useMDXComponents(components: MDXComponents = {}): MDXComponents {
  return {
    ...themeComponents,
    TimelineList,
    Cusdis,
    wrapper: Wrapper,
    ...components,
  }
}
