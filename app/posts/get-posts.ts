import { normalizePages } from 'nextra/normalize-pages'
import { getPageMap } from 'nextra/page-map'

type PostEntry = {
  name: string
  route: string
  frontMatter: {
    title?: string
    date?: string
    tag?: string
    tags?: string[]
    [key: string]: unknown
  }
}

type PageNode = {
  name: string
  route: string
  frontMatter?: PostEntry['frontMatter']
  children?: PageNode[]
}

function isPostEntry(node: PageNode): node is PostEntry {
  return (
    node.route !== '/posts' &&
    typeof node.frontMatter?.title === 'string'
  )
}

function collectPosts(nodes: PageNode[]): PostEntry[] {
  return nodes.flatMap(node => {
    const nestedPosts = Array.isArray(node.children) ? collectPosts(node.children) : []

    if (!isPostEntry(node)) {
      return nestedPosts
    }

    return [node, ...nestedPosts]
  })
}

export function getPostTags(post: PostEntry) {
  if (Array.isArray(post.frontMatter.tags)) {
    return post.frontMatter.tags
  }

  if (typeof post.frontMatter.tag === 'string') {
    return post.frontMatter.tag
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean)
  }

  return []
}

export async function getPosts() {
  const { directories } = normalizePages({
    list: await getPageMap('/posts'),
    route: '/posts',
  })

  return collectPosts(directories as PageNode[])
    .sort((a, b) => {
      return (
        new Date(b.frontMatter.date || 0).getTime() -
        new Date(a.frontMatter.date || 0).getTime()
      )
    })
}

export async function getTags() {
  const posts = await getPosts()
  return posts.flatMap(getPostTags)
}
