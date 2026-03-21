import Link from 'next/link'

type PostCardProps = {
  post: {
    route: string
    frontMatter: {
      date?: string
      description?: string
      title?: string
    }
  }
  readMore?: string
}

export function PostCard({ post, readMore = 'Read More →' }: PostCardProps) {
  const { description, date, title } = post.frontMatter
  const dateObj = date ? new Date(date) : undefined

  return (
    <div key={post.route}>
      <h2 className="x:mt-6 x:mb-2 x:text-xl x:font-semibold">
        <Link href={post.route} className="x:no-underline!">
          {title}
        </Link>
      </h2>
      {description ? (
        <p className="x:mb-2 x:dark:text-gray-400 x:text-gray-600">
          {description}
          {readMore ? (
            <Link href={post.route} className="x:ml-2">
              {readMore}
            </Link>
          ) : null}
        </p>
      ) : null}
      {dateObj ? (
        <time
          className="x:text-sm x:dark:text-gray-400 x:text-gray-600"
          dateTime={dateObj.toISOString()}
        >
          {dateObj.toDateString()}
        </time>
      ) : null}
    </div>
  )
}
