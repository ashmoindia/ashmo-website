export type SourceClassification = 'approved_reuse' | 'citation_only' | 'internal_only' | 'blocked';
export type SourceType =
  | 'Official open data'
  | 'National statistics agency'
  | 'Tourism authority'
  | 'Institutional dataset'
  | 'Regional statistical portal'
  | 'Commercial publisher';

export interface SourceRecord {
  id: string;
  name: string;
  url: string;
  sourceType: SourceType;
  trustLevel: 'High' | 'Medium';
  reuseClassification: SourceClassification;
  updateFrequency: string;
  coverage: string;
  usefulness: string;
  backlinksRequired: boolean;
  usageRule: string;
  attribution: string;
  governanceNote: string;
}

export interface IntelligenceFact {
  id: string;
  label: string;
  displayValue: string;
  rawValue?: number;
  geography: string;
  coveragePeriod: string;
  sourceId: string;
  sourcePublished: string;
  sourceUpdated?: string;
  attribution: string;
  note: string;
  kind: 'approved_data' | 'citation_signal';
  chartable?: boolean;
}

export interface ComparisonItem {
  label: string;
  value: number;
  displayValue: string;
  accent?: 'gold' | 'slate';
}

export interface ComparisonGroup {
  label: string;
  sourceId: string;
  sourcePublished: string;
  items: ComparisonItem[];
}

export interface ComparisonCard {
  id: string;
  title: string;
  description: string;
  groups: ComparisonGroup[];
  footer: string;
}

export interface IntelligenceCountry {
  slug: string;
  name: string;
  shortName: string;
  eyebrow: string;
  title: string;
  summary: string;
  metaTitle: string;
  metaDescription: string;
  coverageNote: string;
  macroFacts: string[];
  signalFacts: string[];
  comparisonId: string;
  whatOwnersShouldWatch: string[];
  whatThisMeansFor: {
    cafes: string[];
    cloudKitchens: string[];
    multiUnitOperators: string[];
  };
  caution: string[];
  relatedReportSlugs: string[];
}

export interface IntelligenceTopic {
  slug: string;
  name: string;
  eyebrow: string;
  title: string;
  summary: string;
  metaTitle: string;
  metaDescription: string;
  safeDataStrategy: string;
  proxyFacts: string[];
  signalFacts: string[];
  comparisonId?: string;
  operatorActions: string[];
  caution: string[];
  relatedReportSlugs: string[];
}

export interface IntelligenceReport {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  metaTitle: string;
  metaDescription: string;
  geography: string;
  accessModel: 'approved_reuse' | 'mixed_source';
  updated: string;
  filters: {
    country: string[];
    topic: string[];
  };
  featuredFacts: string[];
  comparisonId?: string;
  executiveSummary: string[];
  operatorTakeaways: string[];
  sections: {
    title: string;
    body: string;
    bullets: string[];
  }[];
  limitations: string[];
  sourceIds: string[];
  relatedReportSlugs: string[];
}

export interface LaunchModule {
  title: string;
  description: string;
  slug?: string;
  status: 'Live' | 'Ready next' | 'Research first';
  sourceStrategy: string;
}

export const intelligenceBasePath = '/intelligence';

export const intelligenceSources: SourceRecord[] = [
  {
    id: 'world-bank-data',
    name: 'World Bank Data',
    url: 'https://data.worldbank.org/',
    sourceType: 'Institutional dataset',
    trustLevel: 'High',
    reuseClassification: 'approved_reuse',
    updateFrequency: 'Rolling by indicator',
    coverage: 'Global, UAE, Saudi Arabia, GCC context',
    usefulness: 'Macro demand, inflation, digital adoption, FDI, population context',
    backlinksRequired: true,
    usageRule:
      'Raw data and original charts are allowed with attribution, but indicator metadata must be checked for third-party restrictions.',
    attribution:
      'Source: The World Bank, World Development Indicators (CC BY 4.0 unless indicator metadata states otherwise).',
    governanceNote:
      'Primary engine for reusable comparison charts. Never use World Bank logos or imply endorsement.',
  },
  {
    id: 'uae-open-data-policy',
    name: 'UAE Open Government Data',
    url: 'https://u.ae/en/about-the-uae/digital-uae/data/Open-government-data',
    sourceType: 'Official open data',
    trustLevel: 'High',
    reuseClassification: 'approved_reuse',
    updateFrequency: 'Policy / portal updates',
    coverage: 'United Arab Emirates',
    usefulness: 'Governance foundation for approved UAE open-data reuse',
    backlinksRequired: true,
    usageRule: 'Use as policy-level support for open-data reuse assumptions and attribution design.',
    attribution: 'Source: The Official Platform of the UAE Government.',
    governanceNote:
      'Use this page as a governance reference, then validate the license on each underlying dataset before publishing charts.',
  },
  {
    id: 'fcsc-open-data-cpi',
    name: 'FCSC Open Data — Consumer Price Index (CPI)',
    url: 'https://opendata.fcsc.gov.ae/%40federal-competitiveness-and-statistics-center/consumer-price-index',
    sourceType: 'Official open data',
    trustLevel: 'High',
    reuseClassification: 'approved_reuse',
    updateFrequency: 'Monthly / quarterly dataset updates',
    coverage: 'United Arab Emirates',
    usefulness: 'Inflation and price-pressure framing for operator margin watch',
    backlinksRequired: true,
    usageRule: 'CC BY 4.0 dataset. Use only original visualizations and preserve attribution.',
    attribution: 'Source: Federal Competitiveness and Statistics Centre open data portal (CC BY 4.0).',
    governanceNote:
      'Approved for future direct charting once the dataset rows are wired into the site build or CMS pipeline.',
  },
  {
    id: 'dubai-det-gastronomy-2024',
    name: 'Dubai DET Gastronomy Industry Report 2024',
    url: 'https://www.dubaidet.gov.ae/en/research-and-insights/gastronomy-industry-report-december-2024',
    sourceType: 'Tourism authority',
    trustLevel: 'High',
    reuseClassification: 'citation_only',
    updateFrequency: 'Annual report',
    coverage: 'Dubai, UAE',
    usefulness: 'Dining demand, category trends, consumer behavior, operator signals',
    backlinksRequired: true,
    usageRule:
      'Use as linked and attributed source material. Summarize findings, but do not reproduce DET charts, layouts, or report pages.',
    attribution: 'Source: Dubai Department of Economy and Tourism (DET), Gastronomy Industry Report 2024.',
    governanceNote:
      'Safe for descriptive summary and operator commentary. Avoid raw-data ingestion until dataset licensing is confirmed separately.',
  },
  {
    id: 'dubai-det-tourism-2024',
    name: 'Dubai DET Tourism Performance Report 2024',
    url: 'https://www.dubaidet.gov.ae/en/research-and-insights/tourism-performance-report-december-2024',
    sourceType: 'Tourism authority',
    trustLevel: 'High',
    reuseClassification: 'citation_only',
    updateFrequency: 'Periodic tourism report',
    coverage: 'Dubai, UAE',
    usefulness: 'Tourism-linked demand signals, hospitality pressure, city-level context',
    backlinksRequired: true,
    usageRule:
      'Use for summary insight and outbound citation. Do not mirror report PDFs, charts, or branded visuals.',
    attribution: 'Source: Dubai Department of Economy and Tourism (DET), Tourism Performance Report 2024.',
    governanceNote:
      'Use as a demand narrative layer beside approved-reuse datasets rather than as the raw chart engine.',
  },
  {
    id: 'gastat-tourism-q1-2025',
    name: 'GASTAT Tourism Establishments Statistics — Q1 2025',
    url: 'https://www.stats.gov.sa/documents/d/guest/tourism-establishments-statistics-q1-of-2025-en-pdf',
    sourceType: 'National statistics agency',
    trustLevel: 'High',
    reuseClassification: 'citation_only',
    updateFrequency: 'Quarterly release',
    coverage: 'Saudi Arabia',
    usefulness: 'Hospitality capacity, employment, occupancy, tourism-linked operating context',
    backlinksRequired: true,
    usageRule:
      'Use as official statistical reference for descriptive summary. Rebuild only if reuse terms are independently confirmed.',
    attribution: 'Source: General Authority for Statistics (GASTAT), Tourism Establishments Statistics Q1 2025.',
    governanceNote:
      'Important official source, but treated as citation-only in this starter build because no dataset license is exposed in the release itself.',
  },
  {
    id: 'saudi-national-data-bank',
    name: 'Saudi National Data Bank / Open Data Platform',
    url: 'https://data.gov.sa/en',
    sourceType: 'Official open data',
    trustLevel: 'High',
    reuseClassification: 'citation_only',
    updateFrequency: 'Platform-level',
    coverage: 'Saudi Arabia',
    usefulness: 'Future approved data pipeline for Saudi official open datasets',
    backlinksRequired: true,
    usageRule:
      'Use platform references now; promote a dataset to approved_reuse only after its dataset-level license is confirmed inside the source record.',
    attribution: 'Source: Saudi National Data Bank / Open Data Platform.',
    governanceNote:
      'The public platform terms were accessible, but the referenced open-data license file was not reliably retrievable in this environment, so this build keeps Saudi datasets in review mode by default.',
  },
  {
    id: 'gcc-stat-tourism',
    name: 'GCC-Stat Tourism Data Portal',
    url: 'https://www.marsa.gccstat.org/dataset/tourism',
    sourceType: 'Regional statistical portal',
    trustLevel: 'High',
    reuseClassification: 'citation_only',
    updateFrequency: 'Annual / dataset updates',
    coverage: 'GCC regional',
    usefulness: 'Regional tourism and hotel context across GCC countries',
    backlinksRequired: true,
    usageRule:
      'Public access is available, but the portal lists the tourism dataset license as not specified. Treat as citation-only until clarified.',
    attribution: 'Source: GCC Statistical Center (GCC-Stat) Tourism Data Portal.',
    governanceNote:
      'Useful for launch planning and editorial triangulation, but not yet the raw chart engine.',
  },
  {
    id: 'commercial-market-data',
    name: 'Commercial F&B Market-Share Publishers',
    url: 'https://www.statista.com/',
    sourceType: 'Commercial publisher',
    trustLevel: 'Medium',
    reuseClassification: 'blocked',
    updateFrequency: 'Varies',
    coverage: 'Regional and global',
    usefulness: 'Potential context only if licensed',
    backlinksRequired: false,
    usageRule: 'Blocked by default unless the site owner has explicit reuse rights.',
    attribution: 'Third-party rights holder attribution required if ever licensed.',
    governanceNote:
      'Do not ingest, chart, screenshot, or summarize paywalled visuals as if they were open data.',
  },
];

export const intelligenceFacts: IntelligenceFact[] = [
  {
    id: 'uae-population-2024',
    label: 'Population',
    displayValue: '10.99M',
    rawValue: 10.9864,
    geography: 'United Arab Emirates',
    coveragePeriod: '2024',
    sourceId: 'world-bank-data',
    sourcePublished: '2024',
    attribution: 'Source: World Bank country profile for the United Arab Emirates.',
    note: 'Useful as a base-demand and labor-pool signal for operator planning.',
    kind: 'approved_data',
    chartable: true,
  },
  {
    id: 'saudi-population-2024',
    label: 'Population',
    displayValue: '35.30M',
    rawValue: 35.30028,
    geography: 'Saudi Arabia',
    coveragePeriod: '2024',
    sourceId: 'world-bank-data',
    sourcePublished: '2024',
    attribution: 'Source: World Bank country profile for Saudi Arabia.',
    note: 'Saudi demand scale is materially larger, which changes expansion math for chains and franchise groups.',
    kind: 'approved_data',
    chartable: true,
  },
  {
    id: 'uae-gdp-growth-2024',
    label: 'GDP growth',
    displayValue: '4.0%',
    rawValue: 4.0,
    geography: 'United Arab Emirates',
    coveragePeriod: '2024',
    sourceId: 'world-bank-data',
    sourcePublished: '2024',
    attribution: 'Source: World Bank country profile for the United Arab Emirates.',
    note: 'A useful macro demand backdrop rather than a direct proxy for restaurant revenue.',
    kind: 'approved_data',
    chartable: true,
  },
  {
    id: 'saudi-gdp-growth-2024',
    label: 'GDP growth',
    displayValue: '2.0%',
    rawValue: 2.0,
    geography: 'Saudi Arabia',
    coveragePeriod: '2024',
    sourceId: 'world-bank-data',
    sourcePublished: '2024',
    attribution: 'Source: World Bank country profile for Saudi Arabia.',
    note: 'Still positive demand context, but the operator story hinges more on sector capacity build-out and tourism infrastructure.',
    kind: 'approved_data',
    chartable: true,
  },
  {
    id: 'uae-inflation-2024',
    label: 'Inflation',
    displayValue: '1.7%',
    rawValue: 1.7,
    geography: 'United Arab Emirates',
    coveragePeriod: '2024',
    sourceId: 'world-bank-data',
    sourcePublished: '2024',
    attribution: 'Source: World Bank country profile for the United Arab Emirates.',
    note: 'Useful as a starter inflation watch while more granular F&B price baskets are wired in.',
    kind: 'approved_data',
    chartable: true,
  },
  {
    id: 'saudi-inflation-2024',
    label: 'Inflation',
    displayValue: '1.7%',
    rawValue: 1.7,
    geography: 'Saudi Arabia',
    coveragePeriod: '2024',
    sourceId: 'world-bank-data',
    sourcePublished: '2024',
    attribution: 'Source: World Bank country profile for Saudi Arabia.',
    note: 'Saudi inflation is low enough to frame selective pricing rather than panic discounting.',
    kind: 'approved_data',
    chartable: true,
  },
  {
    id: 'uae-internet-2024',
    label: 'Internet penetration',
    displayValue: '100%',
    rawValue: 100,
    geography: 'United Arab Emirates',
    coveragePeriod: '2024',
    sourceId: 'world-bank-data',
    sourcePublished: '2024',
    attribution: 'Source: World Bank country profile for the United Arab Emirates.',
    note: 'Strong digital readiness supports delivery, CRM, maps discovery, and digital ordering flows.',
    kind: 'approved_data',
    chartable: true,
  },
  {
    id: 'saudi-internet-2024',
    label: 'Internet penetration',
    displayValue: '100%',
    rawValue: 100,
    geography: 'Saudi Arabia',
    coveragePeriod: '2024',
    sourceId: 'world-bank-data',
    sourcePublished: '2024',
    attribution: 'Source: World Bank country profile for Saudi Arabia.',
    note: 'Digital readiness is no longer the barrier; brand, logistics, and economics are.',
    kind: 'approved_data',
    chartable: true,
  },
  {
    id: 'uae-fdi-2024',
    label: 'FDI inflows (% of GDP)',
    displayValue: '8.3%',
    rawValue: 8.3,
    geography: 'United Arab Emirates',
    coveragePeriod: '2024',
    sourceId: 'world-bank-data',
    sourcePublished: '2024',
    attribution: 'Source: World Bank country profile for the United Arab Emirates.',
    note: 'A useful proxy for broader commercial confidence and the premium-end project pipeline.',
    kind: 'approved_data',
    chartable: true,
  },
  {
    id: 'saudi-fdi-2024',
    label: 'FDI inflows (% of GDP)',
    displayValue: '1.7%',
    rawValue: 1.7,
    geography: 'Saudi Arabia',
    coveragePeriod: '2024',
    sourceId: 'world-bank-data',
    sourcePublished: '2024',
    attribution: 'Source: World Bank country profile for Saudi Arabia.',
    note: 'Saudi opportunity is less about headline FDI and more about domestic scale, state-backed development, and operator build-out.',
    kind: 'approved_data',
    chartable: true,
  },
  {
    id: 'uae-spi-2024',
    label: 'Statistical performance index',
    displayValue: '79.1',
    rawValue: 79.1,
    geography: 'United Arab Emirates',
    coveragePeriod: '2024',
    sourceId: 'world-bank-data',
    sourcePublished: '2024',
    attribution: 'Source: World Bank country profile for the United Arab Emirates.',
    note: 'A governance-quality proxy that matters when building a public-data intelligence product.',
    kind: 'approved_data',
    chartable: true,
  },
  {
    id: 'saudi-spi-2024',
    label: 'Statistical performance index',
    displayValue: '83.3',
    rawValue: 83.3,
    geography: 'Saudi Arabia',
    coveragePeriod: '2024',
    sourceId: 'world-bank-data',
    sourcePublished: '2024',
    attribution: 'Source: World Bank country profile for Saudi Arabia.',
    note: 'Saudi official-statistics quality is strong, which makes the country a worthwhile next candidate for approved dataset expansion.',
    kind: 'approved_data',
    chartable: true,
  },
  {
    id: 'dubai-visitors-2024',
    label: 'Dubai overnight visitors',
    displayValue: '18.72M',
    geography: 'Dubai, UAE',
    coveragePeriod: '2024',
    sourceId: 'dubai-det-tourism-2024',
    sourcePublished: '14 Jan 2025',
    attribution: 'Source: Dubai DET Tourism Performance Report January–December 2024.',
    note: 'Use descriptively as a tourism-linked demand signal, not as a raw downloadable dataset.',
    kind: 'citation_signal',
  },
  {
    id: 'dubai-restaurant-licenses-2024',
    label: 'New restaurant licences',
    displayValue: 'Almost 1,200',
    geography: 'Dubai, UAE',
    coveragePeriod: '2024',
    sourceId: 'dubai-det-gastronomy-2024',
    sourcePublished: '9 Apr 2025',
    attribution: 'Source: Dubai DET press release summarizing the Gastronomy Industry Report 2024.',
    note: 'Descriptive operator signal showing continued category churn and appetite for new concepts.',
    kind: 'citation_signal',
  },
  {
    id: 'dubai-diner-social-2024',
    label: 'Diners consulting social media',
    displayValue: '70%',
    geography: 'Dubai, UAE',
    coveragePeriod: '2024',
    sourceId: 'dubai-det-gastronomy-2024',
    sourcePublished: '9 Apr 2025',
    attribution: 'Source: Dubai DET press release summarizing the Gastronomy Industry Report 2024.',
    note: 'A strong justification for maps, creator content, and review hygiene to sit alongside paid media.',
    kind: 'citation_signal',
  },
  {
    id: 'dubai-foodservice-gdp-share-2024',
    label: 'Accommodation & food service GDP share',
    displayValue: '3.4%',
    geography: 'Dubai, UAE',
    coveragePeriod: 'First 9 months of 2024',
    sourceId: 'dubai-det-gastronomy-2024',
    sourcePublished: '9 Apr 2025',
    attribution: 'Source: Dubai DET press release summarizing the Gastronomy Industry Report 2024.',
    note: 'Helpful as a policy-weight signal showing the sector is economically visible, not just culturally visible.',
    kind: 'citation_signal',
  },
  {
    id: 'dubai-dining-searches-2024',
    label: 'Dining-related online searches',
    displayValue: '741,500',
    geography: 'Dubai, UAE',
    coveragePeriod: 'Jan–Jul 2024',
    sourceId: 'dubai-det-gastronomy-2024',
    sourcePublished: '9 Apr 2025',
    attribution: 'Source: Dubai DET press release summarizing the Gastronomy Industry Report 2024.',
    note: 'Useful as a discovery-intent signal. Treat as narrative support, not a downloadable search dataset.',
    kind: 'citation_signal',
  },
  {
    id: 'ksa-tourism-facilities-q1-2025',
    label: 'Licensed tourism hospitality facilities',
    displayValue: '4,988',
    geography: 'Saudi Arabia',
    coveragePeriod: 'Q1 2025',
    sourceId: 'gastat-tourism-q1-2025',
    sourcePublished: '3 Jul 2025',
    attribution: 'Source: GASTAT Tourism Establishments Statistics Q1 2025.',
    note: 'Official hospitality-capacity signal showing the scale-up environment around foodservice demand.',
    kind: 'citation_signal',
  },
  {
    id: 'ksa-hotel-occupancy-q1-2025',
    label: 'Hotel room occupancy',
    displayValue: '63.0%',
    geography: 'Saudi Arabia',
    coveragePeriod: 'Q1 2025',
    sourceId: 'gastat-tourism-q1-2025',
    sourcePublished: '3 Jul 2025',
    attribution: 'Source: GASTAT Tourism Establishments Statistics Q1 2025.',
    note: 'A strong tourism-demand proxy for cities and corridors benefiting from travel growth.',
    kind: 'citation_signal',
  },
  {
    id: 'ksa-tourism-employment-q1-2025',
    label: 'Employees in tourism activities',
    displayValue: '983,253',
    geography: 'Saudi Arabia',
    coveragePeriod: 'Q1 2025',
    sourceId: 'gastat-tourism-q1-2025',
    sourcePublished: '3 Jul 2025',
    attribution: 'Source: GASTAT Tourism Establishments Statistics Q1 2025.',
    note: 'A useful scale signal for staffing pressure, service training demand, and support-service ecosystems.',
    kind: 'citation_signal',
  },
  {
    id: 'ksa-private-sector-tourism-share-q1-2025',
    label: 'Tourism share of private-sector employment',
    displayValue: '8.1%',
    geography: 'Saudi Arabia',
    coveragePeriod: 'Q1 2025',
    sourceId: 'gastat-tourism-q1-2025',
    sourcePublished: '3 Jul 2025',
    attribution: 'Source: GASTAT Tourism Establishments Statistics Q1 2025.',
    note: 'Useful for framing how hospitality-adjacent sectors are absorbing talent and operating attention.',
    kind: 'citation_signal',
  },
];

export const intelligenceComparisons: ComparisonCard[] = [
  {
    id: 'gcc-market-pulse',
    title: 'Approved-reuse market pulse',
    description:
      'Original comparison blocks derived only from reusable World Bank indicator pages. This is the safe chart layer behind the section.',
    groups: [
      {
        label: 'GDP growth (2024)',
        sourceId: 'world-bank-data',
        sourcePublished: '2024',
        items: [
          { label: 'UAE', value: 4.0, displayValue: '4.0%', accent: 'gold' },
          { label: 'Saudi Arabia', value: 2.0, displayValue: '2.0%', accent: 'slate' },
        ],
      },
      {
        label: 'FDI inflows (% of GDP, 2024)',
        sourceId: 'world-bank-data',
        sourcePublished: '2024',
        items: [
          { label: 'UAE', value: 8.3, displayValue: '8.3%', accent: 'gold' },
          { label: 'Saudi Arabia', value: 1.7, displayValue: '1.7%', accent: 'slate' },
        ],
      },
      {
        label: 'Statistical performance index (2024)',
        sourceId: 'world-bank-data',
        sourcePublished: '2024',
        items: [
          { label: 'UAE', value: 79.1, displayValue: '79.1', accent: 'gold' },
          { label: 'Saudi Arabia', value: 83.3, displayValue: '83.3', accent: 'slate' },
        ],
      },
    ],
    footer:
      'Built from World Bank country profile indicators only. Citation-only tourism authority and statistical releases stay in separate signal cards.',
  },
  {
    id: 'gcc-operator-inflation',
    title: 'Price-pressure context',
    description:
      'Starter inflation watch that gives operators a safe macro pulse without implying menu-specific pricing guidance.',
    groups: [
      {
        label: 'Inflation, consumer prices (2024)',
        sourceId: 'world-bank-data',
        sourcePublished: '2024',
        items: [
          { label: 'UAE', value: 1.7, displayValue: '1.7%', accent: 'gold' },
          { label: 'Saudi Arabia', value: 1.7, displayValue: '1.7%', accent: 'slate' },
        ],
      },
      {
        label: 'GDP growth (2024)',
        sourceId: 'world-bank-data',
        sourcePublished: '2024',
        items: [
          { label: 'UAE', value: 4.0, displayValue: '4.0%', accent: 'gold' },
          { label: 'Saudi Arabia', value: 2.0, displayValue: '2.0%', accent: 'slate' },
        ],
      },
    ],
    footer:
      'This watch is intentionally broad. Until an approved F&B price basket is integrated, avoid pretending these figures are restaurant-specific inflation.',
  },
  {
    id: 'digital-readiness-proxy',
    title: 'Digital readiness proxies',
    description:
      'Legal-safe proxy indicators for delivery, CRM, and digital-ordering readiness when proprietary delivery market-share data is unavailable.',
    groups: [
      {
        label: 'Internet use (2024)',
        sourceId: 'world-bank-data',
        sourcePublished: '2024',
        items: [
          { label: 'UAE', value: 100, displayValue: '100%', accent: 'gold' },
          { label: 'Saudi Arabia', value: 100, displayValue: '100%', accent: 'slate' },
        ],
      },
      {
        label: 'FDI inflows (% of GDP, 2024)',
        sourceId: 'world-bank-data',
        sourcePublished: '2024',
        items: [
          { label: 'UAE', value: 8.3, displayValue: '8.3%', accent: 'gold' },
          { label: 'Saudi Arabia', value: 1.7, displayValue: '1.7%', accent: 'slate' },
        ],
      },
      {
        label: 'Population growth (2024)',
        sourceId: 'world-bank-data',
        sourcePublished: '2024',
        items: [
          { label: 'UAE', value: 4.7, displayValue: '4.7%', accent: 'gold' },
          { label: 'Saudi Arabia', value: 4.6, displayValue: '4.6%', accent: 'slate' },
        ],
      },
    ],
    footer:
      'These are proxy indicators only. The page explicitly avoids publishing unlicensed delivery market-share claims.',
  },
];

export const intelligenceCountries: IntelligenceCountry[] = [
  {
    slug: 'uae',
    name: 'United Arab Emirates',
    shortName: 'UAE',
    eyebrow: 'Country intelligence',
    title: 'UAE F&B intelligence for operators building in a high-discovery, tourism-linked market.',
    summary:
      'The UAE page leans on approved macro datasets for charts, then layers in citation-led Dubai demand signals so operators get useful context without crossing licensing lines.',
    metaTitle: 'UAE F&B Intelligence Dashboard',
    metaDescription:
      'A legal-safe UAE food and beverage intelligence page covering macro demand, digital adoption, tourism-linked signals, and operator takeaways.',
    coverageNote:
      'Dubai demand signals are cited from DET, while visualized comparisons stay inside approved-reuse data boundaries.',
    macroFacts: ['uae-population-2024', 'uae-gdp-growth-2024', 'uae-inflation-2024', 'uae-fdi-2024'],
    signalFacts: [
      'dubai-visitors-2024',
      'dubai-restaurant-licenses-2024',
      'dubai-diner-social-2024',
      'dubai-foodservice-gdp-share-2024',
    ],
    comparisonId: 'digital-readiness-proxy',
    whatOwnersShouldWatch: [
      'Treat tourism demand as an amplifier, not your entire revenue model. The strongest concepts still need local repeat behavior.',
      'Discovery is highly digital. Maps, reviews, creator content, and operational hygiene now sit in the same growth stack.',
      'The UAE remains attractive for premium and experience-led concepts, but churn is real, so the margin story matters as much as the launch story.',
    ],
    whatThisMeansFor: {
      cafes: [
        'Use social proof and local neighborhood discovery to turn visitor curiosity into daytime repeat.',
        'Value architecture matters. Dubai demand is broad, but not every neighborhood supports premium pricing without a strong habit loop.',
      ],
      cloudKitchens: [
        'The case is less about pure demand creation and more about winning visibility and repeat in a crowded digital marketplace.',
        'Approved macro signals support digital readiness, while DET commentary suggests social discovery remains a top route into trial.',
      ],
      multiUnitOperators: [
        'Expansion discipline is critical. A high-opportunity market can still punish brands that scale before unit economics are stable.',
        'Use the UAE as a test bed for format mix, offer architecture, and creator-led launch systems.',
      ],
    },
    caution: [
      'DET figures are kept descriptive and linked back to source material. This build does not ingest DET report tables directly.',
      'Dubai is used as the city-level spotlight because it has the most accessible official hospitality research in the current source stack.',
    ],
    relatedReportSlugs: ['gcc-market-pulse', 'uae-demand-led-format-playbook', 'operator-inflation-watch'],
  },
  {
    slug: 'saudi-arabia',
    name: 'Saudi Arabia',
    shortName: 'Saudi Arabia',
    eyebrow: 'Country intelligence',
    title: 'Saudi Arabia F&B intelligence focused on scale, hospitality capacity, and operator timing.',
    summary:
      'Saudi Arabia combines national-scale demand with a rapidly expanding hospitality backdrop. This starter page uses approved charts for macro context and citation-led GASTAT releases for sector signals.',
    metaTitle: 'Saudi Arabia F&B Intelligence Dashboard',
    metaDescription:
      'A legal-safe Saudi foodservice intelligence page covering population scale, macro context, hospitality growth signals, and operator takeaways.',
    coverageNote:
      'GASTAT tourism-establishment figures are used as attributed signals only while the chart layer stays inside approved-reuse datasets.',
    macroFacts: ['saudi-population-2024', 'saudi-gdp-growth-2024', 'saudi-inflation-2024', 'saudi-spi-2024'],
    signalFacts: [
      'ksa-tourism-facilities-q1-2025',
      'ksa-hotel-occupancy-q1-2025',
      'ksa-tourism-employment-q1-2025',
      'ksa-private-sector-tourism-share-q1-2025',
    ],
    comparisonId: 'gcc-market-pulse',
    whatOwnersShouldWatch: [
      'Saudi opportunity is increasingly about execution capacity: real estate timing, service training, and supply-chain reliability.',
      'Hospitality growth signals suggest a broader ecosystem build-out, which can support restaurant growth but also raise the bar on operational excellence.',
      'Population scale alone is not a strategy. Winning formats will match city, corridor, and spend profile rather than treating the market as uniform.',
    ],
    whatThisMeansFor: {
      cafes: [
        'Daypart-specific formats and culturally local relevance matter more than generic coffee-shop positioning.',
        'Hospitality growth can create spillover demand, but neighborhood-level convenience still decides frequency.',
      ],
      cloudKitchens: [
        'Saudi digital readiness is already high enough; the real unlock is disciplined geography, logistics, and packaging quality.',
        'Treat delivery as a format strategy, not just an incremental channel.',
      ],
      multiUnitOperators: [
        'Saudi suits operators who can standardize opening playbooks, staff training, and branch-level performance measurement.',
        'Expansion needs a city-by-city sequencing model, not a national splash launch.',
      ],
    },
    caution: [
      'This starter build deliberately avoids publishing unverified delivery market-share claims for Saudi cities.',
      'GASTAT release figures are official and useful, but the page treats them as citation-led intelligence until dataset-level reuse rules are clearer.',
    ],
    relatedReportSlugs: ['gcc-market-pulse', 'saudi-scale-and-hospitality-signals', 'operator-inflation-watch'],
  },
];

export const intelligenceTopics: IntelligenceTopic[] = [
  {
    slug: 'delivery-cloud-kitchens',
    name: 'Delivery & Cloud Kitchens',
    eyebrow: 'Topic intelligence',
    title: 'Delivery and cloud kitchen intelligence built on proxies, governance, and operator reality.',
    summary:
      'This topic page intentionally avoids unlicensed market-share claims. Instead, it combines approved digital-readiness proxies with citation-led regional signals to give operators a safer decision surface.',
    metaTitle: 'Delivery & Cloud Kitchen Intelligence',
    metaDescription:
      'A legal-safe delivery and cloud kitchen intelligence page for GCC operators using proxy indicators, governance notes, and operator-focused takeaways.',
    safeDataStrategy:
      'Direct delivery market-share datasets are frequently proprietary. This page therefore uses reusable proxy indicators for charts and keeps delivery-specific market commentary descriptive and source-linked.',
    proxyFacts: ['uae-internet-2024', 'saudi-internet-2024', 'uae-fdi-2024', 'saudi-fdi-2024'],
    signalFacts: ['dubai-diner-social-2024', 'dubai-dining-searches-2024', 'ksa-hotel-occupancy-q1-2025'],
    comparisonId: 'digital-readiness-proxy',
    operatorActions: [
      'Use delivery pages as economics pages first: geography, fees, packaging, and repeat mechanics decide quality of growth.',
      'Treat digital readiness as table stakes. The differentiator is system design: menu architecture, demand capture, and post-order retention.',
      'Use citation-only sector commentary as directional context, not as the basis for hard forecasts or investor decks.',
    ],
    caution: [
      'No proprietary delivery market shares are published on this page.',
      'Any future raw delivery dataset must be promoted through the governance model before it appears in a chart.',
    ],
    relatedReportSlugs: ['delivery-proxy-playbook', 'gcc-market-pulse'],
  },
  {
    slug: 'tourism-demand',
    name: 'Tourism & Demand',
    eyebrow: 'Topic intelligence',
    title: 'Tourism-linked demand signals for operators who need to separate hype from usable demand.',
    summary:
      'Tourism can elevate F&B demand, but strong operators need to know when it supports repeatable revenue and when it only creates seasonal noise.',
    metaTitle: 'Tourism & Demand Signals for GCC F&B',
    metaDescription:
      'Tourism-linked food and beverage intelligence for UAE and Saudi operators, built from public sources and legal-safe attribution.',
    safeDataStrategy:
      'Public tourism authority and statistical releases are used as attributed signals. Reusable macro charts provide the stable comparison layer.',
    proxyFacts: ['uae-gdp-growth-2024', 'saudi-gdp-growth-2024', 'uae-population-2024', 'saudi-population-2024'],
    signalFacts: ['dubai-visitors-2024', 'dubai-foodservice-gdp-share-2024', 'ksa-hotel-occupancy-q1-2025'],
    comparisonId: 'gcc-market-pulse',
    operatorActions: [
      'Map tourism demand to formats that can absorb volatility: premium casual, flagship cafe, destination dessert, and seasonal experience-led concepts.',
      'Never let tourism hide a weak local repeat engine. Durable F&B economics still come from frequency and basket quality.',
      'Use tourism-linked signals to inform launch timing, staffing, and merchandising, not just top-line optimism.',
    ],
    caution: [
      'Tourism-led signals are not substitutes for neighborhood-level feasibility and branch economics.',
      'Cited tourism figures are linked to original reports and intentionally not reproduced as copied report graphics.',
    ],
    relatedReportSlugs: ['uae-demand-led-format-playbook', 'saudi-scale-and-hospitality-signals', 'gcc-market-pulse'],
  },
  {
    slug: 'pricing-inflation',
    name: 'Pricing & Inflation',
    eyebrow: 'Topic intelligence',
    title: 'Pricing and inflation context for operators who need calm margin decisions, not noise.',
    summary:
      'This page keeps the inflation story honest: broad macro price signals are helpful, but they do not replace store-level menu engineering and procurement discipline.',
    metaTitle: 'GCC Pricing & Inflation',
    metaDescription:
      'A legal-safe inflation watch page for GCC food and beverage operators using approved macro indicators and clear commercial caveats.',
    safeDataStrategy:
      'Only approved macro indicators are charted here. No claim is made that these figures represent restaurant-specific cost baskets.',
    proxyFacts: ['uae-inflation-2024', 'saudi-inflation-2024', 'uae-gdp-growth-2024', 'saudi-gdp-growth-2024'],
    signalFacts: ['dubai-foodservice-gdp-share-2024', 'ksa-private-sector-tourism-share-q1-2025'],
    comparisonId: 'gcc-operator-inflation',
    operatorActions: [
      'Use inflation context to guide pricing cadence, not to justify across-the-board price increases.',
      'Pair macro watchlists with menu engineering, supplier negotiations, and contribution-margin tracking.',
      'Use this page as context for operator decisions, not as investment advice or financial forecasting.',
    ],
    caution: [
      'Macro inflation is a directional lens only.',
      'Restaurant-specific cost dashboards should sit in a separate internal model unless a reusable sector basket is available.',
    ],
    relatedReportSlugs: ['operator-inflation-watch', 'gcc-market-pulse'],
  },
];

export const intelligenceReports: IntelligenceReport[] = [
  {
    slug: 'gcc-market-pulse',
    title: 'GCC F&B market pulse: the approved-reuse baseline',
    eyebrow: 'Starter report',
    summary:
      'A launch report that proves the section can look premium while staying inside approved reuse boundaries. It uses only reusable World Bank indicators for the chart layer and pushes everything else into attributed signal cards.',
    metaTitle: 'GCC F&B Market Pulse',
    metaDescription:
      'A legal-safe GCC food and beverage market pulse report built from reusable public indicators and explicit source governance.',
    geography: 'GCC / UAE / Saudi Arabia',
    accessModel: 'approved_reuse',
    updated: '2026-04-19',
    filters: {
      country: ['gcc', 'uae', 'saudi-arabia'],
      topic: ['market-overview', 'benchmarks'],
    },
    featuredFacts: ['uae-gdp-growth-2024', 'saudi-gdp-growth-2024', 'uae-fdi-2024', 'saudi-fdi-2024'],
    comparisonId: 'gcc-market-pulse',
    executiveSummary: [
      'The current launch-safe chart layer is strongest when it uses World Bank country indicators with explicit CC BY 4.0 terms and indicator-level checks.',
      'The UAE shows a stronger FDI signal, while Saudi Arabia shows greater population scale and slightly higher statistical-system strength.',
      'This baseline report is not pretending to be category market share. It is a clean demand and governance layer for the entire intelligence section.',
    ],
    operatorTakeaways: [
      'Use the UAE when you need high-discovery, high-competition, premium-sensitive environments.',
      'Use Saudi Arabia when you need market scale and are prepared to operationalize expansion carefully.',
      'Do not use macro charts alone to make site decisions. Pair them with city, format, and unit-economics work.',
    ],
    sections: [
      {
        title: 'Why this report exists',
        body:
          'Most F&B market pages online lean on republished proprietary data. This report takes the opposite route: approved public indicators first, then clearly labeled citation-only operator signals around them.',
        bullets: [
          'Charts are original visualizations only.',
          'All metrics are traceable to visible source records.',
          'Every number shown here can be audited back to a public source URL.',
        ],
      },
      {
        title: 'What the safe chart layer can answer',
        body:
          'Approved-reuse macro indicators are useful for comparing operating environments, especially when the goal is to identify where demand context, investment climate, and digital readiness are strongest.',
        bullets: [
          'Population scale for addressable demand framing.',
          'GDP growth for broad momentum context.',
          'FDI inflows as a proxy for commercial confidence and project flow.',
          'Statistical-performance quality as a confidence layer for future data expansion.',
        ],
      },
    ],
    limitations: [
      'This report intentionally does not claim F&B market share.',
      'Citation-only sources are referenced elsewhere in the section rather than converted into direct charts here.',
    ],
    sourceIds: ['world-bank-data', 'uae-open-data-policy', 'fcsc-open-data-cpi'],
    relatedReportSlugs: ['operator-inflation-watch', 'uae-demand-led-format-playbook', 'saudi-scale-and-hospitality-signals'],
  },
  {
    slug: 'uae-demand-led-format-playbook',
    title: 'UAE demand-led format playbook',
    eyebrow: 'Country report',
    summary:
      'A UAE report that combines reusable macro signals with attributed Dubai demand commentary so founders can think about format fit, not just category hype.',
    metaTitle: 'UAE Demand-Led Format Playbook',
    metaDescription:
      'A UAE food and beverage intelligence report translating public demand signals into operator-focused commercial takeaways.',
    geography: 'United Arab Emirates / Dubai',
    accessModel: 'mixed_source',
    updated: '2026-04-19',
    filters: {
      country: ['uae'],
      topic: ['tourism-demand', 'growth-opportunities'],
    },
    featuredFacts: ['uae-population-2024', 'uae-gdp-growth-2024', 'dubai-visitors-2024', 'dubai-diner-social-2024'],
    comparisonId: 'digital-readiness-proxy',
    executiveSummary: [
      'The UAE combines high digital readiness with strong tourism-driven visibility, making it an unusually discovery-heavy F&B market.',
      'Dubai-specific public signals suggest attention is abundant, but competition and launch churn are high enough that differentiation still matters.',
      'This is a strong environment for premium casual, brand-forward cafes, and creator-amplified launches that can sustain repeat.',
    ],
    operatorTakeaways: [
      'Make discovery design part of the unit model: maps, reviews, creator content, and operational reliability all compound.',
      'Concept clarity matters more than headline demand. The market punishes copycat launches quickly.',
      'Use tourism as upside, not as the only story in the business case.',
    ],
    sections: [
      {
        title: 'The commercial shape of the opportunity',
        body:
          'Reusable macro indicators show a healthy demand backdrop. Citation-led Dubai research adds the F&B-specific layer: lots of attention, lots of openings, and a market that rewards clear concepts.',
        bullets: [
          'High digital readiness supports delivery, CRM, and creator-led discovery.',
          'The reported volume of new restaurant licences suggests a fast-moving competitive field.',
          'Tourism strength helps, but repeatable local relevance still does the heavy lifting.',
        ],
      },
      {
        title: 'Best fit formats',
        body:
          'The strongest fit is not necessarily the most luxurious format. It is the format whose brand, price point, and habit loop match a specific district and customer rhythm.',
        bullets: [
          'Premium casual concepts with strong identity and service choreography.',
          'Cafe formats with repeatable daypart behavior and high shareability.',
          'Delivery-adjacent brands that understand how discovery converts into repeat.',
        ],
      },
    ],
    limitations: [
      'Dubai-specific signals on this page are cited from DET and are not republished as copied report tables or visuals.',
      'This page is a strategy lens, not a site-selection model.',
    ],
    sourceIds: ['world-bank-data', 'dubai-det-gastronomy-2024', 'dubai-det-tourism-2024'],
    relatedReportSlugs: ['gcc-market-pulse', 'delivery-proxy-playbook', 'operator-inflation-watch'],
  },
  {
    slug: 'saudi-scale-and-hospitality-signals',
    title: 'Saudi scale and hospitality signals',
    eyebrow: 'Country report',
    summary:
      'A Saudi report for operators who need to interpret official hospitality-growth releases without pretending they are full market-share datasets.',
    metaTitle: 'Saudi Scale & Hospitality Signals',
    metaDescription:
      'A Saudi foodservice intelligence report using public macro indicators and official hospitality signals to frame operator opportunity.',
    geography: 'Saudi Arabia',
    accessModel: 'mixed_source',
    updated: '2026-04-19',
    filters: {
      country: ['saudi-arabia'],
      topic: ['market-overview', 'tourism-demand'],
    },
    featuredFacts: ['saudi-population-2024', 'saudi-gdp-growth-2024', 'ksa-tourism-facilities-q1-2025', 'ksa-hotel-occupancy-q1-2025'],
    comparisonId: 'gcc-market-pulse',
    executiveSummary: [
      'Saudi Arabia offers the largest pure-scale story in the launch geography set, but the real unlock is operational capability rather than audience size alone.',
      'Official hospitality releases show an expanding ecosystem around tourism and accommodation, which can create meaningful spillover for foodservice.',
      'Brands that win will likely be the ones that localize execution, not the ones that rely on generic regional positioning.',
    ],
    operatorTakeaways: [
      'Prioritize corridor sequencing and operating playbooks over broad national storytelling.',
      'Hospitality growth creates openings for foodservice, but service consistency and supply chains decide whether growth is durable.',
      'Saudi is increasingly attractive for chains and franchise models that can standardize without becoming rigid.',
    ],
    sections: [
      {
        title: 'Why the scale story matters',
        body:
          'Saudi population scale is not the same thing as guaranteed format success, but it changes the size of the prize for operators who can execute well and choose the right city sequence.',
        bullets: [
          'Macro demand context is supportive, even if growth is lower than the UAE headline.',
          'The statistical-governance quality is strong enough to justify future official-data expansion.',
          'Hospitality releases suggest capacity build-out that can support foodservice traffic and ecosystem growth.',
        ],
      },
      {
        title: 'What operators should test',
        body:
          'Saudi rewards businesses that learn quickly in-market. Use the first city or two as operating labs rather than as proof that one format fits the whole country.',
        bullets: [
          'Localized menu and service design.',
          'Branch-level staffing and training systems.',
          'City-specific launch and retention playbooks.',
        ],
      },
    ],
    limitations: [
      'GASTAT release figures on this page are treated as citation-led signals, not as downloadable chart datasets.',
      'This page intentionally avoids city-specific claims unless public evidence is strong enough and clearly licensed.',
    ],
    sourceIds: ['world-bank-data', 'gastat-tourism-q1-2025', 'saudi-national-data-bank'],
    relatedReportSlugs: ['gcc-market-pulse', 'operator-inflation-watch', 'delivery-proxy-playbook'],
  },
  {
    slug: 'operator-inflation-watch',
    title: 'Operator inflation watch',
    eyebrow: 'Topic report',
    summary:
      'A careful inflation watch for operators who want margin context without being misled into thinking generic CPI is a direct menu-cost dashboard.',
    metaTitle: 'Operator Inflation Watch',
    metaDescription:
      'A legal-safe inflation watch for GCC food and beverage operators using approved macro indicators and explicit caveats.',
    geography: 'UAE / Saudi Arabia',
    accessModel: 'approved_reuse',
    updated: '2026-04-19',
    filters: {
      country: ['uae', 'saudi-arabia', 'gcc'],
      topic: ['pricing-inflation', 'benchmarks'],
    },
    featuredFacts: ['uae-inflation-2024', 'saudi-inflation-2024', 'uae-gdp-growth-2024', 'saudi-gdp-growth-2024'],
    comparisonId: 'gcc-operator-inflation',
    executiveSummary: [
      'Both markets show relatively modest consumer-price inflation in the current public indicator layer.',
      'Low inflation is not a reason to relax operating discipline. Labor, occupancy, procurement, and promotion leakage still decide margins.',
      'The safe use of CPI in this section is contextual, not predictive.',
    ],
    operatorTakeaways: [
      'Use inflation context to time pricing conversations, not to justify blunt price hikes.',
      'Pair public macro data with internal mix, waste, and procurement dashboards for real decision-making.',
      'Build margin narratives around what you can prove, not what a generic macro metric seems to imply.',
    ],
    sections: [
      {
        title: 'How to read this page correctly',
        body:
          'This page is built to calm the operator, not to excite them. Public inflation numbers are useful, but only if you read them as context.',
        bullets: [
          'Inflation is broader than restaurant cost pressure.',
          'Restaurant-specific pricing decisions need internal unit economics.',
          'Public macro indicators are still valuable for pacing and communication.',
        ],
      },
    ],
    limitations: [
      'No restaurant-specific CPI basket is claimed here.',
      'Do not treat this report as financial advice or as a substitute for internal cost accounting.',
    ],
    sourceIds: ['world-bank-data', 'fcsc-open-data-cpi'],
    relatedReportSlugs: ['gcc-market-pulse', 'uae-demand-led-format-playbook', 'saudi-scale-and-hospitality-signals'],
  },
  {
    slug: 'delivery-proxy-playbook',
    title: 'Delivery proxy playbook',
    eyebrow: 'Topic report',
    summary:
      'A delivery-intelligence page that proves you can be useful without publishing unlicensed market-share slides.',
    metaTitle: 'Delivery Proxy Playbook',
    metaDescription:
      'A legal-safe delivery and cloud kitchen playbook for GCC operators using approved proxy indicators and citation-led signals.',
    geography: 'GCC / UAE / Saudi Arabia',
    accessModel: 'mixed_source',
    updated: '2026-04-19',
    filters: {
      country: ['gcc', 'uae', 'saudi-arabia'],
      topic: ['delivery-cloud-kitchens', 'digital-adoption'],
    },
    featuredFacts: ['uae-internet-2024', 'saudi-internet-2024', 'dubai-diner-social-2024', 'dubai-dining-searches-2024'],
    comparisonId: 'digital-readiness-proxy',
    executiveSummary: [
      'Proxy-led delivery intelligence is the safest way to publish this topic without licensing proprietary delivery datasets.',
      'Both markets are digitally mature enough that logistics, packaging, and retention matter more than basic connectivity.',
      'Discovery signals from Dubai research support the case for creator content, review management, and search visibility in the delivery funnel.',
    ],
    operatorTakeaways: [
      'Treat delivery as a unit model, not as a marketing add-on.',
      'Discovery and digital readiness are already strong; the advantage moves to menu, logistics, and repeat economics.',
      'Use proxy metrics to frame commercial direction, then validate with your own platform dashboards.',
    ],
    sections: [
      {
        title: 'Why proxies matter',
        body:
          'Public delivery market-share datasets are often proprietary or unclear. Proxy metrics let the site stay useful and trustworthy without bluffing certainty.',
        bullets: [
          'Internet penetration for digital readiness.',
          'Population and growth for demand base.',
          'Citation-led hospitality and search-intent signals for market texture.',
        ],
      },
      {
        title: 'What this means for cloud kitchens',
        body:
          'Cloud kitchens do not win because the market is “digital.” They win when the operational stack is deliberately designed around geography, packaging, fees, and repeat.',
        bullets: [
          'Cluster catchments carefully.',
          'Engineer the menu for margin and journey quality.',
          'Use owned retention to reduce marketplace dependence.',
        ],
      },
    ],
    limitations: [
      'No proprietary delivery market-share charts are included.',
      'Any future direct delivery dataset must pass the source-governance workflow before publication.',
    ],
    sourceIds: ['world-bank-data', 'dubai-det-gastronomy-2024', 'gastat-tourism-q1-2025'],
    relatedReportSlugs: ['gcc-market-pulse', 'operator-inflation-watch', 'uae-demand-led-format-playbook'],
  },
];

export const intelligenceLaunchModules: LaunchModule[] = [
  {
    title: 'GCC F&B intelligence overview',
    description: 'Safe macro benchmark layer with country comparisons and governance-first charting.',
    slug: 'gcc-market-pulse',
    status: 'Live',
    sourceStrategy: 'Approved reuse only',
  },
  {
    title: 'UAE cafe and restaurant opportunity snapshot',
    description: 'Country page with reusable macro context plus cited Dubai demand signals.',
    slug: 'uae-demand-led-format-playbook',
    status: 'Live',
    sourceStrategy: 'Mixed: reusable + citation only',
  },
  {
    title: 'Saudi foodservice growth context',
    description: 'Country page balancing Saudi scale with official hospitality-capacity signals.',
    slug: 'saudi-scale-and-hospitality-signals',
    status: 'Live',
    sourceStrategy: 'Mixed: reusable + citation only',
  },
  {
    title: 'Delivery and cloud kitchen landscape',
    description: 'Proxy-led topic page built for legal safety and operator usefulness.',
    slug: 'delivery-proxy-playbook',
    status: 'Live',
    sourceStrategy: 'Proxy indicators + cited commentary',
  },
  {
    title: 'Operator inflation watch',
    description: 'Macro price-pressure context with clear commercial caveats.',
    slug: 'operator-inflation-watch',
    status: 'Live',
    sourceStrategy: 'Approved reuse only',
  },
  {
    title: 'Tourism and demand signals',
    description: 'Cross-market tourism-linked demand tracker for launch timing and hospitality spillover.',
    status: 'Ready next',
    sourceStrategy: 'Citation-led with approved proxy layer',
  },
  {
    title: 'City-level opportunity summary',
    description: 'Dubai first, then selective expansion into Riyadh, Jeddah, Abu Dhabi, and Doha once source coverage is strong enough.',
    status: 'Ready next',
    sourceStrategy: 'City pages only where public source quality is strong',
  },
  {
    title: 'Benchmark metrics for new operators',
    description: 'A benchmark layer for founders evaluating demand, digital readiness, and price context before launch.',
    status: 'Ready next',
    sourceStrategy: 'Approved reuse only',
  },
  {
    title: 'Quarterly operator briefing',
    description: 'A recurring “what this quarter means” format pulling only from source-approved signals.',
    status: 'Ready next',
    sourceStrategy: 'Governed mixed-source editorial brief',
  },
  {
    title: 'Restaurant density and establishment map',
    description: 'Only ship after establishment datasets and geo coverage are clearly reusable and current.',
    status: 'Research first',
    sourceStrategy: 'Pending geospatial data approval',
  },
];

export const intelligenceFilterOptions = {
  countries: [
    { label: 'All geographies', value: 'all' },
    { label: 'GCC', value: 'gcc' },
    { label: 'UAE', value: 'uae' },
    { label: 'Saudi Arabia', value: 'saudi-arabia' },
  ],
  topics: [
    { label: 'All topics', value: 'all' },
    { label: 'Market overview', value: 'market-overview' },
    { label: 'Tourism & demand', value: 'tourism-demand' },
    { label: 'Delivery & cloud kitchens', value: 'delivery-cloud-kitchens' },
    { label: 'Pricing & inflation', value: 'pricing-inflation' },
    { label: 'Benchmarks', value: 'benchmarks' },
  ],
};

export const methodologyPrinciples = [
  'Public and authoritative sources first.',
  'Original charts only. Never republish third-party report visuals.',
  'Visible attribution on every metric, signal, and report block.',
  'If reuse rights are unclear, the source becomes citation-only or blocked.',
  'Operator usefulness beats vanity data. A smaller safe dataset is better than a larger risky one.',
];

export function getSourceById(id: string) {
  return intelligenceSources.find((source) => source.id === id);
}

export function getFactById(id: string) {
  return intelligenceFacts.find((fact) => fact.id === id);
}

export function getComparisonById(id: string) {
  return intelligenceComparisons.find((comparison) => comparison.id === id);
}

export function getCountryBySlug(slug: string) {
  return intelligenceCountries.find((country) => country.slug === slug);
}

export function getTopicBySlug(slug: string) {
  return intelligenceTopics.find((topic) => topic.slug === slug);
}

export function getReportBySlug(slug: string) {
  return intelligenceReports.find((report) => report.slug === slug);
}

export function getReportsBySlugs(slugs: string[]) {
  return slugs
    .map((slug) => getReportBySlug(slug))
    .filter((report): report is IntelligenceReport => Boolean(report));
}

export const intelligenceHubFacts = [
  'uae-gdp-growth-2024',
  'saudi-population-2024',
  'uae-fdi-2024',
  'saudi-spi-2024',
];
