export const siteUrl = 'https://ashmo.io';
export const personId = `${siteUrl}/#person`;
export const websiteId = `${siteUrl}/#website`;

export const socialProfiles = [
  'https://www.linkedin.com/in/iamashmo/',
  'https://www.instagram.com/iam_ashmo/',
  'https://www.youtube.com/@iamashmo',
  'https://www.facebook.com/iamashmo',
];

export const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': personId,
  name: 'Ashraf Hassan',
  alternateName: ['Ashmo', 'Ashmo.io'],
  url: siteUrl,
  image: `${siteUrl}/images/ashmo-portrait.webp`,
  description:
    'Founder, brand builder, and writer with 25+ years of experience in retail, brand scaling, and marketing.',
  email: 'mailto:ashmoindia@gmail.com',
  jobTitle: 'Head of Brand & Growth',
  worksFor: {
    '@type': 'Organization',
    name: 'FiLLi Cafe',
  },
  knowsAbout: [
    'Brand Strategy',
    'Brand Positioning',
    'Cafe Growth',
    'Retail Operations',
    'Marketing',
    'AI in Business',
    'Pricing Psychology',
  ],
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
    'Notes on brand building, merchant thinking, and the discipline of showing up.',
  publisher: {
    '@id': personId,
  },
  author: {
    '@id': personId,
  },
};
