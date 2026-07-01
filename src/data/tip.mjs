export const tipDisclaimer =
  'TIP is an independent educational research tool. We collect and organize publicly available product, manufacturer, distributor, label, and registration information to help buyers make informed decisions. We do not represent any brand unless explicitly stated, we do not certify product authenticity, and we do not accuse any seller or marketplace of selling counterfeit goods. Final verification should be obtained from the official manufacturer, distributor, seller invoice, or relevant regulatory authority.';

export const tipOgStatement =
  'OG Check: This product can be traced by comparing the product name, manufacturer, active ingredient or specification, label details, batch and expiry information, official manufacturer page, and authorised distributor information. A product should not be judged only by packaging photos or marketplace price. Final authenticity should be confirmed with the manufacturer, distributor, seller invoice, or relevant regulatory authority.';

export const tipStatusLabels = {
  official_source_found: 'Official Source Found',
  distributor_source_found: 'Distributor Source Found',
  more_proof_needed: 'More Proof Needed',
  unable_to_verify: 'Unable to Verify',
  research_pending: 'Research Pending',
};

export const tipCategories = [
  'Pest control products',
  'Kitchen and household products',
  'Coffee, tea, and cafe equipment',
  'Restaurant equipment',
  'Beauty and grooming',
  'Electronics accessories',
  'Food ingredients',
  'Baby and safety products',
  'Supplements and wellness',
  'Packaging and disposables',
];

export const tipBuyerChecklist = [
  {
    title: 'Start with the manufacturer',
    detail: 'Match the manufacturer name on the product, label, and official product page.',
  },
  {
    title: 'Check the official product page',
    detail: 'Compare the exact product name, format, pack size, active ingredient, or model specification.',
  },
  {
    title: 'Check distributor or importer details',
    detail: 'Look for a public distributor reference and compare it with any importer sticker shown on the product.',
  },
  {
    title: 'Check batch and expiry guidance',
    detail: 'Ask for a clear photo of the batch number, manufacturing date, and expiry date where relevant.',
  },
  {
    title: 'Check barcode or product code',
    detail: 'Use the barcode, GTIN, SKU, registration number, or model code as one proof point, not the only proof point.',
  },
  {
    title: 'Compare label details',
    detail: 'Check spelling, formulation, warnings, instructions, and visible label layout against an official reference.',
  },
  {
    title: 'Ask for invoice or source',
    detail: 'Ask the seller for an invoice or supply-source reference before purchasing.',
  },
  {
    title: 'Be careful with unusually low prices',
    detail: 'A price far below visible market ranges is a reason to request more proof, not a conclusion.',
  },
  {
    title: 'Do not rely only on packaging photos',
    detail: 'Stock photos cannot confirm the exact item, batch, distributor sticker, or condition you will receive.',
  },
  {
    title: 'Contact the manufacturer when in doubt',
    detail: 'Final verification should come from the official manufacturer, distributor, or relevant authority.',
  },
];

const advionSources = [
  {
    id: 'syngenta-menaf-advion-product',
    type: 'official_product_page',
    title: 'Advion Cockroach Gel Bait - Syngenta PPM Middle East & North Africa',
    url: 'https://www.syngentappm.com/menaf/product/crop-protection/insecticide/advionrcockroach-gel-bait',
    publisher: 'Syngenta Professional Pest Management',
    accessedAt: '2026-05-30',
    confidence: 'Official manufacturer source',
    note: 'Lists UAE availability, 30 gr syringe format, 0.6% indoxacarb composition, gel bait formulation, and product overview.',
  },
  {
    id: 'syngenta-menaf-advion-uae-label',
    type: 'official_label',
    title: 'Advion Cockroach Gel Bait UAE label booklet',
    url: 'https://www.syngentappm.com/sites/g/files/kgtney981/files/media/document/2025/10/16/advion_cockroach_label_uae_booklet.pdf',
    publisher: 'Syngenta Professional Pest Management',
    accessedAt: '2026-05-30',
    confidence: 'Official manufacturer document',
    note: 'UAE label reference linked from the Syngenta MENAF product page.',
  },
  {
    id: 'syngenta-menaf-advion-uae-sds',
    type: 'safety_data_sheet',
    title: 'Advion Cockroach Gel Bait UAE safety data sheet',
    url: 'https://www.syngentappm.com/sites/g/files/kgtney981/files/media/document/2025/10/16/advion_cockroach_sds_uae.pdf',
    publisher: 'Syngenta Crop Protection AG',
    accessedAt: '2026-05-30',
    confidence: 'Official manufacturer document',
    note: 'Names Syngenta Crop Protection AG in Basel, Switzerland and identifies the product as an insecticide.',
  },
  {
    id: 'syngenta-menaf-agrimatco',
    type: 'distributor_page',
    title: 'Agricultural Materials Company distributor page',
    url: 'https://www.syngentappm.com/menaf/agricultural-materials-company',
    publisher: 'Syngenta Professional Pest Management',
    accessedAt: '2026-05-30',
    confidence: 'Manufacturer-listed distributor',
    note: 'Syngenta page visibly lists Agricultural Materials Company and Advion Cockroach Gel Bait with 0.6% indoxacarb.',
  },
  {
    id: 'syngenta-menaf-distributor-directory',
    type: 'distributor_page',
    title: 'Syngenta PPM MENAF distributor directory',
    url: 'https://www.syngentappm.com/menaf/our-distributors',
    publisher: 'Syngenta Professional Pest Management',
    accessedAt: '2026-05-30',
    confidence: 'Official manufacturer directory',
    note: 'Lists Agricultural Materials Company in the UAE with the Advion cockroach portfolio mark.',
  },
  {
    id: 'syngenta-menaf-contact',
    type: 'manufacturer_contact',
    title: 'Syngenta PPM MENAF contact page',
    url: 'https://www.syngentappm.com/menaf/contact-us',
    publisher: 'Syngenta Professional Pest Management',
    accessedAt: '2026-05-30',
    confidence: 'Official manufacturer contact',
    note: 'Use this contact path for country-specific questions when a public source does not answer the buyer question.',
  },
];

export const tipProducts = [
  {
    slug: 'advion-cockroach-gel-bait',
    name: 'Advion Cockroach Gel Bait',
    brand: 'Advion',
    category: 'Pest control products',
    categoryLabel: 'Pest control / cockroach gel bait',
    productType: 'Cockroach gel bait',
    mainUse: 'Cockroach bait for indoor and outdoor cockroach control where permitted by the applicable label.',
    activeIngredient: 'Indoxacarb 0.6%',
    specification: '30 gr syringe · Gel bait · Group 22 insecticide',
    countryReference: 'United Arab Emirates',
    status: 'official_source_found',
    confidenceLevel: 'Strong public source match',
    lastReviewedAt: '2026-05-30',
    searchKeywords: [
      'advion',
      'advion cockroach gel bait',
      'syngenta',
      'indoxacarb',
      'indoxacarb 0.6%',
      'cockroach gel',
      'roach gel',
      '30 gr syringe',
      'pest control',
      'uae',
    ],
    summary:
      'Official Syngenta MENAF sources were found for Advion Cockroach Gel Bait. The public product page lists UAE availability, a 30 gr syringe, gel bait formulation, and 0.6% indoxacarb composition. A manufacturer-listed UAE distributor reference was also found. Buyers should still compare the exact item, UAE label, batch or expiry details where shown, importer or distributor sticker, and seller invoice before purchase.',
    notConfirmed:
      'TIP has not inspected any individual listing, seller inventory, syringe, package, invoice, batch, or marketplace offer. A public product-page match does not certify the exact item offered for sale.',
    manufacturer: {
      name: 'Syngenta Crop Protection AG',
      legalName: 'Syngenta Crop Protection AG',
      country: 'Switzerland',
      website: 'https://www.syngenta.com/',
      officialProductUrl: 'https://www.syngentappm.com/menaf/product/crop-protection/insecticide/advionrcockroach-gel-bait',
      contactUrl: 'https://www.syngentappm.com/menaf/contact-us',
      confidence: 'Official manufacturer source found',
    },
    distributors: [
      {
        name: 'Agricultural Materials Company',
        tradingName: 'Agrimatco UAE',
        country: 'United Arab Emirates',
        region: 'Al Ain / Abu Dhabi',
        website: 'https://agrimatco.ae/',
        contactUrl: 'https://www.syngentappm.com/menaf/agricultural-materials-company',
        phone: '+971 2 626 0640',
        sourceBasis: 'Manufacturer-listed distributor',
        status: 'Verified by official public source',
        note: 'Syngenta PPM MENAF visibly lists Advion Cockroach Gel Bait under this distributor record.',
        sourceId: 'syngenta-menaf-agrimatco',
      },
    ],
    sources: advionSources,
    buyerChecklist: [
      'Match the exact product name: Advion Cockroach Gel Bait.',
      'Match the manufacturer name against Syngenta Crop Protection AG.',
      'Check that the visible composition matches Indoxacarb 0.6%.',
      'Compare the product label with the official UAE label booklet.',
      'Ask for a real photo of the exact syringe and packaging.',
      'Ask for a clear photo of batch, expiry, or manufacturing details where present.',
      'Check any importer or distributor sticker against a public source.',
      'Ask for an invoice or supply-source reference.',
      'Do not rely only on a stock photo, marketplace title, or unusually low price.',
      'Contact Syngenta or the manufacturer-listed distributor when more proof is needed.',
    ],
    safeBuyingQuestions: [
      'Can you share a real photo of the actual product?',
      'Can you show the batch number and expiry or manufacturing details where present?',
      'Can you show the importer or distributor sticker?',
      'Can you share an invoice or supply-source reference?',
      'Is this supplied through a manufacturer-listed distributor?',
      'Does the composition match Indoxacarb 0.6%?',
      'Does the label match the official UAE product label?',
    ],
    riskSignals: [
      {
        severity: 'medium',
        title: 'Actual product photos are missing',
        detail: 'Stock photos alone do not show the exact item, syringe, batch details, or importer sticker.',
        safeLanguage: 'This listing needs more proof before purchase.',
      },
      {
        severity: 'medium',
        title: 'Batch or expiry details are not visible',
        detail: 'Ask for a clear photo of the available batch, expiry, or manufacturing details before purchase.',
        safeLanguage: 'More proof is needed before purchase.',
      },
      {
        severity: 'medium',
        title: 'Distributor or importer information is not shown',
        detail: 'Compare any UAE distributor or importer reference with an official public source.',
        safeLanguage: 'Needs manufacturer or distributor confirmation.',
      },
      {
        severity: 'low',
        title: 'Composition does not match the official page',
        detail: 'The official Syngenta MENAF product page lists 0.6% indoxacarb. A visible mismatch should be clarified before purchase.',
        safeLanguage: 'Mismatch found. Request clarification before purchase.',
      },
      {
        severity: 'low',
        title: 'The offer relies on price alone',
        detail: 'An unusually low price is a reason to ask for source evidence, not a conclusion about the item.',
        safeLanguage: 'More proof is needed before purchase.',
      },
    ],
    faqs: [
      {
        q: 'Who manufactures Advion Cockroach Gel Bait?',
        a: 'The official UAE safety data sheet linked by Syngenta PPM MENAF names Syngenta Crop Protection AG in Basel, Switzerland.',
      },
      {
        q: 'What is the active ingredient in Advion Cockroach Gel Bait?',
        a: 'The official Syngenta MENAF product page lists a 0.6% indoxacarb composition.',
      },
      {
        q: 'Which UAE distributor reference did TIP find?',
        a: 'Syngenta PPM MENAF lists Agricultural Materials Company and visibly associates Advion Cockroach Gel Bait with that distributor record.',
      },
      {
        q: 'How can I check Advion before buying online?',
        a: 'Compare the exact product name, 0.6% indoxacarb composition, official UAE label, visible batch or expiry details where present, distributor or importer sticker, and seller invoice. Contact Syngenta or the listed distributor when more proof is needed.',
      },
      {
        q: 'Does TIP certify product authenticity?',
        a: 'No. TIP organizes public source information and buyer checkpoints. Final verification should come from the manufacturer, distributor, seller invoice, or relevant authority.',
      },
    ],
  },
];

export const getTipProduct = (slug) =>
  tipProducts.find((product) => product.slug === slug);

