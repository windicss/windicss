// @ts-check

const isProd = process.env.NODE_ENV === 'production'

const title = 'Windi CSS 🌬'
const description = 'Next generation Tailwind CSS compiler.'
const site = isProd ? 'https://windicss.github.io' : 'http://localhost:3000'
const image = `${site}/banner.png`

const head = [
  ['style', {}, 'img { border-radius: 10px }' + 'h1.title { margin-left: 0.5em }'],
  ['meta', { name: 'author', content: 'Windi CSS Team' }],
  ['meta', { name: 'keywords', content: 'windi, tailwind, tailwindcss, vitejs, svelte, vue' }],

  ['link', { rel: 'icon', type: 'image/svg+xml', href: '/assets/logo.svg' }],

  ['meta', { name: 'HandheldFriendly', content: 'True' }],
  ['meta', { name: 'MobileOptimized', content: '320' }],
  ['meta', { name: 'theme-color', content: '#cc0000' }],

  ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ['meta', { name: 'twitter:site', content: site }],
  ['meta', { name: 'twitter:title', value: title }],
  ['meta', { name: 'twitter:description', value: description }],
  ['meta', { name: 'twitter:image', content: image }],

  ['meta', { property: 'og:type', content: 'website' }],
  ['meta', { property: 'og:locale', content: 'en_US' }],
  ['meta', { property: 'og:site', content: site }],
  ['meta', { property: 'og:site_name', content: title }],
  ['meta', { property: 'og:title', content: title }],
  ['meta', { property: 'og:image', content: image }],
  ['meta', { property: 'og:description', content: description }],
]

/**
 * @type {import('vitepress').UserConfig}
 */
module.exports = {
  title: 'Windi CSS',
  description,
  head,
  themeConfig: {
    repo: 'windicss/windicss',
    logo: '/assets/logo.svg',
    docsDir: 'docs',
    docsBranch: 'main',
    editLinks: true,
    editLinkText: 'Suggest changes to this page',

    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Config', link: '/config/' },
      {
        text: 'Changelog',
        link: 'https://github.com/windicss/windicss/blob/main/CHANGELOG.md',
      },
    ],

    sidebar: {
      '/config/': 'auto',
      // catch-all fallback
      '/': [
        {
          text: 'Guide',
          children: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Getting Started', link: '/guide/' },
            { text: 'Migration', link: '/guide/migration' },
          ],
        },
      ],
    },
  },
}
