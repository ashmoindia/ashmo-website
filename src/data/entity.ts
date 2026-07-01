export const siteUrl = 'https://ashmo.io';
export const personId = `${siteUrl}/#person`;
export const websiteId = `${siteUrl}/#website`;
export const organizationId = `${siteUrl}/#organization`;

export const socialProfiles = [
  'https://www.linkedin.com/in/iamashmo/',
  'https://www.instagram.com/iam_ashmo/',
  'https://www.youtube.com/@iamashmo',
  'https://www.facebook.com/iamashmo/',
];

export const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': personId,
  name: 'Ashraf Hassan',
  alternateName: ['Ashmo', 'Ashmo.io', 'iamashmo'],
  url: siteUrl,
  mainEntityOfPage: `${siteUrl}/ashraf-hassan/`,
  image: `${siteUrl}/images/ashmo-portrait.webp`,
  description:
    'Commercial strategist, brand builder, and writer focused on F&B growth, AI-age marketing systems, market intelligence, and practical business judgment.',
  email: 'mailto:ashmoindia@gmail.com',
  jobTitle: 'Head of Brand & Growth',
  worksFor: {
    '@type': 'Organization',
    name: 'FiLLi Cafe',
    url: 'https://fillicafe.com',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Dubai',
    addressCountry: 'AE',
  },
  knowsAbout: [
    'Brand Strategy',
    'Brand Positioning',
    'Cafe Growth',
    'Restaurant Growth Systems',
    'Restaurant Marketing',
    'F&B Operations',
    'Retail Operations',
    'Franchise Scaling',
    'Delivery Strategy',
    'CRM and Retention',
    'AI in Business',
    'AI-assisted Marketing',
    'Pricing Psychology',
    'GCC F&B Markets',
  ],
  knowsLanguage: ['en', 'ar', 'hi', 'ml'],
  sameAs: socialProfiles,
};

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': organizationId,
  name: 'Ashmo',
  alternateName: ['Ashmo.io', 'Ashraf Hassan'],
  url: siteUrl,
  logo: {
    '@type': 'ImageObject',
    url: `${siteUrl}/images/logo-emblem-white.svg`,
  },
  founder: { '@id': personId },
  description:
    'Commercial intelligence platform by Ashraf Hassan covering brand systems, F&B growth, AI-age marketing workflows, and GCC market signals.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Dubai',
    addressCountry: 'AE',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'general inquiries',
    email: 'ashmoindia@gmail.com',
    areaServed: ['AE', 'SA', 'KW', 'QA', 'BH', 'OM'],
    availableLanguage: ['English', 'Arabic'],
  },
  sameAs: socialProfiles,
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': websiteId,
  url: siteUrl,
  name: 'Ashmo',
  alternateName: 'Ashmo.io',
  description:
    'Commercial intelligence, market intelligence, growth systems, and practical frameworks for founders, marketers, restaurant leaders, and brand builders.',
  publisher: { '@id': organizationId },
  author: { '@id': personId },
  inLanguage: 'en',
};
