import * as React from 'react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card'
import { Timeline } from '@icon-park/react'
import { Badge } from './badge'

export const TimelineList: React.FC<{
  contents: { date: string; content: string }[]
  children?: React.ReactNode
  tag?: React.ReactNode
}> = ({ contents, tag }) => {
  if (!contents?.length) {
    return null
  }

  const [firstItem, ...restItems] = contents || []
  return (
    <HoverCard openDelay={300}>
      {contents?.length > 1 ? (
        <HoverCardTrigger asChild>
          <span className="inline-flex align-middle mt-0 p-2 mr-1 rounded-sm cursor-pointer hover:bg-slate-300 transition-colors">
            <Timeline
              theme="multi-color"
              fill={['#333', '#2F88FF', '#FFF', '#43CCF8']}
            />
          </span>
        </HoverCardTrigger>
      ) : null}
      {!!firstItem.date && (
        <Badge className="mr-2 mb-0">{firstItem.date}</Badge>
      )}
      {!!tag && `【${tag}】`}
      {firstItem.content}
      <HoverCardContent align="start" className="w-auto max-w-prose dark:bg-neutral-900 dark:text-slate-200">
        {!!tag && <h4 className="mt-0">{tag}</h4>}
        <ul>
          {restItems?.map((item, index) => (
            <li key={index}>
              {!!item.date && <Badge className="mr-2">{item.date}</Badge>}
              {item.content}
            </li>
          ))}
        </ul>
      </HoverCardContent>
    </HoverCard>
  )
}
