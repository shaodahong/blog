import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-blog',
  themeConfig: './theme.config.mjs',
  staticImage: true,
  defaultShowCopyCode: true,
  readingTime: true,
  
})

export default withNextra({
  reactStrictMode: true,
})
