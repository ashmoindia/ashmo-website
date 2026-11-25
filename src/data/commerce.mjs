export const workbooks = [
  {
    id: 'restaurant-pnl',
    name: 'Restaurant P&L Workbook',
    category: 'Profit and loss',
    amount: 14900,
    description: 'Compare actuals against budget and see how a change in costs affects outlet profit.',
    tabs: ['Monthly P&L', 'Budget variance', 'Cost scenarios'],
    sample: [['Net sales', '180,000'], ['Ingredients and packaging', '58,500'], ['Gross profit', '121,500'], ['Labour, occupancy and other costs', '97,000'], ['Outlet operating profit', '24,500']],
  },
  {
    id: 'recipe-margin',
    name: 'Recipe Margin Workbook',
    category: 'Menu costing',
    amount: 7900,
    description: 'Calculate ingredient yield, portion cost and contribution at different menu prices.',
    tabs: ['Recipe cost', 'Yield and packaging', 'Price sensitivity'],
    sample: [['Selling price', '34.00'], ['Usable ingredients', '10.20'], ['Packaging', '1.80'], ['Contribution before labour', '22.00']],
  },
  {
    id: 'weekly-flash',
    name: 'Weekly Flash Report',
    category: 'Weekly performance',
    amount: 9900,
    description: 'Compare weekly sales with plan and give each action an owner and a due date.',
    tabs: ['Weekly trading', 'Variance summary', 'Action log'],
    sample: [['Net sales target', '44,000'], ['Actual net sales', '42,800'], ['Sales variance', '−1,200']],
  },
];

export const plans = [
  { id: 'membership-monthly', name: 'Ashmo Membership', label: 'Monthly', amount: 6900, interval: 'month' },
  { id: 'membership-annual', name: 'Ashmo Membership', label: 'Annual', amount: 69000, interval: 'year' },
];

export const offer = (id) => [...workbooks, ...plans].find((item) => item.id === id);
export const aed = (minor) => `AED ${minor / 100}`;
export const isMembership = (item) => Boolean(item && 'interval' in item);
