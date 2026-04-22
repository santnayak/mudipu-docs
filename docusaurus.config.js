// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer').themes.github;
const darkCodeTheme = require('prism-react-renderer').themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Mudipu Documentation',
  tagline: 'AI Agent Observability & Registry Platform',
  favicon: 'img/favicon.svg',

  // Set the production url of your site here
  url: 'https://docs.mudipu.dev',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 'santnayak',
  projectName: 'mudipu-docs',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/', // Serve docs at the root
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/santnayak/mudipu/tree/main/mudipu-docs/',
        },
        blog: false, // Disable blog
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/mudipu-social-card.jpg',
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: 'mudipu',
        logo: {
          alt: 'Mudipu Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'http://localhost:3000/app',
            label: 'Platform',
            position: 'right',
          },
          {
            href: 'http://localhost:3000/hub',
            label: 'Hub',
            position: 'right',
          },
          {
            href: 'https://github.com/santnayak/mudipu',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Product',
            items: [
              {
                label: 'Platform',
                href: 'http://localhost:3000/app',
              },
              {
                label: 'Agent Hub',
                href: 'http://localhost:3000/hub',
              },
              {
                label: 'Documentation',
                to: '/',
              },
            ],
          },
          {
            title: 'Resources',
            items: [
              {
                label: 'Python SDK',
                href: 'https://github.com/santnayak/mudipu-python',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/santnayak/mudipu',
              },
              {
                label: 'Issues',
                href: 'https://github.com/santnayak/mudipu/issues',
              },
            ],
          },
          {
            title: 'Legal',
            items: [
              {
                label: 'Imprint',
                href: 'http://localhost:3001/imprint',
              },
              {
                label: 'Privacy Policy',
                href: 'http://localhost:3001/privacy',
              },
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} Mudipu. Open source under MIT License.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['python', 'bash', 'json', 'yaml'],
      },
    }),
};

module.exports = config;
