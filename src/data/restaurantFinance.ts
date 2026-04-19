export type FinanceCalculator = {
  slug: string;
  name: string;
  summary: string;
  metric: string;
  prompt: string;
  cta: string;
};

export type FinanceTemplate = {
  slug: string;
  name: string;
  summary: string;
  format: string;
  href: string;
  audience: string;
};

export type FinanceService = {
  slug: string;
  name: string;
  summary: string;
  outcome: string;
  trigger: string;
};

export type FinanceInsight = {
  slug: string;
  title: string;
  description: string;
  readTime: string;
};

export const financeNav = [
  { href: '/restaurant-finance/', label: 'Overview' },
  { href: '/restaurant-finance/insights/', label: 'Insights' },
  { href: '/restaurant-finance/calculators/', label: 'Calculators' },
  { href: '/restaurant-finance/templates/', label: 'Templates' },
  { href: '/restaurant-finance/benchmarks/', label: 'Benchmarks' },
  { href: '/restaurant-finance/services/', label: 'Services' },
];

export const financeCalculators: FinanceCalculator[] = [
  {
    slug: 'break-even',
    name: 'Break-even calculator',
    summary: 'Model the daily sales, covers, and average spend required for a branch to stop losing money.',
    metric: 'Break-even revenue, covers, and daily requirement',
    prompt: 'Use this when you need to know whether a branch can realistically cover fixed cost.',
    cta: 'If the required covers feel unrealistic, move straight into a rent and unit economics review.',
  },
  {
    slug: 'rent-to-revenue',
    name: 'Rent-to-revenue calculator',
    summary: 'Stress test occupancy cost against monthly revenue and see whether the location is commercially survivable.',
    metric: 'Rent ratio, occupancy pressure, and warning band',
    prompt: 'Use this before you sign, renew, relocate, or accept a premium mall rent.',
    cta: 'If rent is eating too much of top line, it is usually a location or model problem, not a marketing problem.',
  },
  {
    slug: 'labor-cost-to-company',
    name: 'Labor cost-to-company calculator',
    summary: 'Translate monthly payroll, benefits, visa cost, and productivity assumptions into a true labor percentage.',
    metric: 'Labor % and cost-to-company',
    prompt: 'Use this when revenue feels healthy but payroll still makes the branch fragile.',
    cta: 'If labor remains too high after scheduling changes, you likely need an operating model review.',
  },
  {
    slug: 'delivery-profitability',
    name: 'Delivery profitability calculator',
    summary: 'Compare delivery gross sales against commission, packaging, discounts, and food cost to see real contribution margin.',
    metric: 'Channel contribution margin',
    prompt: 'Use this before you celebrate delivery volume that might actually be destroying margin.',
    cta: 'If aggregator contribution is weak, the next move is a delivery channel profitability review or D2C transition plan.',
  },
];

export const financeTemplates: FinanceTemplate[] = [
  {
    slug: 'restaurant-p-and-l-template',
    name: 'Restaurant P&L template',
    summary:
      'A monthly close workbook with gross-to-net sales bridge, COGS split, payroll, occupancy, EBITDA, dashboard outputs, and review checks for UAE operators.',
    format: 'XLSX',
    href: '/downloads/restaurant-finance/restaurant-p-and-l-template.xlsx',
    audience:
      'Founders, operators, finance leads, and GMs who need a month-end pack that can stand up to lender, investor, or audit review.',
  },
  {
    slug: 'weekly-flash-report-template',
    name: 'Weekly flash report',
    summary:
      'A weekly trading workbook with sales by channel, covers, APC, delivery mix, labor productivity, EBITDA bridge, and exception checks for the next management huddle.',
    format: 'XLSX',
    href: '/downloads/restaurant-finance/weekly-flash-report-template.xlsx',
    audience:
      'Operators who want disciplined weekly visibility, not a month-end surprise after margin has already leaked.',
  },
  {
    slug: 'recipe-costing-sheet',
    name: 'Recipe costing sheet',
    summary:
      'An item-level costing workbook with ingredient master, yield logic, waste uplift, suggested selling price, gross margin view, and pricing checks.',
    format: 'XLSX',
    href: '/downloads/restaurant-finance/recipe-costing-sheet.xlsx',
    audience:
      'Chefs, kitchen managers, and founders who want menu pricing backed by usable-cost logic rather than rough guesswork.',
  },
  {
    slug: 'opening-budget-template',
    name: 'Opening budget template',
    summary:
      'A branch-opening workbook with capex, approvals, deposits, pre-opening payroll, working capital, funding plan, timing view, and sponsor dashboard.',
    format: 'XLSX',
    href: '/downloads/restaurant-finance/opening-budget-template.xlsx',
    audience:
      'Founders, expansion teams, and finance managers deciding whether a new site can be funded and survive the first six months.',
  },
  {
    slug: 'business-plan-model',
    name: 'Business plan model',
    summary:
      'An integrated 24-month model with revenue build, staffing, opex, capex, funding, cash flow, dashboard KPIs, and control checks for UAE cafes and QSR.',
    format: 'XLSX',
    href: '/downloads/restaurant-finance/business-plan-model-template.xlsx',
    audience:
      'Operators preparing for investors, landlords, lenders, or internal expansion decisions that need more than a one-tab spreadsheet.',
  },
];

export const financeServices: FinanceService[] = [
  {
    slug: 'branch-feasibility-review',
    name: 'Branch feasibility review',
    summary: 'A decision memo on whether a location can carry the rent, labor, and revenue assumptions required to justify opening.',
    outcome: 'Clear go / no-go logic with key pressure points.',
    trigger: 'Best triggered when break-even or rent ratios look dangerous.',
  },
  {
    slug: 'rent-and-unit-economics-review',
    name: 'Rent and unit economics review',
    summary: 'A tighter review of occupancy cost, revenue build-up, throughput assumptions, and the realism of the model.',
    outcome: 'A clearer picture of whether the business model fits the location.',
    trigger: 'Use when rent starts dictating every other operating compromise.',
  },
  {
    slug: 'delivery-channel-profitability-review',
    name: 'Delivery channel profitability review',
    summary: 'A review of aggregator volume, discounts, packaging, commission, and channel mix to find the real margin story.',
    outcome: 'Practical recommendations on pricing, promos, packaging, and channel dependence.',
    trigger: 'Best triggered when delivery volume is growing faster than cash generation.',
  },
  {
    slug: 'menu-profitability-audit',
    name: 'Menu profitability audit',
    summary: 'An item-level review of recipe cost, yield, waste, and menu engineering pressure points.',
    outcome: 'Clear actions on pricing, mix, and low-performing items.',
    trigger: 'Use when revenue is fine but the kitchen economics still feel weak.',
  },
  {
    slug: 'business-plan-and-financial-model-review',
    name: 'Business plan and financial model review',
    summary: 'A founder-grade review of assumptions, branch economics, capex, and payback logic before investors or expansion decisions.',
    outcome: 'Sharper assumptions and a more credible plan.',
    trigger: 'Use before raising, signing, franchising, or opening another unit.',
  },
];

export const financeInsights: FinanceInsight[] = [
  {
    slug: 'what-rent-to-revenue-should-look-like-in-dubai',
    title: 'What rent-to-revenue should look like in Dubai',
    description: 'A practical guide to occupancy cost discipline for mall units, community retail, and founder-led concepts that cannot afford vanity locations.',
    readTime: '7 min read',
  },
  {
    slug: 'restaurant-p-and-l-explained-for-uae-operators',
    title: 'Restaurant P&L explained for UAE operators',
    description: 'What a restaurant P&L should actually help you decide, and why founders often read revenue before they read pressure.',
    readTime: '8 min read',
  },
  {
    slug: 'how-to-measure-apc-aov-covers-and-table-turn-properly',
    title: 'How to measure APC, AOV, covers, and table turn properly',
    description: 'The operating metrics that look simple on paper and become expensive when they are measured badly.',
    readTime: '7 min read',
  },
  {
    slug: 'delivery-margin-calculator-for-talabat-deliveroo-and-noon',
    title: 'Delivery margin calculator for Talabat, Deliveroo, and noon',
    description: 'A framework for understanding whether delivery is a margin engine, a volume illusion, or a necessary compromise.',
    readTime: '6 min read',
  },
  {
    slug: 'when-ebitda-lies-in-restaurant-businesses',
    title: 'When EBITDA lies in restaurant businesses',
    description: 'Why a clean EBITDA line can still hide a weak branch, delayed capex pressure, or a commercial model that does not repeat well.',
    readTime: '6 min read',
  },
];

export const financeMetrics = [
  {
    title: 'Revenue and sales',
    items: ['Gross sales', 'Net sales', 'AOV', 'APC', 'Covers', 'Channel mix', 'Same-store sales growth'],
  },
  {
    title: 'Gross profit and COGS',
    items: ['Food cost %', 'Beverage cost %', 'Packaging cost %', 'Waste %', 'Yield variance', 'Contribution margin by channel'],
  },
  {
    title: 'Operating performance',
    items: ['Labor %', 'Rent %', 'Utilities %', 'Marketing %', 'G&A %', 'Four-wall EBITDA %', 'Break-even revenue'],
  },
  {
    title: 'Capital efficiency',
    items: ['Capex per seat', 'Payback period', 'ROIC', 'Ramp-up curve', 'Delivery dependency %'],
  },
];

export const evidenceLayers = [
  {
    title: 'Official UAE Data',
    summary: 'Macro, labor, tax, licensing, and business environment context from UAE official sources.',
  },
  {
    title: 'Licensed Market Research',
    summary: 'Paid strategic context from Euromonitor and YouGov, supported by JLL and CBRE market insight.',
  },
  {
    title: 'Ashmo Operator Benchmark',
    summary: 'Anonymized operator benchmarks built from real submissions once quality and sample thresholds are met.',
  },
  {
    title: 'Model Assumption',
    summary: 'Transparent assumptions used inside calculators and planning tools where public data does not exist.',
  },
];

export const trustMarkers = [
  'Every meaningful metric shows source type.',
  'Every calculator shows assumptions before it shows confidence.',
  'Every benchmark range should show concept scope, geography, and period covered.',
];

export const roadmapPhases = [
  {
    title: 'Phase 1 — Decision tools',
    summary: 'Launch the branch profitability stack: core finance pages, four calculators, and the first gated template pack.',
  },
  {
    title: 'Phase 2 — Benchmark pilot',
    summary: 'Recruit a small operator cohort, validate submissions, and publish the first benchmark methodology and pilot note.',
  },
  {
    title: 'Phase 3 — Premium intelligence',
    summary: 'Add premium comparison ranges, decision packs, and a repeatable service funnel once data quality and demand are proven.',
  },
];
