export type NavItem = {
  href: string;
  label: string;
};

export type GrowthLinkCard = {
  title: string;
  description: string;
  href: string;
  eyebrow?: string;
  metadata?: string;
};

export type GrowthFrameworkLayer = {
  title: string;
  description: string;
};

export type GrowthOffer = {
  title: string;
  description: string;
  href: string;
  eyebrow: string;
};

export type GrowthProofBlock = {
  title: string;
  description: string;
  href: string;
  eyebrow: string;
};

export type GrowthResource = {
  title: string;
  description: string;
  status: string;
  href: string;
  metadata?: string;
};

export type GrowthTemplate = {
  slug: string;
  category: string;
  name: string;
  summary: string;
  format: string;
  href: string;
  audience: string;
  relatedHref: string;
};

export type GrowthApproachStep = {
  title: string;
  description: string;
};

export type GrowthPage = {
  slug: string;
  navLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  outcome: string;
  problem: string[];
  approachIntro: string;
  approach: GrowthApproachStep[];
  includes: string[];
  whoItsFor: string[];
  mistakes: string[];
  deliverables: string[];
  relatedSlugs: string[];
};

export const growthBasePath = '/restaurant-cafe-growth-systems';
export const growthAuditPath = `${growthBasePath}/growth-audit/`;
export const growthTemplatesPath = `${growthBasePath}/templates/`;
export const growthToolkitBundlePath = '/downloads/restaurant-growth/restaurant-growth-toolkit-pack.zip';

export const growthBusinessTypes: GrowthLinkCard[] = [
  {
    eyebrow: 'Business type',
    title: 'Single Outlet',
    description: 'For founder-led stores that need sharper local demand, better repeat behavior, and clearer commercial focus.',
    href: `${growthBasePath}/local-store-marketing/`,
    metadata: 'Best next page: Local marketing',
  },
  {
    eyebrow: 'Business type',
    title: 'Cafe Brand',
    description: 'For premium or everyday cafe concepts that need stronger identity, content discipline, and daypart growth.',
    href: `${growthBasePath}/brand-strategy/`,
    metadata: 'Best next page: Brand strategy',
  },
  {
    eyebrow: 'Business type',
    title: 'QSR / Fast Casual',
    description: 'For brands balancing speed, consistency, throughput, offer structure, and paid media efficiency.',
    href: `${growthBasePath}/performance-marketing/`,
    metadata: 'Best next page: Performance marketing',
  },
  {
    eyebrow: 'Business type',
    title: 'Multi-Outlet Chain',
    description: 'For operators who need a system that works branch by branch, not just one strong flagship store.',
    href: `${growthBasePath}/chain-franchise-marketing/`,
    metadata: 'Best next page: Chain systems',
  },
  {
    eyebrow: 'Business type',
    title: 'Cloud Kitchen',
    description: 'For delivery-first brands where aggregator visibility, menu architecture, and retention decide margin quality.',
    href: `${growthBasePath}/delivery-aggregator-marketing/`,
    metadata: 'Best next page: Delivery growth',
  },
  {
    eyebrow: 'Business type',
    title: 'Franchise Brand',
    description: 'For franchise-led growth models that need central control, local activation, and repeatable rollout standards.',
    href: `${growthBasePath}/chain-franchise-marketing/`,
    metadata: 'Best next page: Franchise marketing',
  },
];

export const growthBusinessStages: GrowthLinkCard[] = [
  {
    eyebrow: 'Business stage',
    title: 'Launching a new brand',
    description: 'Clarify concept, positioning, launch mechanics, and the first commercial story the market will hear.',
    href: `${growthBasePath}/brand-strategy/`,
  },
  {
    eyebrow: 'Business stage',
    title: 'Opening a new outlet',
    description: 'Build pre-launch buzz, local awareness, and a first-30-day plan that protects momentum after opening week.',
    href: `${growthBasePath}/store-launch-marketing/`,
  },
  {
    eyebrow: 'Business stage',
    title: 'Fixing weak footfall',
    description: 'Tighten trade-area logic, demand capture, and local campaigns before defaulting to discounting.',
    href: `${growthBasePath}/local-store-marketing/`,
  },
  {
    eyebrow: 'Business stage',
    title: 'Improving delivery sales',
    description: 'Strengthen aggregator visibility, offer logic, thumbnails, packaging, and repeat-order mechanics.',
    href: `${growthBasePath}/delivery-aggregator-marketing/`,
  },
  {
    eyebrow: 'Business stage',
    title: 'Building a stronger brand',
    description: 'Sharpen differentiation so every campaign, menu launch, and store experience carries the same memory structure.',
    href: `${growthBasePath}/brand-strategy/`,
  },
  {
    eyebrow: 'Business stage',
    title: 'Increasing repeat business',
    description: 'Use CRM, loyalty, and post-purchase journeys to turn one-time buyers into a known customer base.',
    href: `${growthBasePath}/crm-loyalty-retention/`,
  },
  {
    eyebrow: 'Business stage',
    title: 'Scaling across locations',
    description: 'Standardize the operating model behind campaigns, offers, asset rollout, and branch-level measurement.',
    href: `${growthBasePath}/chain-franchise-marketing/`,
  },
  {
    eyebrow: 'Business stage',
    title: 'Standardizing franchise marketing',
    description: 'Protect the brand while giving local operators enough room to execute against their own demand reality.',
    href: `${growthBasePath}/chain-franchise-marketing/`,
  },
];

export const growthFrameworkLayers: GrowthFrameworkLayer[] = [
  {
    title: 'Positioning',
    description: 'Define what the brand should be remembered for, which customer it serves best, and where it must win in the market.',
  },
  {
    title: 'Brand',
    description: 'Turn the concept into a consistent identity system across naming, tone, packaging, in-store cues, and campaign language.',
  },
  {
    title: 'Menu & Offers',
    description: 'Shape hero items, value architecture, bundles, and promotions so the menu sells with margin awareness, not guesswork.',
  },
  {
    title: 'Traffic',
    description: 'Build store demand through local trade-area strategy, Maps intent capture, paid media, and on-the-ground activation.',
  },
  {
    title: 'Delivery',
    description: 'Treat aggregator platforms as a managed commercial channel with clear visibility, offer, packaging, and repeat logic.',
  },
  {
    title: 'Content',
    description: 'Create repeatable creative systems that keep the brand visible without reducing the business to constant promotion.',
  },
  {
    title: 'Retention',
    description: 'Use CRM, loyalty, and frequency mechanics to lift repeat revenue and reduce dependence on new-customer acquisition.',
  },
  {
    title: 'Measurement',
    description: 'Track the numbers that actually help an operator decide what to open, cut, scale, push, or fix next.',
  },
];

export const growthTemplates: GrowthTemplate[] = [
  {
    slug: 'restaurant-brand-positioning-brief',
    category: 'Strategy brief',
    name: 'Restaurant brand positioning brief',
    summary:
      'A boardroom-grade brand clarity workbook. Brand canvas, personas, competitor matrix, proof points, weighted brand-clarity score (0–100), section health flags, audit checks, scenarios, and action plan. Built so a third party can read your positioning and stress-test it.',
    format: 'Excel · v3 · investor-ready',
    href: '/downloads/restaurant-growth/restaurant-brand-positioning-brief.xlsx',
    audience:
      'Founder-led cafes, new concepts, and operators repositioning a store that feels commercially active but strategically vague.',
    relatedHref: `${growthBasePath}/brand-strategy/`,
  },
  {
    slug: 'annual-restaurant-marketing-plan',
    category: 'Annual plan',
    name: 'Annual restaurant marketing plan',
    summary:
      'A strategic 12-month operating plan: initiatives by month, channel, owner, objective, KPI, and readiness %. Rolls up to channel mix, objective mix, monthly load, and a single plan-readiness score. Pairs cleanly with the Annual Marketing Budget Planner for spend tracking.',
    format: 'Excel · v3 · investor-ready',
    href: '/downloads/restaurant-growth/annual-restaurant-marketing-plan.xlsx',
    audience:
      'Operators who need a proper 12-month marketing rhythm instead of a reactive list of ad hoc promotions.',
    relatedHref: `${growthBasePath}/restaurant-marketing-plan/`,
  },
  {
    slug: 'restaurant-promotion-tracker',
    category: 'Tracker',
    name: 'Restaurant promotion tracker',
    summary:
      'Per-promotion governance with matched-period baseline, incremental revenue, cannibalisation %, gross profit, net contribution after promo cost, and contribution ROI. Auto-flags WIN, HOLD, and KILL candidates so margin stops being subsidised by existing demand.',
    format: 'Excel · v3 · investor-ready',
    href: '/downloads/restaurant-growth/restaurant-promotion-tracker.xlsx',
    audience:
      'Restaurant teams running recurring offers, bundle pushes, daypart campaigns, or seasonal activations that need a commercial feedback loop.',
    relatedHref: `${growthBasePath}/restaurant-marketing-plan/`,
  },
  {
    slug: 'cafe-content-calendar',
    category: 'Content system',
    name: 'Cafe content calendar',
    summary:
      'A content operations system with pillars, formats, platforms, owners, approvers, production status, and post-publish performance. Rolls up to per-pillar reach, per-platform engagement, top performers, and pipeline health — so the calendar stops drying out at week 3.',
    format: 'Excel · v3 · investor-ready',
    href: '/downloads/restaurant-growth/cafe-content-calendar.xlsx',
    audience:
      'Cafe and restaurant teams who want content to feel like a repeatable system rather than last-minute posting pressure.',
    relatedHref: `${growthBasePath}/social-content-systems/`,
  },
  {
    slug: 'annual-marketing-budget-planner',
    category: 'Budgeting',
    name: 'Annual marketing budget planner',
    summary:
      'A finance-grade budget control model: planned vs actual by month and channel, variance, utilisation, blended ROAS, and contribution-margin ROI. Surfaces overspend before it gets out of hand and gives a CFO the channel-mix and monthly-burn views they will ask for.',
    format: 'Excel · v3 · investor-ready',
    href: '/downloads/restaurant-growth/annual-marketing-budget-planner.xlsx',
    audience:
      'Founders, marketing managers, and multi-unit teams who need budget discipline before channel spend starts drifting.',
    relatedHref: `${growthBasePath}/restaurant-marketing-plan/`,
  },
  {
    slug: 'marketing-roi-calculator',
    category: 'Measurement',
    name: 'Marketing ROI calculator',
    summary:
      'Campaign-level ROI: per-row CAC, ROAS, payback, contribution-margin ROI, plus an LTV/CAC table, an automatic kill-list of unprofitable campaigns, and a 2-D sensitivity heatmap on AOV × gross margin. The model a marketing lead uses to defend spend to finance.',
    format: 'Excel · v3 · investor-ready',
    href: '/downloads/restaurant-growth/marketing-roi-calculator.xlsx',
    audience:
      'Operators who want to review campaign economics like a commercial lead, not just celebrate impressions and traffic.',
    relatedHref: `${growthBasePath}/performance-marketing/`,
  },
  {
    slug: 'store-launch-marketing-checklist',
    category: 'Launch',
    name: 'Store launch marketing checklist',
    summary:
      'A launch control tower across 5 phases (pre-launch 90-30 / 30-7, launch week, post-launch wk 1-4, month 2-3) and 13 workstreams (permits, landlord, fit-out, hiring, brand, local marketing, digital, PR, CRM, aggregator, ops, day-1 trade plan). Risk register + GO / NO-GO score.',
    format: 'Excel · v3 · investor-ready',
    href: '/downloads/restaurant-growth/store-launch-marketing-checklist.xlsx',
    audience:
      'Teams opening a new outlet that need launch control across digital, local, and in-store activation before the first month slips away.',
    relatedHref: `${growthBasePath}/store-launch-marketing/`,
  },
  {
    slug: 'local-store-marketing-planner',
    category: 'Local marketing',
    name: 'Local store marketing planner',
    summary:
      'Maps trade-area clusters (offices, residential, schools, malls, hospitals, transport, hotels) and assigns hyperlocal tactics. Per-tactic CAC and contribution, per-cluster rollup, and a single management view of where local marketing is paying back vs leaking budget.',
    format: 'Excel · v3 · investor-ready',
    href: '/downloads/restaurant-growth/local-store-marketing-planner.xlsx',
    audience:
      'Single-outlet stores and branch marketers who need a sharper local demand plan than “boost a few posts and hope”.',
    relatedHref: `${growthBasePath}/local-store-marketing/`,
  },
  {
    slug: 'menu-launch-and-offer-planner',
    category: 'Menu & offers',
    name: 'Menu launch and offer planner',
    summary:
      'Per-item profitability with net price after promo, gross margin, contribution net of cannibalisation, breakeven units, weeks-to-breakeven. Auto-classifies items using the menu-engineering matrix (STAR / WORKHORSE / PUZZLE / DOG) and recommends an action per item.',
    format: 'Excel · v3 · investor-ready',
    href: '/downloads/restaurant-growth/menu-launch-and-offer-planner.xlsx',
    audience:
      'Operators and marketers launching new items or seasonal offers who need margin, storytelling, and rollout assets aligned.',
    relatedHref: `${growthBasePath}/menu-engineering/`,
  },
  {
    slug: 'delivery-aggregator-audit',
    category: 'Delivery',
    name: 'Delivery & aggregator audit',
    summary:
      'Per-platform per-store audit across 8 dimensions (menu visibility, photography, rating, delivery time, discount, commission, cancel, AOV). Single 0-100 score, monthly economics net of commission and discount, and per-listing WIN / HOLD / FIX / CRITICAL verdict.',
    format: 'Excel · v3 · investor-ready',
    href: '/downloads/restaurant-growth/delivery-aggregator-audit.xlsx',
    audience:
      'Delivery-first brands and multi-channel stores that need to improve aggregator quality without wrecking channel contribution.',
    relatedHref: `${growthBasePath}/delivery-aggregator-marketing/`,
  },
  {
    slug: 'crm-loyalty-campaign-planner',
    category: 'CRM & loyalty',
    name: 'CRM & loyalty campaign planner',
    summary:
      'RFM-style segments (Champion, Loyal, At-risk, Lapsed, Hibernating, New) combined with a per-campaign returns calculator. Surfaces value concentration, inactivity risk, programme ROI, and which lifecycle moments actually compound — so you stop subsidising the inactive.',
    format: 'Excel · v3 · investor-ready',
    href: '/downloads/restaurant-growth/crm-loyalty-campaign-planner.xlsx',
    audience:
      'Restaurant teams trying to increase repeat visits with better segmentation, timing, and campaign accountability.',
    relatedHref: `${growthBasePath}/crm-loyalty-retention/`,
  },
  {
    slug: 'google-business-profile-checklist',
    category: 'Local SEO',
    name: 'Google Business Profile checklist',
    summary:
      '30 weighted audit items across 10 categories (basics, hours, categories, photography, posts, reviews, Q&A, menu, local-pack signals, tracking). Category scores + overall GBP audit score + action callouts so a multi-location brand can drive local without guessing.',
    format: 'Excel · v3 · investor-ready',
    href: '/downloads/restaurant-growth/google-business-profile-checklist.xlsx',
    audience:
      'Independent operators and multi-store teams who need store discovery, map visibility, and profile governance handled properly.',
    relatedHref: `${growthBasePath}/google-business-profile-local-seo/`,
  },
  {
    slug: 'franchise-campaign-rollout-tracker',
    category: 'Franchise rollout',
    name: 'Franchise campaign rollout tracker',
    summary:
      'Per-store deployment audit across 8 checkpoints (assets received, brief signed, launch date set, signage, PR, aggregator, CRM, local promo). Per-store readiness score, per-region rollup, per-checkpoint compliance, and a single GO / NO-GO programme score.',
    format: 'Excel · v3 · investor-ready',
    href: '/downloads/restaurant-growth/franchise-campaign-rollout-tracker.xlsx',
    audience:
      'Franchise-led and multi-unit brands trying to keep central campaign control without losing local execution quality.',
    relatedHref: `${growthBasePath}/chain-franchise-marketing/`,
  },
  {
    slug: 'restaurant-kpi-dashboard-template',
    category: 'Dashboard',
    name: 'Restaurant KPI dashboard template',
    summary:
      '13-week weekly performance pack. 12 KPIs (sales, transactions, AOV, footfall conv, delivery mix, prime cost, gross margin, marketing %, repeat rate, complaints) vs target, with a weighted operating health score (0-100) — the single number a CEO or board reviews.',
    format: 'Excel · v3 · investor-ready',
    href: '/downloads/restaurant-growth/restaurant-kpi-dashboard-template.xlsx',
    audience:
      'Operators and growth leads who need one management view of demand, retention, and channel performance across the trading week.',
    relatedHref: `${growthBasePath}/dashboards-kpis/`,
  },
  {
    slug: 'weekly-flash-report-template',
    category: 'CEO weekly pack',
    name: 'Weekly flash report',
    summary:
      'A one-page CEO / investor weekly pack. This week vs target, sales WoW, top + bottom store movers, blended marketing ROAS, four CEO call-outs, plus a structured slot for risks and opportunities so the weekly review is disciplined, not anecdotal.',
    format: 'Excel · v3 · investor-ready',
    href: '/downloads/restaurant-growth/weekly-flash-report-template.xlsx',
    audience:
      'Founders, CEOs, CFOs, operators, and investors running a weekly performance cadence — single-store or multi-unit.',
    relatedHref: `${growthBasePath}/dashboards-kpis/`,
  },
];

const featuredTemplateSlugs = [
  'restaurant-kpi-dashboard-template',
  'weekly-flash-report-template',
  'marketing-roi-calculator',
  'annual-marketing-budget-planner',
  'annual-restaurant-marketing-plan',
  'restaurant-promotion-tracker',
  'cafe-content-calendar',
  'store-launch-marketing-checklist',
  'delivery-aggregator-audit',
  'crm-loyalty-campaign-planner',
  'google-business-profile-checklist',
];

export const growthResources: GrowthResource[] = featuredTemplateSlugs
  .map((slug) => growthTemplates.find((template) => template.slug === slug))
  .filter((template): template is GrowthTemplate => Boolean(template))
  .map((template) => ({
    title: template.name,
    description: template.summary,
    status: `${template.category} / ${template.format}`,
    href: `${growthTemplatesPath}#${template.slug}`,
    metadata: 'Open template library',
  }));

export const growthProofBlocks: GrowthProofBlock[] = [
  {
    eyebrow: 'Thought piece',
    title: 'Why restaurants do not have a traffic problem first',
    description: 'Many brands blame low demand when the deeper issue is unclear positioning, weak offer architecture, or an experience that does not repeat.',
    href: `${growthBasePath}/brand-strategy/`,
  },
  {
    eyebrow: 'Operator lens',
    title: 'Delivery volume can hide bad channel economics',
    description: 'Growth looks impressive until packaging, discounts, and aggregator dependence turn a busy dashboard into weak contribution.',
    href: `${growthBasePath}/delivery-aggregator-marketing/`,
  },
  {
    eyebrow: 'Framework',
    title: 'A launch plan is not an opening weekend poster',
    description: 'The real work begins before launch day and continues through the first 30 days, when habits and local memory are still forming.',
    href: `${growthBasePath}/store-launch-marketing/`,
  },
  {
    eyebrow: 'Commercial truth',
    title: 'Retention is what makes paid media survivable',
    description: 'If every campaign is forced to reacquire demand from zero, the business becomes fragile long before the ads stop working.',
    href: `${growthBasePath}/crm-loyalty-retention/`,
  },
];

export const growthOffers: GrowthOffer[] = [
  {
    eyebrow: 'Low-friction',
    title: 'Strategy call',
    description: 'A focused conversation to identify the highest-leverage gap across brand, traffic, delivery, or retention.',
    href: `${growthAuditPath}#strategy-call`,
  },
  {
    eyebrow: 'Mid-intent',
    title: 'Growth audit',
    description: 'A structured review of positioning, channel mix, local demand capture, and commercial leaks.',
    href: `${growthAuditPath}#growth-audit`,
  },
  {
    eyebrow: 'Mid-intent',
    title: '90-day growth plan',
    description: 'A practical roadmap covering priorities, campaigns, store actions, channel mix, and measurement.',
    href: `${growthAuditPath}#ninety-day-plan`,
  },
  {
    eyebrow: 'High-intent',
    title: 'Fractional CMO advisory',
    description: 'Ongoing leadership for brands that need operator-aware marketing direction without a full internal headcount.',
    href: `${growthAuditPath}#fractional-cmo`,
  },
];

export const growthPages: GrowthPage[] = [
  {
    slug: 'brand-strategy',
    navLabel: 'Brand',
    eyebrow: 'Brand Strategy',
    title: 'Brand Strategy for Restaurants & Cafes',
    description: 'Positioning, concept clarity, and brand systems for restaurant and cafe operators who need a sharper reason to be chosen.',
    metaTitle: 'Brand Strategy for Restaurants & Cafes',
    metaDescription: 'Operator-aware brand strategy for cafes, QSRs, and restaurant brands covering positioning, identity, concept clarity, and consistency.',
    outcome: 'Clarify what the brand stands for so campaigns, stores, packaging, and offers stop pulling in different directions.',
    problem: [
      'Many restaurant brands look active but feel interchangeable. They post often, run offers, and launch items, yet the customer still cannot describe what the brand is really for.',
      'When positioning is weak, everything downstream gets harder: local marketing becomes noisier, creative becomes inconsistent, pricing loses confidence, and expansion multiplies confusion instead of recognition.',
    ],
    approachIntro: 'This work starts by defining the memory structure the brand should own, then translating that into practical brand rules teams can actually execute.',
    approach: [
      {
        title: 'Define the commercial position',
        description: 'Clarify concept, audience, daypart role, price perception, and the category job the brand must win.',
      },
      {
        title: 'Build the verbal and visual spine',
        description: 'Align naming logic, tone of voice, key messages, identity cues, and packaging direction around one clear promise.',
      },
      {
        title: 'Match brand to operating reality',
        description: 'Make sure the brand story is supportable by service style, throughput, menu mix, and location economics.',
      },
      {
        title: 'Turn strategy into usage rules',
        description: 'Create working guidance for campaigns, launches, store assets, menus, and social content so consistency survives scale.',
      },
    ],
    includes: [
      'Concept and positioning review',
      'Audience and demand-shape definition',
      'Brand story, tone, and message pillars',
      'Identity consistency inputs across store, packaging, and content',
      'Differentiation guidance against direct local competition',
    ],
    whoItsFor: [
      'Founders launching a new cafe or restaurant concept',
      'Operators whose brand feels generic or diluted',
      'Premium cafe brands refining their voice and identity',
      'Multi-unit businesses preparing the brand for scale',
    ],
    mistakes: [
      'Treating rebranding as a substitute for fixing positioning',
      'Copying category language that every competitor already uses',
      'Building aesthetics before clarifying commercial role',
      'Letting campaigns redefine the brand every month',
    ],
    deliverables: [
      'Brand positioning memo',
      'Audience and category map',
      'Message and tone framework',
      'Identity consistency checklist',
      'Campaign and launch usage rules',
    ],
    relatedSlugs: ['restaurant-marketing-plan', 'store-launch-marketing', 'social-content-systems'],
  },
  {
    slug: 'restaurant-marketing-plan',
    navLabel: 'Plan',
    eyebrow: 'Marketing Plan',
    title: 'Restaurant Marketing Plan',
    description: 'A commercial marketing plan that connects brand, promotions, channels, spend, and store realities into one operating rhythm.',
    metaTitle: 'Restaurant Marketing Plan',
    metaDescription: 'Build a restaurant marketing plan with campaign architecture, budget logic, monthly planning, offers, channels, and KPIs.',
    outcome: 'Replace scattered tactics with a clear annual and monthly growth system that the business can actually run.',
    problem: [
      'Most restaurant marketing plans are just activity lists. They mention social media, ads, and promotions, but they do not explain what each channel should do, what budget logic holds, or how store-level actions connect to revenue.',
      'That creates a cycle of reactive campaigns, last-minute offers, and reporting that describes activity instead of decision quality.',
    ],
    approachIntro: 'The plan is built like an operating system, not a presentation deck. It maps objectives, timing, channels, offers, and KPIs into a repeatable planning cadence.',
    approach: [
      {
        title: 'Set the commercial priorities',
        description: 'Decide whether the next phase is about awareness, launch, footfall recovery, delivery quality, repeat business, or expansion support.',
      },
      {
        title: 'Design the channel mix',
        description: 'Assign clear jobs to Meta, Google, Maps, content, CRM, local activity, and in-store merchandising.',
      },
      {
        title: 'Build the campaign calendar',
        description: 'Create a working monthly structure for hero campaigns, recurring offers, seasonal moments, and product launches.',
      },
      {
        title: 'Tie spend to outcomes',
        description: 'Use budget logic and KPI guardrails so the plan can survive scrutiny from founders and operators.',
      },
    ],
    includes: [
      'Annual and quarterly planning structure',
      'Monthly campaign and content rhythm',
      'Offer architecture and promotional calendar',
      'Budget logic by channel and objective',
      'KPI and reporting framework',
    ],
    whoItsFor: [
      'Founders who need a clearer marketing operating system',
      'Brand teams preparing a more disciplined annual plan',
      'Multi-store operators aligning store and central activity',
      'Businesses moving beyond random monthly campaigns',
    ],
    mistakes: [
      'Planning channels before clarifying the commercial objective',
      'Running discounts without an offer architecture',
      'Treating monthly planning as creative brainstorming only',
      'Measuring campaign activity instead of business effect',
    ],
    deliverables: [
      'Restaurant marketing plan framework',
      'Channel-role matrix',
      'Offer and campaign calendar',
      'Budget allocation model',
      'Monthly KPI dashboard structure',
    ],
    relatedSlugs: ['performance-marketing', 'social-content-systems', 'dashboards-kpis'],
  },
  {
    slug: 'store-launch-marketing',
    navLabel: 'Launch',
    eyebrow: 'Store Launch',
    title: 'Store Launch & Grand Opening Marketing',
    description: 'Pre-launch, opening-week, and first-30-day marketing systems for restaurants and cafes opening a new store.',
    metaTitle: 'Store Launch Marketing for Restaurants',
    metaDescription: 'Plan a restaurant or cafe launch with pre-opening buzz, local outreach, opening offers, UGC, and first-30-day momentum.',
    outcome: 'Turn a store opening into durable local momentum instead of a one-week spike that disappears after launch.',
    problem: [
      'Too many launches are reduced to a poster, an opening offer, and a hope that influencers show up. The result is noise on opening week and weak habit formation afterward.',
      'A new store needs more than awareness. It needs local relevance, operational readiness, and a first-month plan that keeps repeat visits moving after the opening photos are gone.',
    ],
    approachIntro: 'The launch system is built in three parts: pre-launch anticipation, opening-week visibility, and first-30-day repeat behavior.',
    approach: [
      {
        title: 'Prime the local market',
        description: 'Use community outreach, local partnerships, Maps readiness, and audience building before the doors open.',
      },
      {
        title: 'Coordinate launch signals',
        description: 'Align signage, opening offers, content, influencer attendance, and staff briefing around the same message.',
      },
      {
        title: 'Capture the first wave properly',
        description: 'Turn launch traffic into reviews, UGC, CRM opt-ins, and remarketing pools while interest is highest.',
      },
      {
        title: 'Manage the first 30 days',
        description: 'Keep momentum alive through local campaigns, retargeting, email or WhatsApp follow-up, and store-level programming.',
      },
    ],
    includes: [
      'Pre-launch marketing checklist',
      'Opening-week campaign structure',
      'Community and local influencer outreach',
      'Google Business Profile readiness',
      'First-30-day store activation plan',
    ],
    whoItsFor: [
      'New restaurant and cafe concepts preparing for launch',
      'Existing brands opening another outlet',
      'Marketing teams supporting expansion',
      'Operators who need launch discipline, not just launch buzz',
    ],
    mistakes: [
      'Starting launch promotion too late',
      'Treating opening day as the whole launch strategy',
      'Running offers without capturing repeat intent',
      'Ignoring signage, Maps, reviews, and in-store conversion',
    ],
    deliverables: [
      'Launch timeline and responsibilities',
      'Opening offer framework',
      'Community and influencer plan',
      'UGC and content capture plan',
      'First-30-day retention actions',
    ],
    relatedSlugs: ['local-store-marketing', 'social-content-systems', 'google-business-profile-local-seo'],
  },
  {
    slug: 'local-store-marketing',
    navLabel: 'Local',
    eyebrow: 'Local Store Marketing',
    title: 'Local Store Marketing',
    description: 'Trade-area strategy, hyperlocal campaigns, and store-specific demand generation for restaurants and cafes.',
    metaTitle: 'Local Store Marketing for Restaurants',
    metaDescription: 'Improve restaurant footfall with trade-area strategy, hyperlocal ads, local partnerships, and store-specific campaigns.',
    outcome: 'Build repeatable store-level momentum by matching each branch to the people, routines, and traffic patterns around it.',
    problem: [
      'Weak footfall is often blamed on creative or ad spend when the deeper issue is that the store is not being marketed against its actual trade area.',
      'A residential branch, office corridor, mall unit, petrol station stop, and high-street cafe all need different local demand logic. Treating them the same wastes budget and weakens momentum.',
    ],
    approachIntro: 'Local store marketing starts with the branch reality: who passes, who pauses, who orders nearby, and what makes that location relevant enough to repeat.',
    approach: [
      {
        title: 'Map the trade area',
        description: 'Identify residential, office, school, mall, commuter, or convenience demand and how each zone behaves by daypart.',
      },
      {
        title: 'Build local demand plays',
        description: 'Create offers, partnerships, and community hooks that suit the branch instead of copying national campaigns blindly.',
      },
      {
        title: 'Use hyperlocal media well',
        description: 'Run geo-targeted Meta and Google activity around real catchment logic, not arbitrary radius targeting.',
      },
      {
        title: 'Track branch-level response',
        description: 'Measure the store effect in footfall, map views, direct traffic, and repeat behavior so local action can improve over time.',
      },
    ],
    includes: [
      'Trade-area diagnosis',
      'Branch-specific campaign angles',
      'Local partnership and community ideas',
      'Hyperlocal paid media structure',
      'Store-level measurement and review cadence',
    ],
    whoItsFor: [
      'Single outlets trying to fix weak footfall',
      'Cafe brands with neighborhood-level competition',
      'Multi-store operators with uneven branch performance',
      'Expansion teams opening into new micro-markets',
    ],
    mistakes: [
      'Using the same campaign logic for every branch',
      'Targeting too broadly and calling it local marketing',
      'Ignoring branch-specific daypart behavior',
      'Defaulting to discounts before understanding the catchment',
    ],
    deliverables: [
      'Trade-area summary',
      'Store marketing playbook',
      'Local partnership list',
      'Geo-targeting recommendation',
      'Branch performance review checklist',
    ],
    relatedSlugs: ['store-launch-marketing', 'performance-marketing', 'google-business-profile-local-seo'],
  },
  {
    slug: 'performance-marketing',
    navLabel: 'Performance',
    eyebrow: 'Performance Marketing',
    title: 'Performance Marketing for Restaurant Brands',
    description: 'Meta, Google, Maps, and retargeting systems built for store traffic, direct demand, and smarter restaurant media decisions.',
    metaTitle: 'Performance Marketing for Restaurant Brands',
    metaDescription: 'Restaurant performance marketing across Meta, Google Search, Maps, branded demand, retargeting, and conversion strategy.',
    outcome: 'Make paid media answer a real commercial job instead of becoming a permanent spend line with blurry outcomes.',
    problem: [
      'Restaurants often run paid media without clarity on whether the job is awareness, maps intent, delivery orders, reservations, or local store visits. That makes reporting noisy and optimization shallow.',
      'The result is overbroad targeting, weak landing logic, and campaigns that claim performance while the actual store or ordering behavior barely changes.',
    ],
    approachIntro: 'Performance marketing works best when channel role, audience, and conversion path are defined against the business model, not against platform defaults.',
    approach: [
      {
        title: 'Match media to the real objective',
        description: 'Separate awareness, branded demand capture, local store traffic, and order conversion so each campaign is judged properly.',
      },
      {
        title: 'Build better intent structure',
        description: 'Use branded vs generic search, Maps visibility, remarketing pools, and offer-led creative with discipline.',
      },
      {
        title: 'Strengthen conversion paths',
        description: 'Reduce friction between ad click and action through better landing pages, order logic, store pages, and retargeting flows.',
      },
      {
        title: 'Optimize with commercial context',
        description: 'Judge campaigns against CAC, repeat behavior, order quality, and store-level reality instead of CTR alone.',
      },
    ],
    includes: [
      'Meta and Google campaign architecture',
      'Maps and branded search capture',
      'Audience and remarketing logic',
      'Offer-led creative direction',
      'Measurement guidance tied to business outcomes',
    ],
    whoItsFor: [
      'Restaurant brands already spending on paid media',
      'QSR and fast casual operators needing clearer media discipline',
      'Multi-unit businesses balancing local and central spend',
      'Founders who want sharper visibility into what ads should actually do',
    ],
    mistakes: [
      'Running traffic campaigns without a strong conversion path',
      'Mixing awareness and performance objectives in one campaign',
      'Ignoring branded demand capture and Maps intent',
      'Optimizing for vanity metrics instead of commercial quality',
    ],
    deliverables: [
      'Paid media role map',
      'Campaign structure by objective',
      'Audience and remarketing plan',
      'Landing and conversion recommendations',
      'Performance review scorecard',
    ],
    relatedSlugs: ['local-store-marketing', 'restaurant-marketing-plan', 'dashboards-kpis'],
  },
  {
    slug: 'social-content-systems',
    navLabel: 'Content',
    eyebrow: 'Social Content Systems',
    title: 'Social Media & Content Systems',
    description: 'Content planning, reels logic, menu storytelling, and creative systems that keep restaurants visible without becoming generic.',
    metaTitle: 'Social Media & Content Systems',
    metaDescription: 'Build restaurant social content systems with reels, menu storytelling, UGC, campaign planning, and monthly structure.',
    outcome: 'Turn content into a repeatable brand system that supports launches, local relevance, and demand generation.',
    problem: [
      'Restaurant social content often swings between two extremes: endless random posting or highly polished campaigns that are impossible to sustain.',
      'Without a system, teams either become promotion-heavy and forget the brand, or stay too aesthetic and fail to move real customer behavior.',
    ],
    approachIntro: 'The goal is not to post more. It is to create a content operating system with clear pillars, formats, and campaign jobs.',
    approach: [
      {
        title: 'Define the content pillars',
        description: 'Balance menu heroes, founder and brand story, store moments, UGC, product launches, and promotional pushes.',
      },
      {
        title: 'Design platform-native formats',
        description: 'Build reels, short-form edits, static carousels, and story sequences around how hospitality content actually gets consumed.',
      },
      {
        title: 'Coordinate content with campaigns',
        description: 'Align organic content to launches, local activity, paid media, and CRM instead of treating social as a separate universe.',
      },
      {
        title: 'Keep the system operationally realistic',
        description: 'Use a production rhythm the team can maintain, including shoot logic, approvals, and monthly planning.',
      },
    ],
    includes: [
      'Content pillar framework',
      'Reels and video direction',
      'Monthly content planning structure',
      'UGC and community management guidance',
      'Promotional vs brand-content balance',
    ],
    whoItsFor: [
      'Cafe brands building a stronger content presence',
      'Restaurant teams tired of reactive posting',
      'Brands launching items and campaigns more regularly',
      'Operators who want social to support growth, not just aesthetics',
    ],
    mistakes: [
      'Posting without clear content roles',
      'Making every post promotional',
      'Ignoring menu storytelling and daypart relevance',
      'Relying on one content style for every platform',
    ],
    deliverables: [
      'Content system blueprint',
      'Monthly planning cadence',
      'Creative format guide',
      'UGC and community rules',
      'Campaign-content integration map',
    ],
    relatedSlugs: ['brand-strategy', 'restaurant-marketing-plan', 'store-launch-marketing'],
  },
  {
    slug: 'menu-engineering',
    navLabel: 'Menu',
    eyebrow: 'Menu Engineering',
    title: 'Menu Engineering & Merchandising',
    description: 'Hero-item strategy, bundles, menu psychology, and value architecture for restaurants, cafes, and delivery-first brands.',
    metaTitle: 'Menu Engineering for Restaurants',
    metaDescription: 'Improve menu engineering with hero items, bundling, menu psychology, seasonal launches, upsells, and value architecture.',
    outcome: 'Make the menu sell with clearer pricing logic, stronger hero items, and better margin-aware customer decisions.',
    problem: [
      'Many menus are designed item by item instead of as a commercial system. The customer sees too much noise, the team pushes the wrong items, and the business underuses its best sellers.',
      'Weak merchandising also shows up in delivery, where thumbnail order, naming, bundles, and offer stacking can dramatically change performance.',
    ],
    approachIntro: 'Menu engineering is treated here as part psychology, part commercial design, and part operational realism.',
    approach: [
      {
        title: 'Identify the hero economics',
        description: 'Spot the items that should lead perception, traffic, margin, or repeat behavior and give each a clear role.',
      },
      {
        title: 'Improve value architecture',
        description: 'Use bundles, anchors, naming, and price ladders to shape customer decisions without making the offer confusing.',
      },
      {
        title: 'Strengthen menu storytelling',
        description: 'Align in-store, online, and content language so hero items stay memorable across channels.',
      },
      {
        title: 'Coordinate launch and seasonal moves',
        description: 'Treat new products as campaign moments with merchandising support instead of quiet menu additions.',
      },
    ],
    includes: [
      'Hero-item mapping',
      'Bundle and upsell logic',
      'Menu psychology recommendations',
      'Seasonal and launch merchandising',
      'Delivery-menu optimization inputs',
    ],
    whoItsFor: [
      'Restaurants with crowded menus and mixed sales patterns',
      'Cafe brands wanting clearer hero products',
      'Delivery-first operators improving digital menus',
      'Teams preparing new product launches',
    ],
    mistakes: [
      'Giving every item equal visual importance',
      'Undermining premium perception with poor value architecture',
      'Launching new products without merchandising support',
      'Ignoring delivery-menu sequencing and naming',
    ],
    deliverables: [
      'Menu role map',
      'Hero and bundle recommendations',
      'Merchandising checklist',
      'Upsell architecture ideas',
      'Launch and seasonal menu plan',
    ],
    relatedSlugs: ['delivery-aggregator-marketing', 'brand-strategy', 'restaurant-marketing-plan'],
  },
  {
    slug: 'delivery-aggregator-marketing',
    navLabel: 'Delivery',
    eyebrow: 'Delivery Growth',
    title: 'Delivery & Aggregator Marketing',
    description: 'Platform visibility, offer logic, thumbnails, packaging, and repeat-order systems for delivery-first restaurant growth.',
    metaTitle: 'Delivery & Aggregator Marketing',
    metaDescription: 'Grow restaurant delivery with stronger aggregator listings, offer strategy, packaging, sponsored placements, and repeat-order systems.',
    outcome: 'Improve delivery visibility and repeat behavior without letting channel growth destroy margin discipline.',
    problem: [
      'Delivery growth can hide weak economics. High order volume looks good until discounts, commissions, packaging, and sponsored placements start eating the real contribution.',
      'At the same time, many brands underperform on aggregator platforms because the listing, naming, thumbnail order, and offer logic were never designed as a commercial system.',
    ],
    approachIntro: 'The delivery channel is treated as a managed storefront with its own merchandising, promotion, and retention logic.',
    approach: [
      {
        title: 'Fix the storefront',
        description: 'Strengthen titles, photography, thumbnails, hero items, bundles, and menu sequencing so customers choose faster and with more confidence.',
      },
      {
        title: 'Use promotions with margin awareness',
        description: 'Design offer stacking and platform deals around contribution quality, not just top-line excitement.',
      },
      {
        title: 'Improve order experience',
        description: 'Use packaging, inserts, product quality, and timing to protect repeat behavior after the first order.',
      },
      {
        title: 'Reduce blind dependence',
        description: 'Measure channel health properly and build better bridges into CRM, direct demand, or repeat platform behavior.',
      },
    ],
    includes: [
      'Aggregator listing review',
      'Thumbnail and naming optimization',
      'Offer and sponsored placement guidance',
      'Packaging and repeat-order recommendations',
      'Channel-health measurement inputs',
    ],
    whoItsFor: [
      'Cloud kitchens and delivery-first brands',
      'Restaurant groups where delivery is a large sales share',
      'Brands with strong volume but weak contribution',
      'Operators preparing a more disciplined aggregator strategy',
    ],
    mistakes: [
      'Confusing delivery sales growth with channel health',
      'Running discounts without margin logic',
      'Ignoring thumbnails, titles, and menu order',
      'Treating packaging as a cost line instead of a repeat tool',
    ],
    deliverables: [
      'Delivery growth audit',
      'Listing and offer recommendations',
      'Packaging and repeat-order actions',
      'Sponsored placement review',
      'Channel-performance scorecard',
    ],
    relatedSlugs: ['menu-engineering', 'crm-loyalty-retention', 'dashboards-kpis'],
  },
  {
    slug: 'crm-loyalty-retention',
    navLabel: 'CRM',
    eyebrow: 'Retention Systems',
    title: 'CRM, Loyalty & Retention',
    description: 'Email, WhatsApp, push, loyalty, and post-purchase systems that help restaurants and cafes lift repeat revenue.',
    metaTitle: 'CRM, Loyalty & Retention',
    metaDescription: 'Restaurant CRM and loyalty strategy covering WhatsApp, email, push, win-back flows, frequency campaigns, and repeat-order systems.',
    outcome: 'Reduce the pressure to reacquire demand from scratch by building repeat purchase mechanics into the business.',
    problem: [
      'Many restaurant brands keep spending to generate the same first visit again and again. There is no structured follow-up, no recovery of lapsed customers, and no clear reason for the guest to come back sooner.',
      'That makes acquisition more expensive and creates fragile growth, especially in categories where frequency is the real multiplier.',
    ],
    approachIntro: 'Retention here is built around commercial triggers: first purchase, launch interest, lapsed behavior, birthdays, daypart gaps, and loyalty moments.',
    approach: [
      {
        title: 'Map the key journeys',
        description: 'Define what should happen after first visit, repeat visit, inactivity, product launch, or special occasions.',
      },
      {
        title: 'Use the right channels',
        description: 'Match email, WhatsApp, SMS, or push to the customer moment instead of sending the same message everywhere.',
      },
      {
        title: 'Design better reasons to return',
        description: 'Use frequency campaigns, loyalty mechanics, and personalization with more discipline than simple blanket discounts.',
      },
      {
        title: 'Track repeat quality',
        description: 'Measure repeat rate, time-between-orders, opt-in health, and win-back performance so retention becomes manageable.',
      },
    ],
    includes: [
      'CRM journey design',
      'Loyalty and frequency campaign ideas',
      'Win-back and lapsed-customer flows',
      'Occasion and birthday mechanics',
      'Retention KPI guidance',
    ],
    whoItsFor: [
      'Brands with growing customer data but weak follow-up',
      'Cafe concepts that depend on repeat behavior',
      'Operators trying to improve lifetime value',
      'Multi-store businesses formalizing retention systems',
    ],
    mistakes: [
      'Treating CRM as broadcast only',
      'Overusing discounts instead of behavior-led campaigns',
      'Ignoring post-purchase journeys',
      'Tracking list size but not repeat quality',
    ],
    deliverables: [
      'CRM journey map',
      'Channel and message cadence',
      'Loyalty campaign framework',
      'Win-back campaign ideas',
      'Retention dashboard inputs',
    ],
    relatedSlugs: ['delivery-aggregator-marketing', 'restaurant-marketing-plan', 'dashboards-kpis'],
  },
  {
    slug: 'google-business-profile-local-seo',
    navLabel: 'SEO',
    eyebrow: 'Local Visibility',
    title: 'Google Business Profile & Local SEO',
    description: 'Store-level visibility systems for restaurants and cafes across Maps, reviews, local landing pages, and search intent.',
    metaTitle: 'Google Business Profile & Local SEO',
    metaDescription: 'Improve restaurant local SEO with Google Business Profile setup, reviews, store pages, map visibility, and local landing page strategy.',
    outcome: 'Capture high-intent local demand more reliably through stronger Maps presence, review systems, and store-specific search visibility.',
    problem: [
      'Restaurants often underuse one of their highest-intent demand channels: Google Maps and local search. Listings go stale, reviews go unmanaged, and store pages stay too thin to help real visibility.',
      'That means the brand loses intent it already earned from nearby customers who are actively deciding where to go or order from.',
    ],
    approachIntro: 'Local SEO for restaurants works best when store listings, media, reviews, and local pages are managed like a real commercial asset, not a setup task done once.',
    approach: [
      {
        title: 'Tighten the listing fundamentals',
        description: 'Fix categories, opening details, media, attributes, and store information so the listing sends stronger trust and relevance signals.',
      },
      {
        title: 'Build a review system',
        description: 'Create disciplined review generation and response workflows that help both conversion and map relevance.',
      },
      {
        title: 'Support listings with store pages',
        description: 'Use local landing pages and store detail content so the website strengthens branch-level search performance.',
      },
      {
        title: 'Keep the profile active',
        description: 'Use posts, events, store photos, and seasonal updates to keep the listing current and conversion-ready.',
      },
    ],
    includes: [
      'Google Business Profile review',
      'Category and listing optimization',
      'Review generation and response guidance',
      'Store landing page recommendations',
      'Local visibility checklist',
    ],
    whoItsFor: [
      'Single outlets and local cafe brands',
      'Multi-store businesses with branch-level intent capture needs',
      'Teams opening new stores',
      'Restaurants with weak Maps visibility or stale listings',
    ],
    mistakes: [
      'Treating the profile as set-and-forget',
      'Ignoring reviews until there is a complaint',
      'Using one generic store page for all locations',
      'Forgetting photos, posts, and branch-specific updates',
    ],
    deliverables: [
      'GBP optimization checklist',
      'Review system framework',
      'Local page recommendations',
      'Maps visibility priorities',
      'Branch maintenance cadence',
    ],
    relatedSlugs: ['local-store-marketing', 'store-launch-marketing', 'performance-marketing'],
  },
  {
    slug: 'chain-franchise-marketing',
    navLabel: 'Franchise',
    eyebrow: 'Chain Systems',
    title: 'Chain & Franchise Marketing Systems',
    description: 'Centralized brand control, local execution rules, and rollout systems for restaurant groups, chains, and franchise-led operators.',
    metaTitle: 'Chain & Franchise Marketing Systems',
    metaDescription: 'Restaurant chain and franchise marketing systems covering governance, local execution, toolkit rollout, and campaign compliance.',
    outcome: 'Scale marketing without losing brand control, local relevance, or reporting discipline across multiple stores and operators.',
    problem: [
      'Growth creates marketing complexity long before it creates marketing maturity. Central teams lose control, local stores improvise, and campaign quality becomes inconsistent across the network.',
      'Franchise environments intensify this problem because every market needs room to act, but too much freedom quickly damages the brand.',
    ],
    approachIntro: 'The system is designed to balance central governance with practical local execution so the network can move fast without becoming fragmented.',
    approach: [
      {
        title: 'Define central vs local roles',
        description: 'Clarify what the head office owns, what stores can adapt, and where approval is required.',
      },
      {
        title: 'Build the asset and toolkit system',
        description: 'Create repeatable frameworks for campaign distribution, compliance, localization, and creative refresh.',
      },
      {
        title: 'Support rollout discipline',
        description: 'Use campaign calendars, launch packs, and reporting standards that travel well across markets and operators.',
      },
      {
        title: 'Measure branch and network effect',
        description: 'Track consistency, compliance, local performance, and rollout quality with enough visibility to intervene early.',
      },
    ],
    includes: [
      'Central vs local governance framework',
      'Franchise and branch toolkit design',
      'Campaign rollout model',
      'Compliance and asset distribution rules',
      'Network reporting structure',
    ],
    whoItsFor: [
      'Multi-outlet restaurant and cafe groups',
      'Franchise-led brands',
      'Regional chains expanding into more cities or countries',
      'Operators whose local execution is too inconsistent',
    ],
    mistakes: [
      'Giving stores too little freedom to stay locally relevant',
      'Giving stores too much freedom to stay brand-safe',
      'Launching campaigns without rollout standards',
      'Tracking sales without tracking compliance and execution quality',
    ],
    deliverables: [
      'Marketing governance model',
      'Franchise toolkit outline',
      'Campaign rollout checklist',
      'Compliance and adaptation rules',
      'Chain reporting framework',
    ],
    relatedSlugs: ['restaurant-marketing-plan', 'local-store-marketing', 'dashboards-kpis'],
  },
  {
    slug: 'dashboards-kpis',
    navLabel: 'KPIs',
    eyebrow: 'Measurement',
    title: 'Dashboards, KPIs & Measurement',
    description: 'Decision dashboards for restaurants and cafes covering footfall, CAC, repeat rate, delivery mix, ROAS, and branch-level performance.',
    metaTitle: 'Dashboards & KPIs for Restaurants',
    metaDescription: 'Restaurant dashboards and KPI systems covering CAC, repeat rate, delivery mix, ROAS, store metrics, and growth measurement.',
    outcome: 'Give founders and operators a cleaner view of what is working, what is leaking, and what deserves the next decision.',
    problem: [
      'Many restaurant reports are full of numbers and still poor at guiding action. Metrics sit in separate tools, branches are compared badly, and teams review channel outputs without seeing the commercial picture.',
      'That causes slow decisions, reactive meetings, and a lot of energy spent debating symptoms instead of identifying the real pressure point.',
    ],
    approachIntro: 'Good restaurant measurement starts by deciding which questions the dashboard should answer for a founder, marketer, or operator.',
    approach: [
      {
        title: 'Separate leading and lagging signals',
        description: 'Track what shows demand forming, what shows conversion happening, and what proves the economics are actually healthy.',
      },
      {
        title: 'Measure by branch and channel',
        description: 'Break performance down by store, delivery, dine-in, campaign, and retention so actions can stay specific.',
      },
      {
        title: 'Tie media and CRM to revenue quality',
        description: 'Review CAC, repeat rate, order quality, ROAS, and delivery share together instead of in isolated dashboards.',
      },
      {
        title: 'Create a repeatable review rhythm',
        description: 'Turn the numbers into weekly and monthly scorecards that lead to decisions, not just commentary.',
      },
    ],
    includes: [
      'KPI framework by role',
      'Store and channel dashboard logic',
      'Campaign measurement structure',
      'Retention and repeat-rate review metrics',
      'Decision-scorecard rhythm',
    ],
    whoItsFor: [
      'Founders who need clearer commercial visibility',
      'Marketing teams reporting beyond vanity metrics',
      'Multi-store operators comparing branches properly',
      'Brands formalizing their growth review cadence',
    ],
    mistakes: [
      'Tracking too many metrics without decision use',
      'Reviewing paid media separately from repeat behavior',
      'Comparing branches without context',
      'Waiting for month-end to detect an obvious leak',
    ],
    deliverables: [
      'KPI architecture',
      'Dashboard recommendation set',
      'Weekly and monthly review templates',
      'Role-based scorecard guidance',
      'Measurement and attribution priorities',
    ],
    relatedSlugs: ['performance-marketing', 'crm-loyalty-retention', 'delivery-aggregator-marketing'],
  },
];

export const growthCapabilities: GrowthLinkCard[] = growthPages.map((page) => ({
  eyebrow: page.eyebrow,
  title: page.title,
  description: page.outcome,
  href: `${growthBasePath}/${page.slug}/`,
  metadata: page.navLabel,
}));

export const growthNav: NavItem[] = [
  { href: `${growthBasePath}/`, label: 'Overview' },
  { href: growthTemplatesPath, label: 'Templates' },
  ...growthPages.map((page) => ({
    href: `${growthBasePath}/${page.slug}/`,
    label: page.navLabel,
  })),
  { href: growthAuditPath, label: 'Audit' },
];

const growthPageMap = new Map(growthPages.map((page) => [page.slug, page]));

export function getGrowthPage(slug: string) {
  return growthPageMap.get(slug);
}

export function getGrowthPageHref(slug: string) {
  return `${growthBasePath}/${slug}/`;
}
