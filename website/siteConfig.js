/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

// List of projects/orgs using your project for the users page.
const users = [
  {
    caption: 'Bartosz Szczeciński',
    // You will need to prepend the image path with your baseUrl
    // if it is not '/', like: '/test-site/img/docusaurus.svg'.
    image: '/avatars0.githubusercontent.com/u/247153?v=4',
    infoLink: 'https://szczecinski.eu',
    pinned: true,
  },
];

const siteConfig = {
  title: 'Szczecinski.eu', // Title for your website.
  tagline: 'Darmowe kursy ES6, React, Redux',
  url: 'https://szczecinski.eu', // Your website URL
  baseUrl: '/', // Base URL for your project */
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/test-site/',

  // Used for publishing and more
  projectName: 'szczecinski.eu',
  organizationName: 'szczecinski',
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    {doc: 'es6/01-const', label: 'Kurs ES6'},
    {doc: 'react/lekcja1/01-basic', label: 'Kurs React'},
    {doc: 'redux/intro/czym-jest-redux', label: 'Kurs Redux'},
    {
      href: 'https://medium.com/@baphemot',
      target: '_blank',
      label: 'Blog',
    },
    {
      href: 'mailto:baphemot@gmail.com',
      label: 'Kontakt'
    }
  ],

  // If you have users set above, you add it here:
  users,

  /* path to images for header/footer */
  headerIcon: '/avatars0.githubusercontent.com/u/247153?v=4',
  footerIcon: 'img/docusaurus.svg',
  favicon: 'img/favicon.png',

  /* Colors for website */
  colors: {
    primaryColor: '#0098db',
    secondaryColor: '#006088',
  },

  /* Custom fonts for website */
  /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Wszelkie prawa zastrzeżone © ${new Date().getFullYear()}`,

  usePrism: ['jsx'],
  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'default',
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: ['https://buttons.github.io/buttons.js'],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  ogImage: 'img/docusaurus.png',
  twitterImage: 'img/docusaurus.png',

  // Show documentation's last contributor's name.
  // enableUpdateBy: true,

  // Show documentation's last update time.
  // enableUpdateTime: true,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  //   repoUrl: 'https://github.com/facebook/test-site',
};

module.exports = siteConfig;
