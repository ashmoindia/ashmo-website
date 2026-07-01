export type SeoFaq = {
  question: string;
  answer: string;
};

export type SeoPage = {
  slug: string;
  cluster: string;
  priority: 'A' | 'B';
  keyword: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string[];
  failurePoint: string;
  framework: string[];
  checklist: string[];
  localAngle?: string;
  example: string;
  ctaLabel: string;
  ctaHref: string;
  relatedSlugs: string[];
  faqs: SeoFaq[];
};

export const restaurantSeoBaseUrl = 'https://ashmo.io';

const growthReviewHref = '/restaurant-cafe-growth-systems/growth-audit/#growth-audit';
const strategyCallHref = '/restaurant-cafe-growth-systems/growth-audit/#strategy-call';
const templatesHref = '/restaurant-cafe-growth-systems/templates/';

const sharedFaqs = {
  consultant: [
    {
      question: 'When should a restaurant hire a marketing consultant?',
      answer:
        'Hire a consultant when the issue is bigger than posting frequency or ad setup. The useful work is diagnosing positioning, local demand, offer structure, delivery, CRM, and measurement before adding more channel activity.',
    },
    {
      question: 'Is this the same as hiring a restaurant marketing agency?',
      answer:
        'Not exactly. An agency usually executes channels. A consultant should clarify the commercial growth system first, then decide which channels, offers, assets, and reporting cadence deserve execution.',
    },
  ],
  localSeo: [
    {
      question: 'What matters most for restaurant local SEO?',
      answer:
        'Google Business Profile quality, reviews, photos, menu visibility, location pages, consistent business details, local links, and clear signals that match how nearby customers search.',
    },
    {
      question: 'Can local SEO help restaurants without paid ads?',
      answer:
        'Yes, but it works as a demand-capture system rather than instant reach. Strong local SEO helps a restaurant appear when nearby customers are already comparing options.',
    },
  ],
  planning: [
    {
      question: 'What should a restaurant marketing plan include?',
      answer:
        'A useful plan includes the growth problem, target customer behavior, channel roles, offer logic, content rhythm, local activity, delivery actions, CRM, budget, and weekly KPIs.',
    },
    {
      question: 'How long should a restaurant marketing plan cover?',
      answer:
        'Use a 90-day plan for focused improvement and a 12-month plan for seasonality, campaign rhythm, launches, and budget control.',
    },
  ],
};

export const restaurantSeoPages: SeoPage[] = [
  {
    slug: 'restaurant-marketing',
    cluster: 'Restaurant marketing authority',
    priority: 'A',
    keyword: 'restaurant marketing',
    title: 'Restaurant Marketing: A Practical Growth System for Restaurants & Cafes',
    metaTitle: 'Restaurant Marketing System',
    metaDescription:
      'A practical restaurant marketing guide covering positioning, local demand, launch campaigns, delivery, CRM, loyalty, content, and KPIs.',
    intro: [
      'Restaurant marketing is not only social media, offers, or paid ads. For a restaurant or cafe, marketing has to connect brand memory, local demand, menu behavior, delivery visibility, repeat visits, and commercial measurement.',
      'This guide is built for founders, operators, franchise teams, and marketers who need a clearer way to decide what to promote, where to spend, how to measure, and when to stop wasting effort on channels that are not solving the real problem.',
    ],
    failurePoint:
      'Most restaurant marketing fails because the business treats every growth issue as a promotion issue. Weak positioning, unclear menu heroes, poor local visibility, low review quality, and weak retention each need a different fix.',
    framework: [
      'Positioning: define why the brand should be chosen and remembered.',
      'Local demand: capture nearby intent through Maps, reviews, location pages, and community activity.',
      'Menu and offer architecture: promote items that support margin, habit, and brand memory.',
      'Content and campaigns: build repeatable creative systems instead of random posting.',
      'Delivery, CRM, loyalty, and KPIs: turn first orders into repeat behavior and weekly decisions.',
    ],
    checklist: [
      'Write the commercial problem before choosing channels.',
      'Identify hero items, dayparts, and customer occasions worth promoting.',
      'Audit Google Business Profile, reviews, menu links, and photos.',
      'Build a monthly campaign rhythm with one clear business objective per campaign.',
      'Track sales, transactions, AOV, delivery mix, repeat rate, and marketing spend weekly.',
    ],
    localAngle:
      'In Dubai and the UAE, restaurant marketing must account for mall traffic, delivery-app comparison, tourism cycles, office catchments, residential communities, and highly visible Google Maps decisions.',
    example:
      'A cafe with active social media but weak weekday mornings should not simply post more reels. The better move is to define the morning occasion, adjust hero products and bundles, improve Maps visibility, and run local office/community activation with a repeat-visit path.',
    ctaLabel: 'Request a Growth Review',
    ctaHref: growthReviewHref,
    relatedSlugs: ['restaurant-marketing-strategy', 'restaurant-marketing-plan', 'local-seo-for-restaurants', 'restaurant-kpi-dashboard'],
    faqs: [
      {
        question: 'What is restaurant marketing?',
        answer:
          'Restaurant marketing is the system used to create demand, capture nearby intent, convert customers, increase repeat visits, and measure whether activity is improving commercial outcomes.',
      },
      ...sharedFaqs.planning,
      {
        question: 'What channels should restaurants use first?',
        answer:
          'Start with the channels that match the constraint. Local visibility, reviews, and menu pages matter for high-intent demand; CRM matters for repeat behavior; paid media works best after the offer and conversion path are clear.',
      },
    ],
  },
  {
    slug: 'restaurant-marketing-strategy',
    cluster: 'Restaurant marketing authority',
    priority: 'A',
    keyword: 'restaurant marketing strategy',
    title: 'Restaurant Marketing Strategy for Footfall, Frequency, and Measurable Growth',
    metaTitle: 'Restaurant Marketing Strategy for Growth',
    metaDescription:
      'Build a restaurant marketing strategy around positioning, local demand, content, delivery, CRM, and KPIs instead of scattered campaigns.',
    intro: [
      'A restaurant marketing strategy should answer one question: what will make the right customer choose this brand more often, with better commercial results for the business?',
      'The answer rarely sits in one channel. It usually spans positioning, local visibility, offer structure, content rhythm, menu design, delivery performance, retention, and measurement.',
    ],
    failurePoint:
      'Weak strategies start with channel selection. The team asks what to post or boost before deciding whether the real constraint is awareness, conversion, repeat visits, delivery visibility, or margin quality.',
    framework: [
      'Diagnose the growth constraint before choosing media.',
      'Define the customer occasion and the category role the restaurant should own.',
      'Match menu heroes, offers, and campaign themes to that occasion.',
      'Assign channels specific jobs: discovery, intent capture, conversion, retention, or reporting.',
      'Review weekly KPIs so the strategy becomes an operating rhythm, not a deck.',
    ],
    checklist: [
      'Name the single behavior the strategy must change.',
      'Separate awareness problems from conversion, retention, and margin problems.',
      'Create a channel-role matrix for Meta, Google, Maps, CRM, delivery, and local activity.',
      'Define the campaign cadence for the next 90 days.',
      'Set weekly decision rules for scale, hold, fix, and stop.',
    ],
    localAngle:
      'Dubai restaurant strategy needs micro-market thinking. A DIFC lunch concept, a Jumeirah cafe, a mall QSR, and a delivery-first cloud kitchen should not share the same channel logic.',
    example:
      'If delivery orders are high but profit is weak, the strategy should shift from discount volume to listing quality, hero thumbnails, bundles, packaging, review recovery, and CRM paths that improve repeat orders.',
    ctaLabel: 'Build a 90-Day Plan',
    ctaHref: growthReviewHref,
    relatedSlugs: ['restaurant-marketing', 'restaurant-marketing-plan', 'restaurant-delivery-marketing', 'restaurant-crm-strategy'],
    faqs: [
      {
        question: 'How do you create a restaurant marketing strategy?',
        answer:
          'Start with the commercial constraint, define the customer behavior to change, align menu and offers, assign channels by job, then track weekly KPIs against the intended outcome.',
      },
      ...sharedFaqs.planning,
      {
        question: 'What makes restaurant strategy different from normal marketing strategy?',
        answer:
          'Restaurants depend on location, daypart, menu mix, service capacity, reviews, delivery economics, and repeat behavior. A strategy that ignores those operating realities becomes generic channel planning.',
      },
    ],
  },
  {
    slug: 'restaurant-marketing-ideas',
    cluster: 'Restaurant marketing authority',
    priority: 'A',
    keyword: 'restaurant marketing ideas',
    title: 'Restaurant Marketing Ideas Grouped by Real Business Problems',
    metaTitle: 'Restaurant Marketing Ideas That Drive Demand',
    metaDescription:
      'Practical restaurant marketing ideas grouped by launch, local demand, delivery, retention, seasonal campaigns, content, and measurement.',
    intro: [
      'Restaurant marketing ideas are only useful when they are attached to a business problem. A launch idea, a footfall idea, a delivery idea, and a retention idea should not be judged by the same metric.',
      'Use this page as an idea bank, but start by choosing the problem you need to solve: more nearby discovery, stronger repeat visits, better delivery visibility, a sharper launch, or higher-quality campaigns.',
    ],
    failurePoint:
      'Generic idea lists create activity without diagnosis. A team copies a giveaway, influencer dinner, or discount mechanic without knowing whether the outlet needs awareness, conversion, frequency, or margin protection.',
    framework: [
      'Launch ideas: neighborhood previews, founder nights, soft-opening lists, and review capture.',
      'Local ideas: office drops, school/community partnerships, Maps photo pushes, and branch-specific offers.',
      'Delivery ideas: listing audits, hero item photography, bundle tests, and lapsed-order journeys.',
      'Retention ideas: second-visit triggers, birthday moments, VIP menus, and frequency challenges.',
      'Measurement ideas: weekly scorecards, offer kill lists, and campaign post-mortems.',
    ],
    checklist: [
      'Pick one campaign objective before choosing an idea.',
      'Connect every idea to a menu item, customer occasion, or local audience.',
      'Set one success metric and one stop rule.',
      'Capture emails, WhatsApp opt-ins, reviews, or remarketing audiences wherever appropriate.',
      'Turn the best ideas into repeatable playbooks instead of one-off activity.',
    ],
    localAngle:
      'In UAE markets, the strongest ideas often connect to real routines: office lunch, school pickup, Ramadan and Eid planning, summer traffic changes, mall behavior, and community discovery.',
    example:
      'For a weekday lunch gap, a better idea than a generic discount is a nearby office tasting route, a limited lunch bundle, QR reorder path, and a seven-day follow-up offer for second visits.',
    ctaLabel: 'Open the Template Library',
    ctaHref: templatesHref,
    relatedSlugs: ['restaurant-marketing', 'restaurant-grand-opening-ideas', 'cafe-marketing-ideas', 'restaurant-loyalty-program'],
    faqs: [
      {
        question: 'What are good restaurant marketing ideas?',
        answer:
          'Good ideas are tied to a business problem: launch momentum, local footfall, delivery visibility, repeat visits, review growth, menu adoption, or seasonal demand.',
      },
      {
        question: 'Should restaurants run discounts?',
        answer:
          'Discounts can work when they create trial, move a specific item, or reactivate lapsed customers. They become dangerous when they train customers to wait or hide weak positioning.',
      },
      {
        question: 'How many marketing ideas should a restaurant run at once?',
        answer:
          'Run fewer ideas with clearer measurement. A focused monthly campaign supported by content, local activity, CRM, and reporting usually beats a crowded calendar of disconnected tactics.',
      },
      {
        question: 'What restaurant ideas work for repeat visits?',
        answer:
          'Second-visit incentives, loyalty tiers, daypart routines, CRM journeys, VIP previews, and product rituals usually support repeat behavior better than broad awareness tactics.',
      },
    ],
  },
  {
    slug: 'restaurant-marketing-plan',
    cluster: 'Restaurant marketing authority',
    priority: 'A',
    keyword: 'restaurant marketing plan',
    title: 'Restaurant Marketing Plan: A Practical 30/60/90-Day Template',
    metaTitle: 'Restaurant Marketing Plan: 30/60/90 Template',
    metaDescription:
      'A practical restaurant marketing plan template covering launch, local demand, content, offers, delivery, CRM, KPIs, and weekly reporting.',
    intro: [
      'A restaurant marketing plan should not be a calendar full of random posts. It should tell the team what the business is trying to grow, which behavior must change, which channels will be used, and which numbers decide whether the plan is working.',
      'This 30/60/90-day plan connects brand, local visibility, content, delivery, loyalty, and weekly measurement into one operating rhythm.',
    ],
    failurePoint:
      'Most plans fail because they list tasks without decision logic. A post, ad, influencer visit, offer, and email campaign can all be active while the business remains unclear about what is improving.',
    framework: [
      'First 30 days: audit positioning, menu heroes, Google profile, content system, and reporting.',
      'Days 31-60: activate campaigns, local partnerships, delivery visibility, and CRM capture.',
      'Days 61-90: optimize offers, segment customers, review KPIs, and build retention loops.',
      'Weekly cadence: review the same core numbers and turn findings into next actions.',
      'Monthly reset: decide what to scale, fix, pause, or replace.',
    ],
    checklist: [
      'Define the growth problem and commercial target.',
      'Choose campaign themes by month and customer behavior.',
      'Map channel roles and owners.',
      'Build offer guardrails around margin and brand fit.',
      'Use a weekly CEO pack for sales, transactions, AOV, repeat rate, delivery mix, and marketing spend.',
    ],
    localAngle:
      'For Dubai restaurants, the plan should include Google Maps readiness, location-level content, review generation, local partnerships, delivery-app merchandising, and seasonality around Ramadan, Eid, summer, and school cycles.',
    example:
      'A new cafe plan might use month one for Maps, photo cadence, morning heroes, and soft launch reviews; month two for office activations and content rhythm; month three for loyalty and repeat-visit journeys.',
    ctaLabel: 'Download Planning Tools',
    ctaHref: templatesHref,
    relatedSlugs: ['restaurant-marketing-strategy', 'restaurant-launch-marketing', 'restaurant-kpi-dashboard', 'restaurant-marketing-ideas'],
    faqs: [
      ...sharedFaqs.planning,
      {
        question: 'What should happen in the first 30 days?',
        answer:
          'The first 30 days should establish the foundation: diagnosis, positioning, Google profile, menu heroes, content rhythm, campaign calendar, and baseline KPIs.',
      },
      {
        question: 'How should a restaurant report marketing performance?',
        answer:
          'Report marketing against commercial behavior: sales, transactions, AOV, repeat rate, delivery mix, reviews, CRM growth, campaign ROI, and branch-level signals.',
      },
    ],
  },
  {
    slug: 'restaurant-marketing-agency-dubai',
    cluster: 'Dubai / UAE commercial intent',
    priority: 'A',
    keyword: 'restaurant marketing agency Dubai',
    title: 'Restaurant Marketing Agency Dubai: Strategy Before Channel Execution',
    metaTitle: 'Restaurant Marketing Agency Dubai',
    metaDescription:
      'Restaurant marketing support in Dubai for F&B brands that need strategy, local demand, launch discipline, delivery visibility, CRM, and KPIs.',
    intro: [
      'A restaurant marketing agency in Dubai should not only manage ads, social posts, or influencer bookings. For serious F&B brands, the work has to start with commercial diagnosis.',
      'ASHMO.IO approaches agency-style needs through restaurant growth systems: positioning, local demand, campaign structure, delivery visibility, CRM, loyalty, and measurable decision-making.',
    ],
    failurePoint:
      'Restaurants often hire execution before strategy. The result is more content and spend, but the same unresolved problems around offer structure, footfall, delivery quality, reviews, and repeat visits.',
    framework: [
      'Diagnose the commercial constraint before adding activity.',
      'Translate positioning into campaigns, content, offers, and store assets.',
      'Build local demand capture through Maps, search, and branch-level activity.',
      'Coordinate paid media, delivery, CRM, and reporting around the same growth objective.',
      'Review weekly numbers so execution keeps improving.',
    ],
    checklist: [
      'Clarify whether you need strategy, execution, or both.',
      'Audit current content, ads, Maps, reviews, delivery listings, CRM, and KPIs.',
      'Define the highest-leverage 90-day growth objective.',
      'Set channel owners and reporting cadence.',
      'Avoid retainers that produce activity without commercial review.',
    ],
    localAngle:
      'Dubai F&B marketing is competitive because customers compare quickly across social proof, Maps, delivery apps, malls, neighborhoods, and word-of-mouth. Execution needs a local operating view.',
    example:
      'A premium restaurant seeking more bookings may need search and Maps capture, stronger private dining positioning, review recovery, landing pages, and CRM follow-up before it needs a larger posting calendar.',
    ctaLabel: 'Request a Growth Review',
    ctaHref: growthReviewHref,
    relatedSlugs: ['restaurant-marketing-consultant-dubai', 'restaurant-consultant-dubai', 'fb-marketing-consultant-uae', 'restaurant-marketing-strategy'],
    faqs: [
      ...sharedFaqs.consultant,
      {
        question: 'What should a restaurant marketing agency in Dubai manage?',
        answer:
          'It may manage content, paid media, search, Maps, influencer activity, CRM, launches, reporting, and campaigns, but those should be tied to a clear growth system.',
      },
      {
        question: 'How do I choose a restaurant marketing agency?',
        answer:
          'Look for commercial diagnosis, restaurant-specific thinking, clear reporting, local market understanding, and honest channel prioritization instead of a generic service menu.',
      },
    ],
  },
  {
    slug: 'restaurant-marketing-consultant-dubai',
    cluster: 'Dubai / UAE commercial intent',
    priority: 'A',
    keyword: 'restaurant marketing consultant Dubai',
    title: 'Restaurant Marketing Consultant in Dubai for Practical F&B Growth',
    metaTitle: 'Restaurant Marketing Consultant Dubai',
    metaDescription:
      'Operator-led restaurant marketing consulting in Dubai for cafes, restaurants, QSR, cloud kitchens, and franchise brands needing growth systems.',
    intro: [
      'Restaurants in Dubai do not need more channel noise. They need sharper commercial thinking around positioning, local visibility, content, launch discipline, delivery, CRM, offers, and branch-level measurement.',
      'A restaurant marketing consultant should help the business understand what is actually limiting growth before recommending more spend.',
    ],
    failurePoint:
      'The common mistake is asking for a campaign before the business knows whether the problem is weak awareness, a poor local listing, unclear menu heroes, low repeat behavior, or a delivery channel leak.',
    framework: [
      'Review the business model, location, category, and customer occasion.',
      'Audit current marketing activity against actual commercial outcomes.',
      'Define the 90-day growth constraint and the few moves that can change it.',
      'Build a plan across local demand, content, paid media, delivery, CRM, and KPI review.',
      'Support execution through decision cadence and practical templates.',
    ],
    checklist: [
      'Bring current sales, channel, delivery, CRM, review, and campaign data.',
      'Clarify the main pressure: footfall, launch, delivery, retention, or expansion.',
      'Review offers and menu heroes before scaling media.',
      'Set branch-level and weekly KPIs.',
      'Document what will be stopped as well as what will be launched.',
    ],
    localAngle:
      'Dubai restaurants operate across sharply different demand pockets: malls, business districts, tourist corridors, residential communities, delivery zones, and premium neighborhoods. Consulting should respect that geography.',
    example:
      'A Jumeirah cafe and a Business Bay lunch concept may both need growth, but one may win through community routine and premium product memory while the other needs office catchment activation and weekday conversion.',
    ctaLabel: 'Book a Strategy Call',
    ctaHref: strategyCallHref,
    relatedSlugs: ['restaurant-marketing-agency-dubai', 'restaurant-consultant-dubai', 'fb-consultant-dubai', 'how-to-start-a-cafe-in-dubai'],
    faqs: [
      ...sharedFaqs.consultant,
      {
        question: 'What problems can a Dubai restaurant marketing consultant help with?',
        answer:
          'Typical problems include weak footfall, unclear positioning, low repeat visits, weak launch planning, poor Google Maps visibility, delivery performance, and campaign reporting.',
      },
      {
        question: 'Is this useful for cafes as well as restaurants?',
        answer:
          'Yes. Cafes need specific thinking around dayparts, routine, loyalty, local visibility, product heroes, and community behavior.',
      },
    ],
  },
  {
    slug: 'fb-marketing-consultant-uae',
    cluster: 'Dubai / UAE commercial intent',
    priority: 'A',
    keyword: 'F&B marketing consultant UAE',
    title: 'F&B Marketing Consultant UAE for Restaurants, Cafes, QSR & Franchises',
    metaTitle: 'F&B Marketing Consultant UAE',
    metaDescription:
      'UAE F&B marketing consulting for restaurants, cafes, QSR, cloud kitchens, and franchise teams needing practical commercial growth systems.',
    intro: [
      'An F&B marketing consultant in the UAE should understand that restaurant growth is not a generic digital marketing problem. It is a mix of positioning, local demand, menu behavior, delivery visibility, retention, and measurement.',
      'ASHMO.IO is built around practical growth systems for restaurant, cafe, QSR, cloud kitchen, and franchise teams that need clearer decisions before more activity.',
    ],
    failurePoint:
      'Many F&B teams scale tactics across cities or branches without adapting to local demand pockets, channel economics, customer routines, and store-level performance.',
    framework: [
      'Assess the brand, market, and operating model.',
      'Map growth constraints by branch, channel, and customer segment.',
      'Build UAE-relevant campaign, local SEO, delivery, and CRM systems.',
      'Create templates and dashboards that make decisions visible.',
      'Review momentum monthly and adjust by evidence.',
    ],
    checklist: [
      'Segment the business by outlet type, region, and channel mix.',
      'Audit Google profiles and delivery listings branch by branch.',
      'Review campaign spend as a percentage of revenue.',
      'Identify repeat-visit and CRM gaps.',
      'Build a 90-day plan before expanding the scope.',
    ],
    localAngle:
      'UAE F&B demand is shaped by city, community, tourism, work routines, delivery coverage, seasonality, and price perception. The same campaign rarely works everywhere without adaptation.',
    example:
      'A franchise group may need one central campaign idea, but each branch still needs local asset rollout, Maps hygiene, staff briefing, offers, and branch-level reporting.',
    ctaLabel: 'Request a Growth Review',
    ctaHref: growthReviewHref,
    relatedSlugs: ['fb-consultant-dubai', 'restaurant-marketing-consultant-dubai', 'restaurant-kpi-dashboard', 'restaurant-crm-strategy'],
    faqs: [
      ...sharedFaqs.consultant,
      {
        question: 'Who is F&B marketing consulting for?',
        answer:
          'It is for restaurant founders, cafe operators, QSR teams, franchise groups, cloud kitchens, and marketers who need sharper growth decisions.',
      },
      {
        question: 'Can F&B consulting cover multiple UAE branches?',
        answer:
          'Yes, but branch-level reporting matters. A multi-location plan should separate central brand systems from local store activation.',
      },
    ],
  },
  {
    slug: 'cafe-marketing-strategy',
    cluster: 'Cafe and coffee shop growth',
    priority: 'A',
    keyword: 'cafe marketing strategy',
    title: 'Cafe Marketing Strategy for Dayparts, Routine, Loyalty & Local Demand',
    metaTitle: 'Cafe Marketing Strategy for Growth',
    metaDescription:
      'A practical cafe marketing strategy covering dayparts, local community, Google Maps, content, loyalty, product heroes, and repeat visits.',
    intro: [
      'Cafe marketing strategy is different from general restaurant marketing because cafes often win through routine. Morning coffee, working sessions, afternoon treats, evening catch-ups, and weekend habits all need different growth logic.',
      'A strong strategy connects dayparts, product heroes, local visibility, content, loyalty, and repeat behavior instead of treating the cafe like a generic social media account.',
    ],
    failurePoint:
      'Cafes fail when they chase attention without building habit. A beautiful feed does not automatically create morning frequency, local discovery, or repeat visits.',
    framework: [
      'Define the cafe occasion by daypart.',
      'Choose product heroes for each routine.',
      'Build local visibility through Maps, reviews, photos, and neighborhood relevance.',
      'Use content to reinforce rituals, not only aesthetics.',
      'Connect loyalty and CRM to frequency.',
    ],
    checklist: [
      'Map sales by daypart and product category.',
      'Identify the strongest repeatable customer routines.',
      'Audit Google photos, reviews, menu links, and nearby search visibility.',
      'Build campaign themes around breakfast, work, afternoon, evening, and weekend occasions.',
      'Measure frequency, repeat rate, and AOV alongside reach.',
    ],
    localAngle:
      'Dubai cafes often compete at the level of neighborhood habit, premium identity, parking convenience, delivery coverage, and visual social proof. Strategy should include those realities.',
    example:
      'A cafe with strong weekend traffic but weak weekday mornings may need office-area sampling, breakfast bundles, Maps improvement, and CRM nudges more than another influencer visit.',
    ctaLabel: 'Request a Cafe Growth Review',
    ctaHref: growthReviewHref,
    relatedSlugs: ['cafe-marketing-ideas', 'coffee-shop-marketing', 'how-to-start-a-cafe-in-dubai', 'local-seo-for-restaurants'],
    faqs: [
      {
        question: 'What is cafe marketing strategy?',
        answer:
          'It is the plan for building awareness, local discovery, repeat routines, product demand, loyalty, and measurable revenue for a cafe.',
      },
      {
        question: 'What should cafes market first?',
        answer:
          'Start with the strongest customer occasion: morning coffee, breakfast, work-friendly visits, dessert, specialty drinks, delivery, or community moments.',
      },
      {
        question: 'How can a cafe increase repeat customers?',
        answer:
          'Build rituals, loyalty triggers, product consistency, CRM journeys, review loops, and campaign rhythms that give customers reasons to return.',
      },
      {
        question: 'Do cafes need local SEO?',
        answer:
          'Yes. Cafes are highly local businesses, and many customers compare options through Google Maps, photos, reviews, hours, and menu links.',
      },
    ],
  },
  {
    slug: 'cafe-marketing-ideas',
    cluster: 'Cafe and coffee shop growth',
    priority: 'B',
    keyword: 'cafe marketing ideas',
    title: 'Cafe Marketing Ideas That Build Repeat Visits, Not Just Reach',
    metaTitle: 'Cafe Marketing Ideas for Repeat Visits',
    metaDescription:
      'Practical cafe marketing ideas for breakfast, office routines, evening visits, loyalty, local community, content, and seasonal campaigns.',
    intro: [
      'Cafe marketing ideas should help build routines, not just short bursts of attention. The best ideas make a customer remember when, why, and with whom they should come back.',
      'Use ideas by business problem: morning traffic, afternoon slump, local community, new product adoption, delivery, loyalty, or seasonal demand.',
    ],
    failurePoint:
      'Most cafe idea lists over-index on social media gimmicks. They miss the real levers: daypart behavior, product habit, proximity, review trust, and frequency.',
    framework: [
      'Morning ideas: breakfast bundles, office drops, subscription cards, and commuter offers.',
      'Afternoon ideas: dessert pairings, remote-work rituals, limited drinks, and group offers.',
      'Community ideas: neighborhood boards, creator tables, school partnerships, and local events.',
      'Loyalty ideas: visit streaks, product passports, VIP tastings, and birthday journeys.',
      'Content ideas: product rituals, staff picks, customer occasions, and behind-the-counter cues.',
    ],
    checklist: [
      'Choose the daypart or behavior before choosing the idea.',
      'Make the offer easy for staff to explain.',
      'Capture reviews, CRM opt-ins, or repeat intent.',
      'Use Google posts and photos for local discovery.',
      'Review sales mix and repeat behavior after the campaign.',
    ],
    localAngle:
      'In Dubai, cafe ideas should consider office towers, residential communities, schools, malls, gyms, tourist areas, and seasonal routines.',
    example:
      'A cafe near offices can run a five-day morning pass, combine it with local LinkedIn outreach, place QR cards in nearby offices, and trigger a second-week CRM offer.',
    ctaLabel: 'Open the Cafe Content Calendar',
    ctaHref: templatesHref,
    relatedSlugs: ['cafe-marketing-strategy', 'coffee-shop-marketing', 'restaurant-marketing-ideas', 'restaurant-loyalty-program'],
    faqs: [
      {
        question: 'What are good cafe marketing ideas?',
        answer:
          'Good ideas are built around routines: morning coffee, work sessions, dessert moments, community events, loyalty, limited products, and local partnerships.',
      },
      {
        question: 'How can cafes market without discounting?',
        answer:
          'Use product rituals, bundles, limited launches, community partnerships, loyalty mechanics, review growth, and better local visibility before relying on discounts.',
      },
      {
        question: 'What content should cafes post?',
        answer:
          'Post product heroes, routines, customer occasions, preparation details, team moments, local relevance, offers with context, and proof from reviews or community.',
      },
      {
        question: 'How often should a cafe run campaigns?',
        answer:
          'A cafe can run one clear campaign per month, supported by weekly content and local activity, instead of constant disconnected promotions.',
      },
    ],
  },
  {
    slug: 'coffee-shop-marketing',
    cluster: 'Cafe and coffee shop growth',
    priority: 'B',
    keyword: 'coffee shop marketing',
    title: 'Coffee Shop Marketing for Local Habit, Product Memory & Repeat Visits',
    metaTitle: 'Coffee Shop Marketing for Local Growth',
    metaDescription:
      'Coffee shop marketing guidance for local habit, Google Maps, coffee rituals, subscriptions, loyalty, content, and repeat customer growth.',
    intro: [
      'Coffee shop marketing works best when it builds habit. Customers do not only buy coffee; they buy a routine, a place, a product memory, and a reliable moment in their day.',
      'The strategy should connect local discovery, product identity, service consistency, content, reviews, loyalty, and frequency.',
    ],
    failurePoint:
      'Coffee shops often look visually polished but commercially vague. If the customer cannot remember why this shop fits their morning, workday, or weekend routine, content alone will not solve it.',
    framework: [
      'Own a clear coffee occasion or product memory.',
      'Make Google Maps and review quality part of marketing operations.',
      'Use content to show ritual, craft, convenience, and community.',
      'Create loyalty mechanics that reward frequency without destroying margin.',
      'Review daypart sales and customer feedback weekly.',
    ],
    checklist: [
      'Define your signature drink, food pairing, or customer ritual.',
      'Refresh Google photos weekly.',
      'Ask for reviews at high-satisfaction moments.',
      'Build a simple loyalty or subscription mechanic.',
      'Track daypart sales and repeat behavior.',
    ],
    localAngle:
      'Dubai coffee shops compete across specialty quality, convenience, aesthetics, parking, delivery, and neighborhood identity. Marketing should make the shop easy to choose in that specific context.',
    example:
      'A specialty coffee shop may create a monthly roaster story, tasting flight, subscriber perk, and Maps photo update so product depth supports both loyalty and discovery.',
    ctaLabel: 'Request a Growth Review',
    ctaHref: growthReviewHref,
    relatedSlugs: ['cafe-marketing-strategy', 'cafe-marketing-ideas', 'local-seo-for-restaurants', 'google-business-profile-for-restaurants'],
    faqs: [
      {
        question: 'How do you market a coffee shop?',
        answer:
          'Market the shop around local discovery, product ritual, customer routine, reviews, loyalty, content, and clear reasons to return.',
      },
      {
        question: 'Do coffee shops need subscriptions?',
        answer:
          'Not always, but subscriptions or prepaid passes can work when they fit a real routine and protect margin.',
      },
      {
        question: 'What is the best channel for coffee shop marketing?',
        answer:
          'Google Maps, Instagram/TikTok, CRM, local partnerships, and in-store prompts all matter. The best channel depends on the shop location and target routine.',
      },
      {
        question: 'How can a coffee shop improve loyalty?',
        answer:
          'Improve consistency, build rituals, collect customer data, reward frequency, and create moments customers want to repeat.',
      },
    ],
  },
  {
    slug: 'restaurant-social-media-marketing',
    cluster: 'Restaurant marketing authority',
    priority: 'B',
    keyword: 'restaurant social media marketing',
    title: 'Restaurant Social Media Marketing That Supports Real Demand',
    metaTitle: 'Restaurant Social Media Marketing System',
    metaDescription:
      'Restaurant social media marketing guidance for reels, content calendars, offers, influencer filters, UGC, local relevance, and KPIs.',
    intro: [
      'Restaurant social media marketing should do more than make the brand look active. It should support footfall, delivery demand, product memory, reviews, CRM capture, and campaign rhythm.',
      'The best content systems help a restaurant show what to order, when to visit, why it matters locally, and how the brand feels in real life.',
    ],
    failurePoint:
      'The trap is vanity engagement. A reel can perform well while the restaurant still fails to improve footfall, repeat visits, reviews, or delivery conversion.',
    framework: [
      'Build content pillars around product, people, place, proof, promotion, and process.',
      'Connect every content burst to a commercial objective.',
      'Use short-form video for product memory, not random trends.',
      'Filter influencers by audience fit, local relevance, and conversion path.',
      'Report social alongside revenue, reviews, CRM, and campaign outcomes.',
    ],
    checklist: [
      'Create a monthly content calendar tied to campaigns and menu heroes.',
      'Plan capture days around actual food, service, and customer occasions.',
      'Use UGC and reviews as trust assets.',
      'Link content to reservations, ordering, Maps, or CRM where relevant.',
      'Review saves, shares, profile actions, clicks, and business outcomes.',
    ],
    localAngle:
      'Dubai restaurant social media needs visual quality, local context, influencer discipline, and proof that matches how customers compare places across Instagram, TikTok, Google, and delivery apps.',
    example:
      'A burger concept launching a new item can combine prep video, staff tasting, customer proof, delivery thumbnail refresh, influencer shortlist, and a seven-day offer tracked in the KPI dashboard.',
    ctaLabel: 'Audit the Content System',
    ctaHref: strategyCallHref,
    relatedSlugs: ['restaurant-marketing', 'restaurant-marketing-ideas', 'cafe-marketing-ideas', 'restaurant-marketing-plan'],
    faqs: [
      {
        question: 'What should restaurants post on social media?',
        answer:
          'Post menu heroes, customer occasions, proof, offers, behind-the-scenes detail, local relevance, launch moments, reviews, and practical reasons to visit or order.',
      },
      {
        question: 'Are influencers useful for restaurants?',
        answer:
          'They can be useful when audience fit, location, offer, content rights, and conversion tracking are clear. Random influencer meals rarely create a durable system.',
      },
      {
        question: 'How should restaurants measure social media?',
        answer:
          'Measure profile actions, clicks, reservations, orders, reviews, CRM growth, reach quality, and campaign contribution, not engagement alone.',
      },
      {
        question: 'How often should restaurants post?',
        answer:
          'Consistency matters, but the right cadence depends on content quality, campaign rhythm, and operating capacity. A useful calendar beats daily filler.',
      },
    ],
  },
  {
    slug: 'restaurant-seo',
    cluster: 'Local visibility and restaurant SEO',
    priority: 'A',
    keyword: 'restaurant SEO',
    title: 'Restaurant SEO Across Website, Google Maps, Menus, Reviews & Local Pages',
    metaTitle: 'Restaurant SEO for Local Demand',
    metaDescription:
      'Restaurant SEO guide covering website SEO, Google Maps, menu pages, reviews, local pages, schema, photos, and high-intent search demand.',
    intro: [
      'Restaurant SEO is the system that helps customers find, compare, and choose a restaurant when intent already exists. It covers more than blog posts or title tags.',
      'For restaurants and cafes, SEO includes Google Maps, menus, reviews, photos, location pages, local citations, structured data, and clear content that matches how people search.',
    ],
    failurePoint:
      'Restaurants underuse SEO because they think only social media drives discovery. Meanwhile high-intent customers are comparing nearby options, menus, photos, reviews, and opening hours before they decide.',
    framework: [
      'Technical foundation: crawlable pages, canonical URLs, sitemap, and fast mobile pages.',
      'Local foundation: Google Business Profile, categories, reviews, photos, hours, and menu links.',
      'Content foundation: location pages, menu pages, cuisine/occasion pages, FAQs, and useful guides.',
      'Authority foundation: citations, local links, media mentions, and partner references.',
      'Measurement foundation: Search Console, GBP insights, calls, direction requests, and conversions.',
    ],
    checklist: [
      'Create crawlable pages for key services, locations, menus, and guides.',
      'Optimize Google Business Profile categories, hours, photos, menu, and review responses.',
      'Add structured data where accurate.',
      'Build local citations and relevant backlinks.',
      'Track impressions, clicks, calls, direction requests, and enquiries.',
    ],
    localAngle:
      'Dubai restaurant SEO should account for neighborhood searches, mall/location intent, cuisine searches, brunch and family occasions, delivery queries, and bilingual or tourist search behavior where relevant.',
    example:
      'A multi-branch restaurant can build individual location pages with unique neighborhood context, branch photos, menu links, reviews, opening hours, parking notes, and internal links from cuisine and campaign pages.',
    ctaLabel: 'Request an SEO Audit',
    ctaHref: growthReviewHref,
    relatedSlugs: ['local-seo-for-restaurants', 'google-business-profile-for-restaurants', 'restaurant-marketing', 'restaurant-marketing-consultant-dubai'],
    faqs: [
      ...sharedFaqs.localSeo,
      {
        question: 'What is restaurant SEO?',
        answer:
          'Restaurant SEO improves visibility in organic search, Google Maps, menu searches, local pages, reviews, and high-intent customer queries.',
      },
      {
        question: 'Do restaurants need blog content for SEO?',
        answer:
          'Useful guides can help, but restaurants usually need strong local pages, menu visibility, Google profiles, reviews, and technical basics first.',
      },
    ],
  },
  {
    slug: 'local-seo-for-restaurants',
    cluster: 'Local visibility and restaurant SEO',
    priority: 'A',
    keyword: 'local SEO for restaurants',
    title: 'Local SEO for Restaurants: Capture Nearby Customers Before Competitors Do',
    metaTitle: 'Local SEO for Restaurants',
    metaDescription:
      'A practical local SEO checklist for restaurants and cafes covering Google Business Profile, menu pages, reviews, photos, location pages, and reporting.',
    intro: [
      'Local SEO for restaurants is about being visible when people nearby are ready to choose. That includes Google Maps, near-me searches, menu visibility, reviews, photos, local pages, and consistent business information.',
      'A strong local SEO system helps restaurants capture high-intent demand without depending only on paid ads or discounts.',
    ],
    failurePoint:
      'Local SEO fails when it is treated as a one-time setup. Restaurant profiles need active photos, reviews, menu updates, posts, accurate hours, and branch-level reporting.',
    framework: [
      'Google Business Profile setup and category discipline.',
      'Photos, menu links, products, posts, attributes, and Q&A.',
      'Review generation and response system.',
      'Location pages with unique local context.',
      'Local links, citations, and weekly reporting.',
    ],
    checklist: [
      'Audit name, address, phone, hours, categories, menu, website, and ordering links.',
      'Upload fresh food, team, exterior, interior, and menu photos.',
      'Create a review request and response cadence.',
      'Build location pages with unique neighborhood information.',
      'Track profile views, calls, direction requests, clicks, and local rankings.',
    ],
    localAngle:
      'Local SEO is especially important in Dubai because customers compare options quickly through Maps, photos, reviews, menus, parking, location context, and social proof.',
    example:
      'A restaurant in a dense neighborhood can gain more qualified visits by improving category selection, weekly photo cadence, review replies, menu links, and a branch page that answers parking, timings, and nearby landmarks.',
    ctaLabel: 'Request a Local Visibility Audit',
    ctaHref: growthReviewHref,
    relatedSlugs: ['restaurant-seo', 'google-business-profile-for-restaurants', 'restaurant-marketing-consultant-dubai', 'coffee-shop-marketing'],
    faqs: [
      ...sharedFaqs.localSeo,
      {
        question: 'How long does local SEO take for restaurants?',
        answer:
          'Foundational improvements can be made quickly, but stronger visibility usually compounds over weeks and months through reviews, photos, profile activity, local pages, and authority.',
      },
      {
        question: 'Should every branch have its own page?',
        answer:
          'Yes, if each branch has real unique information. Branch pages should include address, hours, photos, menu links, local context, and relevant FAQs.',
      },
    ],
  },
  {
    slug: 'google-business-profile-for-restaurants',
    cluster: 'Local visibility and restaurant SEO',
    priority: 'B',
    keyword: 'Google Business Profile for restaurants',
    title: 'Google Business Profile for Restaurants: Checklist for Visibility & Trust',
    metaTitle: 'Google Business Profile for Restaurants',
    metaDescription:
      'Optimize Google Business Profile for restaurants with categories, photos, menus, reviews, posts, hours, attributes, Q&A, and reporting.',
    intro: [
      'Google Business Profile is one of the highest-intent marketing assets a restaurant owns. It appears when people are comparing nearby options, checking menus, reading reviews, and deciding where to go.',
      'For restaurants, GBP should be managed like a live storefront, not a directory listing.',
    ],
    failurePoint:
      'Profiles become weak when hours are outdated, photos are old, categories are wrong, reviews go unanswered, menu links break, and no one tracks calls or direction requests.',
    framework: [
      'Set the right primary and secondary categories.',
      'Keep hours, holiday hours, address, phone, menu, and ordering links accurate.',
      'Upload fresh photos by type: food, exterior, interior, team, menu, and ambience.',
      'Use reviews, Q&A, posts, products, and attributes to reduce customer uncertainty.',
      'Review performance weekly and compare by branch.',
    ],
    checklist: [
      'Check categories and attributes.',
      'Update menu and order/reservation links.',
      'Add photos every week.',
      'Reply to reviews with useful, specific responses.',
      'Track calls, directions, website clicks, and popular times.',
    ],
    localAngle:
      'In Dubai, GBP can influence decisions around proximity, parking, delivery, cuisine type, family suitability, opening hours, ambience, and branch trust.',
    example:
      'A cafe can upload morning product photos on Sunday, update special hours before holidays, reply to reviews by theme, add menu highlights, and link to the correct branch landing page.',
    ctaLabel: 'Download the GBP Checklist',
    ctaHref: templatesHref,
    relatedSlugs: ['local-seo-for-restaurants', 'restaurant-seo', 'coffee-shop-marketing', 'restaurant-marketing-plan'],
    faqs: [
      ...sharedFaqs.localSeo,
      {
        question: 'How often should restaurants update Google Business Profile?',
        answer:
          'Review the profile weekly. Update photos, posts, reviews, menu links, hours, and branch details whenever they change.',
      },
      {
        question: 'What photos should restaurants add?',
        answer:
          'Add clear photos of hero dishes, menus, exterior, interior, team, seating, ambience, packaging, and branch-specific cues.',
      },
    ],
  },
  {
    slug: 'restaurant-grand-opening-ideas',
    cluster: 'Launch and opening growth',
    priority: 'B',
    keyword: 'restaurant grand opening ideas',
    title: 'Restaurant Grand Opening Ideas That Create Momentum Beyond Opening Week',
    metaTitle: 'Restaurant Grand Opening Ideas',
    metaDescription:
      'Restaurant grand opening ideas for pre-launch buzz, soft openings, local partnerships, influencer filters, reviews, CRM, and post-launch retention.',
    intro: [
      'Restaurant grand opening ideas should do more than fill a room for one night. A strong opening creates local awareness, captures first-wave demand, generates proof, and turns trial into repeat visits.',
      'The best ideas are planned across pre-launch, soft opening, opening week, and the first 30 days after launch.',
    ],
    failurePoint:
      'Many openings create a spike and then lose momentum. The team celebrates launch-week attention but misses reviews, CRM capture, local partnerships, and follow-up journeys.',
    framework: [
      'Pre-launch: tease the concept, build a waitlist, brief local partners, and prepare Maps.',
      'Soft opening: invite high-fit guests, test service, capture feedback, and fix operations.',
      'Opening week: coordinate offers, content, PR, influencers, signage, and staff scripts.',
      'Post-launch: drive second visits, reviews, CRM journeys, and neighborhood reminders.',
      'Measurement: track footfall, sales, reviews, opt-ins, and repeat visits.',
    ],
    checklist: [
      'Set launch goals beyond attendance.',
      'Create invite tiers for partners, neighbors, creators, and loyalists.',
      'Prepare Google profile, photos, menu links, and review prompts.',
      'Capture content and customer data during the launch.',
      'Plan the first 30 days before opening week begins.',
    ],
    localAngle:
      'Dubai openings need clarity on neighborhood fit, influencer quality, media relevance, parking/location instructions, delivery-app readiness, and post-launch retention.',
    example:
      'A restaurant opening can run a neighbor preview, founder table, creator tasting, limited opening menu, review prompt, and second-visit offer triggered within seven days.',
    ctaLabel: 'Build a Launch Plan',
    ctaHref: growthReviewHref,
    relatedSlugs: ['restaurant-launch-marketing', 'restaurant-marketing-plan', 'how-to-start-a-cafe-in-dubai', 'local-seo-for-restaurants'],
    faqs: [
      {
        question: 'What are good restaurant grand opening ideas?',
        answer:
          'Useful ideas include soft openings, neighborhood previews, creator tastings, local partnerships, review drives, first-week offers, and second-visit campaigns.',
      },
      {
        question: 'When should restaurant launch marketing start?',
        answer:
          'Start 60 to 90 days before opening when possible, especially for local partnerships, Google setup, content capture, and waitlist building.',
      },
      {
        question: 'Should restaurants invite influencers to grand openings?',
        answer:
          'Only when audience fit, content quality, geography, usage rights, and follow-up conversion paths are clear.',
      },
      {
        question: 'How do you keep momentum after opening week?',
        answer:
          'Use reviews, CRM, retargeting, local partnerships, content, and second-visit offers to convert launch trial into repeat behavior.',
      },
    ],
  },
  {
    slug: 'restaurant-launch-marketing',
    cluster: 'Launch and opening growth',
    priority: 'A',
    keyword: 'restaurant launch marketing',
    title: 'Restaurant Launch Marketing: Pre-Launch, Opening Week & First 30 Days',
    metaTitle: 'Restaurant Launch Marketing Plan',
    metaDescription:
      'Restaurant launch marketing system for pre-launch buzz, opening week execution, local PR, influencers, offers, reviews, CRM, and retention.',
    intro: [
      'Restaurant launch marketing should be treated as a staged system, not a single announcement. The work starts before the doors open and continues through the first month while habits are still forming.',
      'A strong launch connects positioning, local demand, PR, content, influencer selection, Maps readiness, offers, reviews, and CRM capture.',
    ],
    failurePoint:
      'Launches underperform when promotion starts too late, the opening offer is disconnected from the brand, staff are under-briefed, or no one captures the first wave of demand.',
    framework: [
      '60-90 days out: positioning, target audience, local list, content plan, and launch calendar.',
      '30 days out: Google profile, photos, media list, creator shortlist, and soft-opening plan.',
      'Opening week: coordinated content, signage, offer, staff script, review prompt, and capture.',
      'First 30 days: retargeting, CRM, second-visit campaign, review recovery, and KPI review.',
      'Post-launch: convert learnings into the regular monthly marketing rhythm.',
    ],
    checklist: [
      'Define the launch audience and core message.',
      'Build local and media prospect lists.',
      'Prepare GBP, menu links, opening hours, and photo assets.',
      'Create the launch content and offer calendar.',
      'Track launch sales, transactions, reviews, opt-ins, and repeat visits.',
    ],
    localAngle:
      'Dubai launches should plan for local community discovery, creator fit, business district or residential catchments, delivery platform readiness, and seasonal timing.',
    example:
      'A cloud kitchen launch should prioritize delivery listing quality, thumbnails, bundles, review generation, paid search around cuisine intent, and CRM for repeat orders rather than an in-store opening event.',
    ctaLabel: 'Request Launch Advisory',
    ctaHref: growthReviewHref,
    relatedSlugs: ['restaurant-grand-opening-ideas', 'restaurant-marketing-plan', 'cloud-kitchen-marketing', 'google-business-profile-for-restaurants'],
    faqs: [
      {
        question: 'What is restaurant launch marketing?',
        answer:
          'It is the planned system for creating awareness, trial, local proof, reviews, CRM capture, and repeat visits before and after opening.',
      },
      {
        question: 'How early should a restaurant launch plan start?',
        answer:
          'Start 60 to 90 days before opening when possible. At minimum, start before the store, profile, menu, media, and content assets are needed.',
      },
      {
        question: 'What should be measured during launch?',
        answer:
          'Measure sales, transactions, AOV, reviews, opt-ins, bookings or orders, content reach quality, delivery listing performance, and second visits.',
      },
      {
        question: 'Does launch marketing differ for cloud kitchens?',
        answer:
          'Yes. Cloud kitchens need delivery-first listing quality, aggregator visibility, offer testing, reviews, and repeat-order journeys.',
      },
    ],
  },
  {
    slug: 'how-to-start-a-cafe-in-dubai',
    cluster: 'Cafe and coffee shop growth',
    priority: 'A',
    keyword: 'how to start a cafe in Dubai',
    title: 'How to Start a Cafe in Dubai: Commercial Checklist Before You Spend',
    metaTitle: 'How to Start a Cafe in Dubai',
    metaDescription:
      'A practical Dubai cafe startup checklist covering concept, location, menu, lease thinking, permits note, marketing, launch, and KPIs.',
    intro: [
      'Learning how to start a cafe in Dubai should begin with commercial clarity, not decor, logo, or Instagram moodboards. The concept has to survive location economics, customer routine, menu margin, staffing, launch cost, and repeat demand.',
      'This guide focuses on the marketing and commercial decisions founders should make before committing serious spend.',
    ],
    failurePoint:
      'Many cafe projects over-invest in aesthetics before proving the customer occasion, location logic, menu heroes, pricing, launch plan, and repeat-visit system.',
    framework: [
      'Concept: define the customer, occasion, price perception, and reason to choose.',
      'Location: test catchment, parking, footfall, dayparts, competition, and delivery radius.',
      'Menu: build hero products, margin logic, bundles, and operational simplicity.',
      'Launch: prepare local visibility, content, partnerships, soft opening, and reviews.',
      'Measurement: track sales, transactions, AOV, daypart mix, repeat rate, and feedback.',
    ],
    checklist: [
      'Write a one-page concept and positioning brief.',
      'Validate the location against real routines, not only rent or appearance.',
      'Build a menu margin and hero-item plan.',
      'Prepare Google profile, website page, content, and launch assets early.',
      'Speak to qualified legal, licensing, and operations advisors for permit and compliance details.',
    ],
    localAngle:
      'Dubai cafe founders must think through licensing, landlord conditions, fit-out timelines, parking, mall or street dynamics, competition, delivery coverage, and seasonal trading patterns. This page is commercial guidance, not legal advice.',
    example:
      'A premium neighborhood cafe should test whether it owns a morning routine, work-friendly occasion, specialty product memory, or weekend social role before committing to a large fit-out and broad marketing spend.',
    ctaLabel: 'Request a Cafe Setup Review',
    ctaHref: strategyCallHref,
    relatedSlugs: ['cafe-marketing-strategy', 'restaurant-launch-marketing', 'restaurant-menu-engineering', 'restaurant-kpi-dashboard'],
    faqs: [
      {
        question: 'What should I decide before starting a cafe in Dubai?',
        answer:
          'Clarify concept, customer occasion, location logic, menu margin, launch plan, operating model, budget, and repeat-visit system before spending heavily.',
      },
      {
        question: 'Is this legal advice for opening a cafe?',
        answer:
          'No. This is commercial and marketing guidance. Licensing, legal, lease, and compliance questions should be reviewed with qualified UAE professionals.',
      },
      {
        question: 'How important is location for a Dubai cafe?',
        answer:
          'Location is critical because daypart routines, footfall, parking, competition, delivery radius, and rent pressure can define the business model.',
      },
      {
        question: 'When should cafe marketing start?',
        answer:
          'Marketing should start during concept and pre-launch planning, before opening week. Local visibility, content, partnerships, and review systems need preparation.',
      },
    ],
  },
  {
    slug: 'restaurant-consultant-dubai',
    cluster: 'Dubai / UAE commercial intent',
    priority: 'A',
    keyword: 'restaurant consultant Dubai',
    title: 'Restaurant Consultant Dubai for Strategy, Launch, Growth & Measurement',
    metaTitle: 'Restaurant Consultant Dubai',
    metaDescription:
      'Restaurant consulting in Dubai for concept clarity, launch planning, menu growth, local demand, delivery, CRM, KPIs, and commercial decisions.',
    intro: [
      'A restaurant consultant in Dubai should help founders and operators make better commercial decisions before expensive execution begins.',
      'ASHMO.IO focuses on the growth side of restaurant consulting: positioning, launch, menu and offer logic, local demand, delivery visibility, CRM, reporting, and founder advisory.',
    ],
    failurePoint:
      'Consulting becomes weak when it only produces opinions. Useful work must connect the concept, customer behavior, location, menu, channels, and KPIs.',
    framework: [
      'Diagnose the business model and growth constraint.',
      'Clarify concept, positioning, target occasion, and offer logic.',
      'Build launch, local marketing, delivery, and retention systems.',
      'Use dashboards and templates to make decisions visible.',
      'Review progress through a practical 90-day cadence.',
    ],
    checklist: [
      'Bring current numbers, menu, campaign history, reviews, and channel data.',
      'Define whether the priority is launch, recovery, expansion, or retention.',
      'Review menu economics and hero items.',
      'Audit local visibility and customer proof.',
      'Set weekly KPIs for decision-making.',
    ],
    localAngle:
      'Dubai restaurant consulting must account for location density, premium positioning, delivery apps, tourism, residential and office catchments, and branch-level competition.',
    example:
      'A restaurant preparing a second branch may need launch planning, local SEO, signage and content assets, branch scorecards, and a 30-day post-opening retention plan.',
    ctaLabel: 'Book a Consultation',
    ctaHref: strategyCallHref,
    relatedSlugs: ['restaurant-marketing-consultant-dubai', 'fb-consultant-dubai', 'restaurant-marketing-plan', 'restaurant-menu-engineering'],
    faqs: [
      ...sharedFaqs.consultant,
      {
        question: 'What does a restaurant consultant do?',
        answer:
          'A restaurant consultant helps diagnose problems, structure decisions, improve concept or growth systems, and guide execution across launch, marketing, menu, local demand, and measurement.',
      },
      {
        question: 'Is this operations consulting?',
        answer:
          'ASHMO.IO focuses on growth, marketing, commercial strategy, and decision systems rather than kitchen operations or legal compliance.',
      },
    ],
  },
  {
    slug: 'fb-consultant-dubai',
    cluster: 'Dubai / UAE commercial intent',
    priority: 'A',
    keyword: 'F&B consultant Dubai',
    title: 'F&B Consultant Dubai for Concept, Brand, Menu, Launch & Growth Systems',
    metaTitle: 'F&B Consultant Dubai',
    metaDescription:
      'Dubai F&B consulting for restaurant and cafe founders needing concept clarity, brand strategy, menu logic, launch planning, local demand, and KPIs.',
    intro: [
      'An F&B consultant in Dubai should help founders connect concept, brand, menu, launch, local demand, and measurement before the business becomes expensive to correct.',
      'ASHMO.IO supports restaurant, cafe, QSR, cloud kitchen, and franchise teams through growth systems and practical commercial decision tools.',
    ],
    failurePoint:
      'F&B projects often become fragmented: brand in one file, menu in another, marketing in another, and numbers somewhere else. Growth improves when these decisions are connected.',
    framework: [
      'Clarify the concept and customer occasion.',
      'Pressure-test brand, menu, pricing, and location logic.',
      'Build launch and local visibility systems.',
      'Create campaign, CRM, delivery, and KPI rhythms.',
      'Turn strategy into templates teams can use.',
    ],
    checklist: [
      'Write concept, audience, and category role clearly.',
      'Review menu heroes and margin-sensitive offers.',
      'Plan launch before opening assets are due.',
      'Prepare local SEO and Google Business Profile.',
      'Use dashboards to track whether growth is improving.',
    ],
    localAngle:
      'Dubai F&B consulting should account for competitive density, real estate pressure, delivery behavior, premium expectations, tourism, and different demand pockets across communities.',
    example:
      'A new cafe concept may need positioning, menu heroing, a launch checklist, Google profile setup, local partnerships, and a 90-day marketing plan before investing in large campaigns.',
    ctaLabel: 'Request a Consultation',
    ctaHref: strategyCallHref,
    relatedSlugs: ['restaurant-consultant-dubai', 'fb-marketing-consultant-uae', 'how-to-start-a-cafe-in-dubai', 'restaurant-launch-marketing'],
    faqs: [
      ...sharedFaqs.consultant,
      {
        question: 'What does an F&B consultant help with?',
        answer:
          'Depending on scope, an F&B consultant may help with concept, brand, menu logic, launch, local demand, delivery, CRM, dashboards, and growth planning.',
      },
      {
        question: 'Can consulting help before a restaurant opens?',
        answer:
          'Yes. Pre-opening is often the best time to clarify positioning, menu heroes, launch plan, local visibility, and KPI systems.',
      },
    ],
  },
  {
    slug: 'restaurant-menu-engineering',
    cluster: 'Commercial growth systems',
    priority: 'A',
    keyword: 'restaurant menu engineering',
    title: 'Restaurant Menu Engineering for Pricing, Profit, Heroes & Better Decisions',
    metaTitle: 'Restaurant Menu Engineering',
    metaDescription:
      'Restaurant menu engineering guide covering stars, plowhorses, puzzles, dogs, margin, pricing, bundles, item storytelling, and menu decisions.',
    intro: [
      'Restaurant menu engineering is the discipline of understanding which items drive popularity, profit, brand memory, and operational pressure.',
      'A useful menu system helps the team decide what to promote, reprice, rename, bundle, photograph, improve, or remove.',
    ],
    failurePoint:
      'Menus become expensive when every item is treated equally. High-volume low-margin items can hide profit leaks, while high-margin items may fail because they are poorly positioned or photographed.',
    framework: [
      'Classify items by popularity and profitability: stars, plowhorses, puzzles, and dogs.',
      'Review food cost, gross margin, preparation complexity, and brand role.',
      'Create menu heroes and bundles with margin awareness.',
      'Improve naming, descriptions, photos, placement, and staff scripts.',
      'Review sales mix weekly after changes.',
    ],
    checklist: [
      'Export item sales, price, cost, and margin.',
      'Classify items by contribution and popularity.',
      'Identify hero items for content, delivery, and campaigns.',
      'Build bundles that protect margin.',
      'Decide which items to improve, promote, reprice, simplify, or remove.',
    ],
    localAngle:
      'Dubai restaurants should connect menu engineering to delivery-app behavior, premium perception, tourist and resident preferences, daypart demand, and branch-level sales mix.',
    example:
      'A high-margin signature dish with low sales may need better placement, photography, menu description, staff recommendation, and campaign support before it is judged as a failure.',
    ctaLabel: 'Request a Menu Audit',
    ctaHref: growthReviewHref,
    relatedSlugs: ['restaurant-marketing-plan', 'restaurant-delivery-marketing', 'restaurant-kpi-dashboard', 'how-to-start-a-cafe-in-dubai'],
    faqs: [
      {
        question: 'What is restaurant menu engineering?',
        answer:
          'It is the process of analyzing menu items by sales, margin, popularity, brand role, and operational fit to make better pricing and promotion decisions.',
      },
      {
        question: 'What are menu stars, plowhorses, puzzles, and dogs?',
        answer:
          'Stars are popular and profitable, plowhorses are popular but lower margin, puzzles are profitable but less popular, and dogs are weak on both dimensions.',
      },
      {
        question: 'How often should restaurants review menus?',
        answer:
          'Review sales mix weekly and run deeper menu engineering monthly or quarterly, especially after launches, price changes, or campaign pushes.',
      },
      {
        question: 'Does menu engineering help marketing?',
        answer:
          'Yes. It tells marketing which items deserve content, bundles, offers, photography, delivery promotion, and staff recommendation.',
      },
    ],
  },
  {
    slug: 'restaurant-delivery-marketing',
    cluster: 'Commercial growth systems',
    priority: 'B',
    keyword: 'restaurant delivery marketing',
    title: 'Restaurant Delivery Marketing Without Discount Addiction',
    metaTitle: 'Restaurant Delivery Marketing',
    metaDescription:
      'Restaurant delivery marketing guide covering aggregators, thumbnails, offers, menu visibility, reviews, packaging, repeat orders, and margin discipline.',
    intro: [
      'Restaurant delivery marketing is not just joining aggregator apps or running discounts. Delivery needs its own visibility, menu, photo, offer, review, packaging, and repeat-order system.',
      'The goal is to grow quality orders without training customers to only buy when discounts are high.',
    ],
    failurePoint:
      'Delivery volume can hide weak contribution. Discounts, commissions, packaging, refunds, and poor repeat behavior can make a busy channel commercially fragile.',
    framework: [
      'Audit listing quality: thumbnails, titles, categories, menu flow, ratings, and delivery time.',
      'Build delivery-specific hero items and bundles.',
      'Use offers with margin guardrails and clear test windows.',
      'Improve packaging and review recovery.',
      'Use CRM and inserts to drive repeat behavior where allowed.',
    ],
    checklist: [
      'Compare each platform by visibility, rating, conversion, AOV, and contribution.',
      'Refresh thumbnails and item descriptions.',
      'Build bundles for delivery occasions.',
      'Track discount cost, commission, packaging, refunds, and repeat rate.',
      'Create lapsed-order and second-order journeys.',
    ],
    localAngle:
      'Dubai delivery competition is intense, and aggregator visibility can change quickly. Restaurants need disciplined listing management and margin-aware offer testing.',
    example:
      'A cloud kitchen can improve performance by replacing weak thumbnails, simplifying menu structure, launching a margin-safe combo, recovering reviews, and tracking repeat orders by platform.',
    ctaLabel: 'Request a Delivery Audit',
    ctaHref: growthReviewHref,
    relatedSlugs: ['cloud-kitchen-marketing', 'restaurant-menu-engineering', 'restaurant-crm-strategy', 'restaurant-kpi-dashboard'],
    faqs: [
      {
        question: 'What is restaurant delivery marketing?',
        answer:
          'It is the system for improving delivery visibility, conversion, order quality, reviews, repeat orders, and margin across aggregator and direct channels.',
      },
      {
        question: 'Should restaurants use delivery discounts?',
        answer:
          'Use discounts carefully with margin guardrails, test windows, and repeat-order tracking. Constant discounts can weaken contribution and customer behavior.',
      },
      {
        question: 'What improves delivery app visibility?',
        answer:
          'Strong ratings, relevant categories, high-quality photos, good conversion, delivery reliability, menu clarity, offers, and platform-specific merchandising can help.',
      },
      {
        question: 'How should delivery performance be measured?',
        answer:
          'Measure order volume, AOV, contribution after commission and discounts, rating, cancellation, refund rate, repeat orders, and platform mix.',
      },
    ],
  },
  {
    slug: 'cloud-kitchen-marketing',
    cluster: 'Commercial growth systems',
    priority: 'B',
    keyword: 'cloud kitchen marketing',
    title: 'Cloud Kitchen Marketing for Delivery-First Brands',
    metaTitle: 'Cloud Kitchen Marketing',
    metaDescription:
      'Cloud kitchen marketing guide for delivery-first visibility, aggregator listings, menu structure, offers, reviews, repeat orders, and retention.',
    intro: [
      'Cloud kitchen marketing has fewer physical cues than a restaurant, so the digital storefront has to work harder. Listings, photos, menu architecture, ratings, offers, packaging, and repeat behavior become the brand experience.',
      'The goal is not simply more orders. It is profitable, repeatable delivery demand.',
    ],
    failurePoint:
      'Cloud kitchens often launch multiple brands without enough differentiation, weak item photography, unclear menus, discount dependence, and poor retention paths.',
    framework: [
      'Define the brand and cuisine position clearly.',
      'Optimize aggregator listings, thumbnails, categories, and menu flow.',
      'Build hero items and bundles for delivery occasions.',
      'Protect contribution with offer guardrails.',
      'Use reviews, packaging, inserts, and CRM to support repeat orders.',
    ],
    checklist: [
      'Audit each brand for distinct positioning.',
      'Improve photos, names, descriptions, and category placement.',
      'Track order economics after commission, discounts, and packaging.',
      'Respond to reviews and fix recurring complaints.',
      'Build second-order and lapsed-customer journeys.',
    ],
    localAngle:
      'UAE cloud kitchens compete heavily on aggregator surfaces. Visibility, ratings, cuisine fit, delivery time, and packaging quality can matter as much as paid media.',
    example:
      'A delivery-first burger brand can test a hero combo, refresh thumbnails, reduce menu clutter, add review recovery, and use inserts to move customers toward a repeat journey.',
    ctaLabel: 'Request a Cloud Kitchen Review',
    ctaHref: growthReviewHref,
    relatedSlugs: ['restaurant-delivery-marketing', 'restaurant-menu-engineering', 'restaurant-crm-strategy', 'restaurant-kpi-dashboard'],
    faqs: [
      {
        question: 'How do you market a cloud kitchen?',
        answer:
          'Market through aggregator visibility, clear brand positioning, strong food photography, menu structure, margin-aware offers, reviews, packaging, and repeat-order journeys.',
      },
      {
        question: 'Do cloud kitchens need a website?',
        answer:
          'A website can help with brand trust, direct ordering, SEO, and investor or partner credibility, but aggregator performance usually remains central.',
      },
      {
        question: 'What is the biggest cloud kitchen marketing mistake?',
        answer:
          'Launching too many similar brands and relying on discounts before building listing quality, product memory, reviews, and retention.',
      },
      {
        question: 'How should cloud kitchens track marketing?',
        answer:
          'Track order volume, AOV, contribution, platform mix, repeat rate, rating, refund rate, cancellation, and campaign ROI.',
      },
    ],
  },
  {
    slug: 'restaurant-loyalty-program',
    cluster: 'Commercial growth systems',
    priority: 'B',
    keyword: 'restaurant loyalty program',
    title: 'Restaurant Loyalty Program That Increases Frequency Without Killing Margin',
    metaTitle: 'Restaurant Loyalty Program Strategy',
    metaDescription:
      'Restaurant loyalty program guide covering frequency, rewards, tiers, CRM journeys, margin control, VIPs, lapsed customers, and repeat visits.',
    intro: [
      'A restaurant loyalty program should increase frequency, not simply discount customers who would have returned anyway.',
      'The best loyalty systems are built around customer behavior, visit cadence, margins, and lifecycle moments: first visit, second visit, active regular, VIP, at-risk, and lapsed.',
    ],
    failurePoint:
      'Loyalty fails when rewards are too generic, margin is ignored, staff do not explain the program, or the restaurant does not segment customers by behavior.',
    framework: [
      'Define the behavior the program should increase.',
      'Choose rewards that fit margin and brand perception.',
      'Segment customers by frequency, value, and recency.',
      'Build journeys for first, second, VIP, at-risk, and lapsed customers.',
      'Track incremental visits, not just signups.',
    ],
    checklist: [
      'Set a frequency or retention objective.',
      'Calculate reward cost and breakage.',
      'Train staff to explain the program clearly.',
      'Connect loyalty to CRM messages.',
      'Review repeat rate, redemption, incremental revenue, and margin.',
    ],
    localAngle:
      'Dubai restaurants should design loyalty around real habits: office lunch, family weekends, premium cafe routines, delivery repeat, Ramadan/Eid cycles, and VIP recognition.',
    example:
      'A cafe can use a visit-based reward for morning frequency, a birthday moment for emotional loyalty, and a lapsed-customer journey after 30 days of inactivity.',
    ctaLabel: 'Request a Loyalty Audit',
    ctaHref: growthReviewHref,
    relatedSlugs: ['restaurant-crm-strategy', 'cafe-marketing-strategy', 'restaurant-marketing-plan', 'restaurant-kpi-dashboard'],
    faqs: [
      {
        question: 'What makes a good restaurant loyalty program?',
        answer:
          'A good program increases profitable frequency, is easy to understand, fits the brand, protects margin, and connects to CRM journeys.',
      },
      {
        question: 'Should loyalty programs use points?',
        answer:
          'Points can work, but visits, tiers, perks, product rewards, and VIP access may fit better depending on the brand and customer behavior.',
      },
      {
        question: 'How do restaurants measure loyalty?',
        answer:
          'Measure repeat rate, visit frequency, customer value, redemption, incremental sales, churn, and margin impact.',
      },
      {
        question: 'Can small restaurants run loyalty programs?',
        answer:
          'Yes. Start with simple repeat-visit mechanics, CRM capture, and clear staff scripts before investing in complex technology.',
      },
    ],
  },
  {
    slug: 'restaurant-crm-strategy',
    cluster: 'Commercial growth systems',
    priority: 'B',
    keyword: 'restaurant CRM strategy',
    title: 'Restaurant CRM Strategy for First Orders, Repeat Visits, Lapsed Guests & VIPs',
    metaTitle: 'Restaurant CRM Strategy',
    metaDescription:
      'Restaurant CRM strategy guide covering first order, second visit, lapsed guests, VIPs, segmentation, WhatsApp/email journeys, and retention.',
    intro: [
      'Restaurant CRM strategy turns anonymous customers into reachable relationships. It helps a restaurant move beyond hoping customers return and starts designing reasons for them to come back.',
      'A useful CRM strategy covers first order, second visit, active regulars, lapsed customers, VIPs, birthdays, feedback, and recovery moments.',
    ],
    failurePoint:
      'CRM fails when restaurants collect data without journeys. A customer database has little value if no one knows what message should go to whom, when, and why.',
    framework: [
      'Capture customer data ethically at high-intent moments.',
      'Segment by recency, frequency, value, channel, and preference.',
      'Build lifecycle journeys for first, second, regular, at-risk, lapsed, and VIP customers.',
      'Connect CRM with offers, content, reviews, feedback, and loyalty.',
      'Measure repeat behavior and incremental contribution.',
    ],
    checklist: [
      'Audit current customer data sources.',
      'Define consent and channel rules.',
      'Create core segments and journey triggers.',
      'Write message templates for each lifecycle moment.',
      'Track repeat rate, redemption, unsubscribes, and revenue contribution.',
    ],
    localAngle:
      'UAE restaurants often use WhatsApp, email, loyalty platforms, delivery data, and in-store capture. The strategy must respect consent and avoid becoming noisy broadcast marketing.',
    example:
      'A restaurant can send a thank-you and review prompt after the first visit, a second-visit reason within seven days, a VIP preview after repeated visits, and a recovery message after inactivity.',
    ctaLabel: 'Map the CRM System',
    ctaHref: strategyCallHref,
    relatedSlugs: ['restaurant-loyalty-program', 'restaurant-delivery-marketing', 'restaurant-marketing-plan', 'restaurant-kpi-dashboard'],
    faqs: [
      {
        question: 'What is restaurant CRM?',
        answer:
          'Restaurant CRM is the process of collecting customer data with permission, segmenting customers, and sending relevant messages that support repeat visits and loyalty.',
      },
      {
        question: 'What CRM journeys should restaurants build first?',
        answer:
          'Start with first visit, second visit, lapsed customer, birthday, feedback, review request, and VIP journeys.',
      },
      {
        question: 'Is WhatsApp useful for restaurant CRM?',
        answer:
          'It can be useful when consent, relevance, timing, and message frequency are handled carefully. Broadcast noise can damage trust.',
      },
      {
        question: 'How should CRM success be measured?',
        answer:
          'Measure repeat rate, visit frequency, redemption, incremental revenue, churn reduction, feedback, unsubscribes, and contribution margin.',
      },
    ],
  },
  {
    slug: 'restaurant-kpi-dashboard',
    cluster: 'Commercial growth systems',
    priority: 'A',
    keyword: 'restaurant KPI dashboard',
    title: 'Restaurant KPI Dashboard: The Weekly Numbers Owners Should Actually Review',
    metaTitle: 'Restaurant KPI Dashboard Template',
    metaDescription:
      'Build a restaurant KPI dashboard tracking sales, transactions, AOV, delivery mix, repeat rate, complaints, margins, and marketing efficiency.',
    intro: [
      'A restaurant KPI dashboard should help a founder or operator make better decisions, not just collect numbers.',
      'The best dashboard shows whether sales quality is improving, transactions are growing, AOV is healthy, delivery is helping or hurting margin, and marketing activity is creating repeatable demand.',
    ],
    failurePoint:
      'Dashboards fail when they show too many metrics without decisions. A weekly pack should make it clear what to scale, fix, investigate, or stop.',
    framework: [
      'Sales quality: sales, transactions, AOV, daypart, and category mix.',
      'Channel quality: dine-in, takeaway, delivery, direct, and aggregator mix.',
      'Customer quality: repeat rate, CRM growth, loyalty activity, and lapsed customers.',
      'Operating signals: complaints, refunds, ratings, and service recovery.',
      'Marketing efficiency: spend, ROI, campaign contribution, and pipeline actions.',
    ],
    checklist: [
      'Track 12 core KPIs weekly.',
      'Compare actuals to target and prior period.',
      'Separate branch, channel, and campaign views.',
      'Add decision notes, risks, and next actions.',
      'Review the dashboard in a fixed weekly cadence.',
    ],
    localAngle:
      'Dubai and UAE operators should watch delivery mix, rent pressure, seasonal demand, weekday/weekend splits, branch-level differences, and campaign contribution carefully.',
    example:
      'A weekly CEO pack can show that revenue is flat but transactions are down, AOV is up because of delivery bundles, complaints are rising, and repeat rate is weakening. That points to a different decision than total sales alone.',
    ctaLabel: 'Download the KPI Dashboard',
    ctaHref: templatesHref,
    relatedSlugs: ['restaurant-marketing-plan', 'restaurant-menu-engineering', 'restaurant-delivery-marketing', 'restaurant-crm-strategy'],
    faqs: [
      {
        question: 'What KPIs should a restaurant dashboard track?',
        answer:
          'Track sales, transactions, AOV, footfall, conversion, delivery mix, gross margin, marketing spend, repeat rate, complaints, reviews, and campaign ROI.',
      },
      {
        question: 'How often should restaurants review KPIs?',
        answer:
          'Review core KPIs weekly, with deeper monthly reviews for strategy, budget, menu, campaigns, and customer behavior.',
      },
      {
        question: 'What makes a KPI dashboard useful?',
        answer:
          'A useful dashboard connects numbers to decisions. It should show trend, target, owner, diagnosis, and next action.',
      },
      {
        question: 'Can a KPI dashboard help marketing?',
        answer:
          'Yes. It shows whether campaigns are improving sales quality, repeat behavior, channel mix, and contribution rather than only generating activity.',
      },
    ],
  },
];

export const getRestaurantSeoPage = (slug: string) => restaurantSeoPages.find((page) => page.slug === slug);

export const getRestaurantSeoHref = (slug: string) => `/${slug}/`;

export const restaurantSeoClusters = Array.from(new Set(restaurantSeoPages.map((page) => page.cluster))).map((cluster) => ({
  cluster,
  pages: restaurantSeoPages.filter((page) => page.cluster === cluster),
}));
