import Cusdis from 'nextra-theme-blog/cusdis'

const YEAR = new Date().getFullYear()

export default {
  cusdis: {
    appId: '24822426-2ff6-44f7-aaaa-42852d81f11b',
  },
  comments: <Cusdis />,
  darkMode: true,
  head: ({ title, meta }) => {
    const realTitle = `${title} - 别问`
    const description = meta.description || '别问'
    return (
      <>
        <title>{realTitle}</title>
        <meta name="description" content={meta.description} />
        {meta.tag && <meta name="keywords" content={meta.tag} />}
        {meta.author && <meta name="author" content={meta.author} />}
        <meta property="twitter:image" content="/logo.png"></meta>
        <meta property="twitter:card" content="summary_large_image"></meta>
        <meta property="twitter:title" content={realTitle}></meta>
        <meta property="twitter:description" content={description}></meta>
        <meta property="og:image" content="/logo.png"></meta>
        <meta property="og:title" content={realTitle}></meta>
        <meta property="og:description" content={description} />
        <meta property="og:url" content="https://biewen.me/"></meta>
      </>
    )
  },
  footer: (
    <small style={{ display: 'block', marginTop: '8rem' }}>
      <abbr
        title="This site and all its content are licensed under a Creative Commons Attribution-NonCommercial 4.0 International License."
        style={{ cursor: 'help' }}
      >
        CC BY-NC 4.0
      </abbr>
      <time> {YEAR}</time> © Shaodahong.
      <a href="/feed.xml">RSS</a>
      <style jsx>{`
        a {
          float: right;
        }
        @media screen and (max-width: 480px) {
          article {
            padding-top: 2rem;
            padding-bottom: 4rem;
          }
        }
      `}</style>
    </small>
  ),
}
