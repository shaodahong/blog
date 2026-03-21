import nextra from 'nextra'

const withNextra = nextra({
  staticImage: true,
  defaultShowCopyCode: true,
  readingTime: true,
})

export default withNextra({
  reactStrictMode: true,
  turbopack: {
    resolveAlias: {
      'next-mdx-import-source-file': './mdx-components.tsx',
    },
  },
})
