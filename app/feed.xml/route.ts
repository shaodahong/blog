import { getPosts, getPostTags } from '../posts/get-posts'

const SITE_URL = 'https://biewen.me'

export async function GET() {
  const posts = await getPosts()
  const items = posts
    .map(post => {
      const title = String(post.frontMatter.title || '')
      const description = String(post.frontMatter.description || '')
      const url = `${SITE_URL}${post.route}`
      const categories = getPostTags(post)
        .map(tag => `            <category><![CDATA[${tag}]]></category>`)
        .join('\n')

      return `        <item>
            <title><![CDATA[${title}]]></title>
            <description><![CDATA[${description}]]></description>
            <link>${url}</link>
            <guid isPermaLink="true">${url}</guid>
${categories ? `${categories}\n` : ''}            <pubDate>${new Date(
        String(post.frontMatter.date || '')
      ).toUTCString()}</pubDate>
        </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
    <channel>
        <title><![CDATA[Bie Wen]]></title>
        <description><![CDATA[Bie Wen]]></description>
        <link>${SITE_URL}</link>
        <generator>Nextra</generator>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
    </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  })
}
