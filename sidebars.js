// Docusaurus Sidebar Configuration
// This file defines the navigation structure for Mudipu documentation

module.exports = {
  docsSidebar: [
    {
      type: 'doc',
      id: 'index',
      label: 'Introduction',
    },
    {
      type: 'category',
      label: 'Core Concepts',
      collapsed: false,
      items: [
        'concepts/index',
        'concepts/session',
        'concepts/turn',
        'concepts/span',
        'concepts/trace',
        'concepts/tool-call',
        'concepts/event',
      ],
    },
    // Coming soon sections - uncomment as docs are created
    // {
    //   type: 'category',
    //   label: 'SDK Guide',
    //   collapsed: true,
    //   items: [
    //     'sdk/index',
    //     'sdk/quickstart',
    //     'sdk/installation',
    //   ],
    // },
    {
      type: 'link',
      label: 'Python SDK →',
      href: 'https://github.com/santnayak/mudipu-python',
    },
    {
      type: 'link',
      label: 'GitHub →',
      href: 'https://github.com/santnayak/mudipu',
    },
  ],
};
