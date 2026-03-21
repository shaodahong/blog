import { PostCard } from '@/components/blog/post-card'
import { getPosts, getPostTags, getTags } from '../../posts/get-posts'

type TagPageProps = {
  params: Promise<{
    tag: string
  }>
}

export async function generateMetadata(props: TagPageProps) {
  const params = await props.params

  return {
    title: `Posts Tagged with “${decodeURIComponent(params.tag)}”`,
  }
}

export async function generateStaticParams() {
  const allTags = await getTags()

  return Array.from(new Set(allTags)).map(tag => ({ tag }))
}

export default async function TagPage(props: TagPageProps) {
  const params = await props.params
  const posts = await getPosts()
  const title = `Posts Tagged with “${decodeURIComponent(params.tag)}”`

  return (
    <>
      <h1>{title}</h1>
      {posts
        .filter(post =>
          getPostTags(post).includes(decodeURIComponent(params.tag))
        )
        .map(post => (
          <PostCard key={post.route} post={post} />
        ))}
    </>
  )
}
