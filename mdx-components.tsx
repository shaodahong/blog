import type { MDXComponents } from 'nextra/mdx-components'
import { useMDXComponents as getThemeComponents } from 'nextra-theme-blog'

import { Cusdis } from '@/components/cusdis'
import { TimelineList } from '@/components/ui/timeline-list'

type WrapperComponent = NonNullable<MDXComponents['wrapper']>

type WrapperProps = Parameters<WrapperComponent>[0]

type ThemeMDXComponents = ReturnType<typeof getThemeComponents> & {
  wrapper?: WrapperComponent
}

const themeComponents = getThemeComponents() as ThemeMDXComponents

function Wrapper(props: WrapperProps) {
  const ThemeWrapper = themeComponents.wrapper
  const children = (
    <>
      {props.children}
      {props.bottomContent}
    </>
  )

  if (!ThemeWrapper) {
    return children
  }

  return <ThemeWrapper {...props}>{children}</ThemeWrapper>
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
