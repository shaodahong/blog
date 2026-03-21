import type { Metadata } from 'next'
import { generateStaticParamsFor, importPage } from 'nextra/pages'

import { Cusdis } from '@/components/cusdis'
import { useMDXComponents as getMDXComponents } from '../../mdx-components'

type PageProps = {
  params: Promise<{
    mdxPath?: string[]
  }>
}

export const generateStaticParams = generateStaticParamsFor('mdxPath')

const Wrapper = getMDXComponents().wrapper

function getRoute(pathSegments?: string[]) {
  if (!pathSegments?.length) {
    return '/'
  }

  return `/${pathSegments.join('/')}`
}

function getPageMetadata(frontMatter: Record<string, unknown>, route: string): Metadata {
  const title = String(frontMatter.title || '别问')
  const realTitle = `${title} | 别问`
  const description = String(frontMatter.description || '别问')
  const keywords = frontMatter.tag || frontMatter.tags
  const image = `https://biewen.me/api/og?title=${encodeURIComponent(realTitle)}`

  return {
    title,
    description,
    keywords: Array.isArray(keywords) ? keywords : typeof keywords === 'string' ? keywords : undefined,
    authors:
      typeof frontMatter.author === 'string'
        ? [
            {
              name: frontMatter.author,
            },
          ]
        : undefined,
    openGraph: {
      title: realTitle,
      description,
      url: `https://biewen.me${route}`,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: realTitle,
      description,
      images: [image],
    },
  }
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params
  const { metadata } = await importPage(params.mdxPath ?? [])

  return getPageMetadata(metadata as Record<string, unknown>, getRoute(params.mdxPath))
}

export default async function Page(props: PageProps) {
  const params = await props.params
  const route = getRoute(params.mdxPath)
  const { default: MDXContent, toc, metadata, sourceCode } = await importPage(
    params.mdxPath ?? []
  )
  const content = <MDXContent {...props} params={params} />

  if (!Wrapper) {
    return content
  }

  return (
    <Wrapper
      toc={toc}
      metadata={metadata}
      sourceCode={sourceCode}
      bottomContent={route.startsWith('/posts/') ? <Cusdis /> : undefined}
    >
      {content}
    </Wrapper>
  )
}
