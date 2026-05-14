import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(__dirname, "../..");
const outputRoot = path.join(
  workspaceRoot,
  "outputs",
  "ashmo-30-day-social-posts-2026-05-15"
);

const palette = {
  background: "#FAF9F7",
  surface: "#F0EEEB",
  text: "#1A1A1A",
  secondary: "#6B6560",
  tertiary: "#A39E98",
  accent: "#C4956A",
  accentDeep: "#A87B52",
  border: "#E5E2DD",
  olive: "#6F7564",
  inkSoft: "#34302C",
};

const startDate = new Date(Date.UTC(2026, 4, 15));

const posts = [
  {
    pillar: "Merchant Mindset",
    theme: "selling",
    visual: "Selling is not persuasion. It is perception.",
    support: "The best sellers notice what the customer is already feeling.",
    caption:
      "The best sellers are rarely the loudest people in the room.\n\nThey are the ones who notice hesitation before it becomes an objection.\nThey notice habit before it becomes loyalty.\nThey notice when the customer is asking for price, but really looking for reassurance.\n\nSelling gets easier when you stop trying to win the moment and start reading it properly.\n\nMost business intelligence begins before the dashboard.\n\n#ashmo #selling #merchantmindset #customerpsychology #founderthinking",
  },
  {
    pillar: "Brand Strategy",
    theme: "discipline",
    visual: "A brand strategy is not a file. It is a discipline.",
    support: "The work begins after the workshop ends.",
    caption:
      "The problem with most brand strategies is not the strategy.\n\nIt is that nobody follows through past week two.\n\nThe words sound good.\nThe slides look polished.\nThe room agrees.\n\nThen reality returns.\nCampaigns get rushed.\nTeams improvise.\nStandards soften.\n\nA brand is built when the same idea is repeated clearly enough that the market starts repeating it back to you.\n\nThat part takes longer.\n\n#ashmo #brandstrategy #brandbuilding #consistency #marketing",
  },
  {
    pillar: "AI & Tools",
    theme: "judgement",
    visual: "AI is useful. Hype is not.",
    support: "Use it to multiply clear thinking, not replace judgement.",
    caption:
      "I use AI every day.\n\nBut not as a substitute for judgement.\n\nI use it to move faster through the friction around the work: drafts, structure, research, organisation, testing ideas, building rough versions before polishing.\n\nBut if the positioning is weak, the brief is vague, or the thinking is borrowed, AI only helps you produce noise faster.\n\nThe future belongs to people who know what should be accelerated.\n\nAnd what should never be outsourced.\n\n#ashmo #ai #foundertools #marketingtools #clearthinking",
  },
  {
    pillar: "Execution",
    theme: "patience",
    visual: "Patience is not passive.",
    support: "It is doing the work while the result takes its time.",
    caption:
      "Patience gets misunderstood because it looks inactive from the outside.\n\nBut real patience is not waiting.\n\nIt is repetition without applause.\nIt is discipline without immediate reward.\nIt is continuing the work before the market reflects it back to you.\n\nMost real progress is quiet.\n\nThat does not make it less valuable.\nOnly less visible.\n\n#ashmo #discipline #patience #execution #founderthinking",
  },
  {
    pillar: "Brand Growth",
    theme: "scale",
    visual: "The 80th outlet is where the truth shows up.",
    support: "Scale does not protect a brand. It exposes it.",
    caption:
      "The first outlet can run on energy.\n\nThe fifth can still survive on founder presence.\n\nThe 80th cannot.\n\nBy then, the system is speaking.\nThat is where you find out whether the brand was clear, whether the standards were real, and whether consistency was operational or decorative.\n\nScale does not create quality.\n\nIt reveals whether quality was built into the system from the beginning.\n\n#ashmo #brandbuilding #scale #restaurantbusiness #consistency",
  },
  {
    pillar: "Marketing",
    theme: "memory",
    visual: "Awareness is not being seen more. It is being remembered right.",
    support: "Visibility without memory is just expensive movement.",
    caption:
      "A lot of marketing confuses reach with awareness.\n\nReach means someone saw you.\nAwareness means they remember you in the right buying moment.\n\nThose are not the same thing.\n\nThe market does not reward noise for very long.\nIt rewards clear associations repeated consistently over time.\n\nThe question is not only: did people see it?\n\nThe better question is: what did they remember?\n\n#ashmo #brandawareness #marketingstrategy #brandmemory #founders",
  },
  {
    pillar: "Campaigns",
    theme: "briefs",
    visual: "Most campaigns fail before the creative is made.",
    support: "The ad gets blamed for a problem that started in the brief.",
    caption:
      "When a campaign underperforms, the ad usually takes the blame.\n\nBut many campaigns are already weak before the designer opens the file.\n\nThe audience is vague.\nThe offer is soft.\nThe proof is thin.\nThe reason to act is unclear.\n\nCreative can sharpen a strong idea.\nIt cannot rescue a confused one.\n\nBetter campaigns start before the campaign looks like a campaign.\n\n#ashmo #campaigns #creativebrief #marketing #strategy",
  },
  {
    pillar: "Positioning",
    theme: "clarity",
    visual: "Positioning feels abstract until the bill arrives.",
    support: "Every unclear choice becomes expensive downstream.",
    caption:
      "Most founders skip positioning because it feels abstract.\n\nLogos feel real.\nContent feels real.\nAds feel real.\n\nBut positioning decides whether all of those things are working in the same direction.\n\nWhen positioning is unclear, every downstream decision becomes heavier.\nThe team guesses.\nThe customer hesitates.\nThe market files you under something vague.\n\nClarity is not decoration.\nIt is infrastructure.\n\n#ashmo #positioning #brandstrategy #founders #clarity",
  },
  {
    pillar: "Creative",
    theme: "meta ads",
    visual: "Scroll-stopping is not the goal. Memory is.",
    support: "A good ad does more than interrupt. It leaves a trace.",
    caption:
      "After enough campaigns, you stop worshipping the hook.\n\nA hook matters.\nBut attention alone is a shallow victory.\n\nThe stronger question is whether the creative leaves the right memory behind.\n\nWhat is the customer meant to feel?\nWhat should they remember tomorrow?\nWhat association are we building with every impression?\n\nGood creative does not only stop the scroll.\nIt builds recognition.\n\n#ashmo #metaads #creative #advertising #brandbuilding",
  },
  {
    pillar: "Business Lessons",
    theme: "old markets",
    visual: "Old markets still teach business better than most courses.",
    support: "Before dashboards, there was the counter and the customer.",
    caption:
      "Old markets teach fast because they do not protect you from reality.\n\nThe customer is in front of you.\nThe hesitation is visible.\nThe objection is immediate.\nThe feedback is honest.\n\nBefore dashboards, there was the counter.\nBefore customer personas, there were actual customers.\n\nModern tools are powerful.\n\nBut the market still teaches the cleanest lessons.\n\n#ashmo #businesslessons #merchantmindset #customers #founderthinking",
  },
  {
    pillar: "Founder Thinking",
    theme: "writing",
    visual: "Founders should write even if no one reads it.",
    support: "Writing is not only content. It is a thinking tool.",
    caption:
      "Founders should write even if no one reads it.\n\nNot because every thought needs an audience.\n\nBecause writing forces you to see what you actually believe.\nIt exposes vague thinking.\nIt makes decisions clearer.\nIt turns experience into something you can reuse.\n\nPublishing is useful.\nBut clarity is the first reward.\n\nA founder who writes clearly usually starts building more clearly too.\n\n#ashmo #founderthinking #writing #clarity #building",
  },
  {
    pillar: "Founder Journey",
    theme: "middle years",
    visual: "The middle years are where the real business is built.",
    support: "Everyone documents the start and the win. Few document the long middle.",
    caption:
      "Everyone talks about the beginning and the breakthrough.\n\nAlmost nobody tells the truth about the long middle.\n\nThe years where the work is no longer new, but the result is not yet obvious.\nThe years where discipline has to replace excitement.\nThe years where you keep improving things most people cannot see yet.\n\nThat is where a lot of the real business is built.\n\nQuietly.\n\n#ashmo #founderjourney #building #discipline #entrepreneurship",
  },
  {
    pillar: "Execution",
    theme: "consistency",
    visual: "The exciting days do not build businesses. The boring ones do.",
    support: "If you show up for them.",
    caption:
      "The exciting days get the story.\n\nThe boring days build the business.\n\nThe follow-up.\nThe review.\nThe small correction.\nThe standard repeated one more time.\nThe work nobody posts about because it does not look dramatic.\n\nThose days compound because they are easy to underestimate.\n\nShowing up when it is boring is not a small thing.\n\nIt is the thing.\n\n#ashmo #execution #consistency #discipline #founders",
  },
  {
    pillar: "Productivity",
    theme: "founder work",
    visual: "Founder life is not tidy enough for most productivity advice.",
    support: "The system has to survive reality, not impress a notebook.",
    caption:
      "A lot of productivity advice is built for tidy jobs.\n\nFounder life is not tidy.\n\nThe day changes.\nPeople need answers.\nProblems arrive without asking.\nOpportunities interrupt the calendar.\n\nThe best system is not the prettiest one.\nIt is the one that helps you return to what matters after reality has pulled you away.\n\nA useful system survives contact with the day.\n\n#ashmo #productivity #founders #execution #priorities",
  },
  {
    pillar: "Marketing",
    theme: "framework",
    visual: "The best marketing framework is usually just better questions.",
    support: "Who is this for? Why now? Why us? What proof?",
    caption:
      "The best marketing framework I know is not complicated.\n\nIt asks the questions people try to skip.\n\nWho is this really for?\nWhat do they already believe?\nWhy should they care now?\nWhy should they trust us?\nWhat proof makes the promise feel real?\n\nA campaign gets stronger when the thinking gets sharper.\n\nMost of the work is asking the obvious questions properly.\n\n#ashmo #marketingstrategy #framework #customerpsychology #founders",
  },
  {
    pillar: "Operations",
    theme: "standards",
    visual: "Consistency is not a brand value. It is an operating system.",
    support: "If it lives only in the brand deck, it will not survive the rush.",
    caption:
      "Consistency sounds like a brand word.\n\nBut in a growing business, it becomes an operations problem.\n\nWho trains the team?\nWho checks the standard?\nWho protects the details when the day gets busy?\nWho notices when the customer experience starts drifting?\n\nThe brand deck can name the promise.\n\nOnly the operating system can keep it alive.\n\n#ashmo #operations #brandbuilding #standards #scale",
  },
  {
    pillar: "Selling",
    theme: "trust",
    visual: "The future of selling is not more reach. It is more trust.",
    support: "Reach is easier than ever. Belief is harder.",
    caption:
      "Reach keeps getting easier.\n\nMore channels.\nMore tools.\nMore automation.\nMore ways to appear in front of people.\n\nBut trust is moving in the opposite direction.\nPeople are more selective with attention, belief, and money.\n\nThe businesses that win will not only be the ones that reach more people.\n\nThey will be the ones people believe when they arrive.\n\n#ashmo #selling #trust #marketing #business",
  },
  {
    pillar: "AI & Tools",
    theme: "workflow",
    visual: "The best tools remove friction from work that already matters.",
    support: "They do not decide what should matter in the first place.",
    caption:
      "The AI tools that actually save time are not always the loudest ones.\n\nThey are the ones that remove friction from work you already understand.\n\nTurning rough notes into structure.\nComparing options.\nSummarising research.\nDrafting variations.\nHelping you move from idea to first version faster.\n\nTools are useful when they serve the work.\n\nThey become a distraction when they replace the decision.\n\n#ashmo #aitools #workflow #foundertools #execution",
  },
  {
    pillar: "Rebrands",
    theme: "alignment",
    visual: "Most rebrands fail before the designer opens a file.",
    support: "The visual change cannot fix an unclear business decision.",
    caption:
      "A rebrand usually fails before the design begins.\n\nNot because the logo is bad.\n\nBecause the business is unclear about what actually needs to change.\n\nIs the audience different?\nIs the promise sharper?\nIs the product better?\nIs the positioning more honest?\nIs the team ready to behave differently?\n\nA new identity can express a shift.\n\nIt cannot manufacture one.\n\n#ashmo #rebrand #brandstrategy #positioning #business",
  },
  {
    pillar: "Brand Growth",
    theme: "compounding",
    visual: "The brand decisions that matter most are rarely loud.",
    support: "They compound because they are repeated, not because they are dramatic.",
    caption:
      "Some brand decisions look small when you make them.\n\nThe phrase you keep using.\nThe standard you refuse to drop.\nThe product detail you protect.\nThe customer promise you repeat until the team is tired of hearing it.\n\nThese decisions rarely feel dramatic.\n\nBut over time, they become the shape people recognise.\n\nBrands compound through repetition.\n\n#ashmo #brandgrowth #compounding #brandstrategy #consistency",
  },
  {
    pillar: "Decision Making",
    theme: "priorities",
    visual: "Urgency is noisy. Importance is usually quieter.",
    support: "The work is learning to hear the difference.",
    caption:
      "Urgency is noisy.\n\nIt arrives with pressure, messages, deadlines, and other people’s anxiety.\n\nImportance is often quieter.\nIt sits underneath the day.\nThe strategic decision.\nThe difficult conversation.\nThe work that prevents ten future problems.\n\nA founder has to respect urgency without becoming owned by it.\n\nNot everything loud deserves the steering wheel.\n\n#ashmo #decisionmaking #priorities #founders #execution",
  },
  {
    pillar: "Founder Thinking",
    theme: "year one",
    visual: "Year one is loud with advice and short on useful truth.",
    support: "Most of what matters is learned by staying close to reality.",
    caption:
      "Year one is full of advice.\n\nSome of it helps.\nMuch of it sounds better than it works.\n\nThe useful truth is usually simpler and harder.\nStay close to the customer.\nProtect cash.\nDo not confuse motion with progress.\nFix small problems before they become culture.\nLearn faster than your pride wants to.\n\nThe first year teaches you what the business actually is.\n\n#ashmo #founderthinking #yearone #entrepreneurship #building",
  },
  {
    pillar: "Restaurant Growth",
    theme: "cafe business",
    visual: "A cafe is not only a concept. It is a daily operating promise.",
    support: "The customer does not experience your deck. They experience today.",
    caption:
      "A cafe concept can look beautiful on paper.\n\nBut the customer never experiences the deck.\n\nThey experience the queue.\nThe greeting.\nThe taste.\nThe cleanliness.\nThe speed.\nThe way the team handles pressure.\nThe feeling they leave with.\n\nFood and beverage is honest that way.\n\nThe brand has to work every day, not only on launch day.\n\n#ashmo #cafebusiness #restaurantgrowth #fandb #brandbuilding",
  },
  {
    pillar: "Scale",
    theme: "systems",
    visual: "Every business that scales eventually becomes a system of decisions.",
    support: "The founder cannot personally hold every detail forever.",
    caption:
      "In the beginning, a business can run on instinct.\n\nThe founder sees everything.\nDecides everything.\nCorrects everything.\n\nBut scale changes the question.\nCan the right decisions happen when the founder is not in the room?\nCan the standard survive handover?\nCan the team understand the why, not only the task?\n\nGrowth is not only more locations, people, or revenue.\n\nIt is better decision architecture.\n\n#ashmo #scale #systems #founders #businessgrowth",
  },
  {
    pillar: "Brand Operations",
    theme: "training",
    visual: "A standard that is not trained is only a wish.",
    support: "The brand lives in what the team can repeat under pressure.",
    caption:
      "Every brand has standards.\n\nAt least on paper.\n\nThe real question is whether the team can repeat them under pressure.\n\nDuring the rush.\nDuring staff changes.\nDuring expansion.\nDuring the days when nobody from head office is watching.\n\nA standard that is not trained, checked, corrected, and protected is only a wish.\n\nBrands are built in repetition.\n\n#ashmo #brandoperations #training #standards #consistency",
  },
  {
    pillar: "Storytelling",
    theme: "brand story",
    visual: "The best brands are built on stories, not features.",
    support: "Features explain what you sell. Stories explain why it matters.",
    caption:
      "Features help people understand what you sell.\n\nStories help them understand why it matters.\n\nA product can be copied.\nA promotion can be matched.\nA menu item can be imitated.\n\nBut the meaning around a brand is harder to steal when it is rooted in a real story.\n\nThat is why the best brands do not only list advantages.\n\nThey create memory.\n\n#ashmo #storytelling #brandstory #brandbuilding #marketing",
  },
  {
    pillar: "Discipline",
    theme: "motivation",
    visual: "Motivation is useful. Discipline is reusable.",
    support: "Build the system for the days when the feeling disappears.",
    caption:
      "Motivation is useful when it appears.\n\nBut it is not a serious operating system.\n\nThe work still needs to happen when the feeling is gone.\nWhen the week is heavy.\nWhen the result is delayed.\nWhen nobody is paying attention yet.\n\nThat is why discipline matters.\n\nNot as punishment.\nAs continuity.\n\n#ashmo #discipline #execution #founderthinking #consistency",
  },
  {
    pillar: "Customer Psychology",
    theme: "choice",
    visual: "Customers do not choose brands logically first.",
    support: "They choose what feels familiar, safe, useful, or meaningful.",
    caption:
      "Customers use logic.\n\nBut not always first.\n\nOften, they choose what feels familiar enough to trust, useful enough to try, safe enough to buy, or meaningful enough to repeat.\n\nThis is why brand matters.\n\nNot as decoration.\nAs the set of signals that helps a customer decide before they can explain the decision clearly.\n\nThe feeling comes first more often than we admit.\n\n#ashmo #customerpsychology #brandstrategy #marketing #selling",
  },
  {
    pillar: "Brand Memory",
    theme: "signals",
    visual: "A brand is a memory system.",
    support: "Every touchpoint teaches the market what to expect next.",
    caption:
      "A brand is not only what you say.\n\nIt is what the market learns to expect from you.\n\nEvery touchpoint teaches something.\nThe product.\nThe tone.\nThe service.\nThe packaging.\nThe ad.\nThe way you handle mistakes.\n\nWhen those signals align, memory gets stronger.\nWhen they drift, trust gets weaker.\n\nBrand building is memory building.\n\n#ashmo #brandmemory #brandbuilding #consistency #marketing",
  },
  {
    pillar: "Building",
    theme: "quiet assets",
    visual: "Build quiet assets before you need loud results.",
    support: "Trust, clarity, systems, and reputation all take time.",
    caption:
      "Some of the most valuable business assets are quiet while you are building them.\n\nTrust.\nClarity.\nSystems.\nReputation.\nTaste.\nA point of view.\nA team that understands the standard.\n\nThey do not always create immediate noise.\n\nBut when the moment comes, they make the visible work stronger.\n\nThe loud result usually depends on quiet assets built earlier.\n\n#ashmo #building #founderthinking #brandstrategy #execution",
  },
];

const formats = [
  { key: "4x5", label: "4:5", width: 1080, height: 1350 },
  { key: "1x1", label: "1:1", width: 1080, height: 1080 },
];

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function addDays(date, days) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function weightedLength(text) {
  return [...text].reduce((sum, char) => {
    if (char === " ") return sum + 0.35;
    if ("ilI.,'".includes(char)) return sum + 0.35;
    if ("mwMW@#".includes(char)) return sum + 1.25;
    return sum + 0.82;
  }, 0);
}

function wrapText(text, maxWeight) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (weightedLength(candidate) <= maxWeight || !current) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);
  return lines;
}

function visualFontSize(text, format) {
  const length = weightedLength(text);
  if (format.key === "1x1") {
    if (length > 62) return 50;
    if (length > 52) return 54;
    if (length > 42) return 58;
    return 64;
  }

  if (length > 68) return 56;
  if (length > 58) return 62;
  if (length > 46) return 70;
  return 78;
}

function layoutVariant(index) {
  return index % 4;
}

function fitVisualText(text, format, maxWidth) {
  let fontSize = visualFontSize(text, format);
  const minFontSize = format.key === "1x1" ? 44 : 50;
  const maxLines = format.key === "1x1" ? 5 : 6;

  while (fontSize >= minFontSize) {
    const maxWeight = Math.max(8, Math.floor(maxWidth / (fontSize * 0.74)));
    const lines = wrapText(text, maxWeight);
    if (lines.length <= maxLines) {
      return {
        fontSize,
        lines,
        lineHeight: Math.round(fontSize * 1.1),
      };
    }
    fontSize -= 4;
  }

  const maxWeight = Math.max(8, Math.floor(maxWidth / (minFontSize * 0.78)));
  return {
    fontSize: minFontSize,
    lines: wrapText(text, maxWeight),
    lineHeight: Math.round(minFontSize * 1.1),
  };
}

function makeSvg(post, index, format, date) {
  const { width, height } = format;
  const margin = format.key === "1x1" ? 82 : 88;
  const variant = layoutVariant(index);
  const supportSize = format.key === "1x1" ? 31 : 34;
  const visualXOffset = variant === 2 ? 35 : 0;
  const textWidth = width - margin * 2 - visualXOffset;
  const fitted = fitVisualText(post.visual, format, textWidth);
  const fontSize = fitted.fontSize;
  const visualLines = fitted.lines;
  const lineHeight = fitted.lineHeight;
  const supportMaxWeight = Math.max(20, Math.floor(textWidth / (supportSize * 0.74)));
  const supportLines = wrapText(post.support, supportMaxWeight);
  const supportLineHeight = Math.round(supportSize * 1.42);
  const topY = format.key === "1x1" ? 110 : 126;
  const visualBlockHeight = visualLines.length * lineHeight;
  const supportBlockHeight = supportLines.length * supportLineHeight;
  const centerY = Math.round(height * (format.key === "1x1" ? 0.48 : 0.49));
  const visualStartY = centerY - Math.round((visualBlockHeight + supportBlockHeight + 42) / 2);
  const number = String(index + 1).padStart(2, "0");
  const x = margin;
  const maxWidth = width - margin * 2;
  const dateLabel = formatDate(date);

  const accentShapes = [
    `<rect x="${width - margin - 108}" y="${topY - 8}" width="108" height="4" fill="${palette.accent}"/>`,
    `<circle cx="${width - margin - 46}" cy="${topY + 12}" r="46" fill="${palette.surface}"/><circle cx="${width - margin - 46}" cy="${topY + 12}" r="14" fill="${palette.accent}"/>`,
    `<rect x="${margin}" y="${height - margin - 150}" width="${maxWidth}" height="1" fill="${palette.border}"/><rect x="${margin}" y="${height - margin - 150}" width="92" height="3" fill="${palette.accent}"/>`,
    `<path d="M ${width - margin - 130} ${topY - 28} L ${width - margin} ${topY - 28} L ${width - margin} ${topY + 102} Z" fill="${palette.surface}"/>`,
  ];

  const visualText = visualLines
    .map(
      (line, lineIndex) =>
        `<tspan x="${x}" dy="${lineIndex === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`
    )
    .join("");

  const supportY = visualStartY + visualBlockHeight + 54;
  const supportText = supportLines
    .map(
      (line, lineIndex) =>
        `<tspan x="${x}" dy="${lineIndex === 0 ? 0 : supportLineHeight}">${escapeXml(line)}</tspan>`
    )
    .join("");

  const bottomY = height - margin;
  const ruleY = bottomY - 74;
  const largeGhost = variant === 1
    ? `<text x="${width - margin}" y="${height - 154}" text-anchor="end" font-family="Georgia, serif" font-size="${format.key === "1x1" ? 230 : 285}" font-weight="700" fill="${palette.surface}" opacity="0.72">${number}</text>`
    : "";

  const sideMark = variant === 2
    ? `<rect x="${margin}" y="${topY + 68}" width="5" height="${Math.min(visualBlockHeight + supportBlockHeight + 96, height - 390)}" fill="${palette.accent}"/>`
    : "";

  const visualX = x + visualXOffset;
  const supportX = visualX;
  const adjustedVisualText = visualLines
    .map(
      (line, lineIndex) =>
        `<tspan x="${visualX}" dy="${lineIndex === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`
    )
    .join("");
  const adjustedSupportText = supportLines
    .map(
      (line, lineIndex) =>
        `<tspan x="${supportX}" dy="${lineIndex === 0 ? 0 : supportLineHeight}">${escapeXml(line)}</tspan>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${palette.background}"/>
  <rect x="28" y="28" width="${width - 56}" height="${height - 56}" fill="none" stroke="${palette.border}" stroke-width="1"/>
  ${largeGhost}
  ${accentShapes[variant]}
  ${sideMark}
  <text x="${margin}" y="${topY}" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="600" fill="${palette.accentDeep}" letter-spacing="0">${escapeXml(post.pillar.toUpperCase())}</text>
  <text x="${margin}" y="${topY + 40}" font-family="Inter, Arial, sans-serif" font-size="22" fill="${palette.tertiary}" letter-spacing="0">DAY ${number} / ${dateLabel}</text>
  <text x="${visualX}" y="${visualStartY}" font-family="Georgia, 'Times New Roman', serif" font-size="${fontSize}" font-weight="700" fill="${palette.text}" letter-spacing="0">${variant === 2 ? adjustedVisualText : visualText}</text>
  <text x="${supportX}" y="${supportY}" font-family="Inter, Arial, sans-serif" font-size="${supportSize}" font-weight="400" fill="${palette.secondary}" letter-spacing="0">${variant === 2 ? adjustedSupportText : supportText}</text>
  <rect x="${margin}" y="${ruleY}" width="${maxWidth}" height="1" fill="${palette.border}"/>
  <text x="${margin}" y="${bottomY}" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="700" fill="${palette.inkSoft}" letter-spacing="0">ashmo</text>
  <text x="${width - margin}" y="${bottomY}" text-anchor="end" font-family="Inter, Arial, sans-serif" font-size="22" fill="${palette.secondary}" letter-spacing="0">ashmo.io</text>
</svg>`;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

function csvCell(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function captionFile(post, index, date, postDirName) {
  const number = String(index + 1).padStart(2, "0");
  return `# Day ${number} — ${post.visual}

Date: ${formatDate(date)}
Suggested publish time: 16:00 Asia/Dubai
Pillar: ${post.pillar}
Theme: ${post.theme}

## Caption

${post.caption}

## Visual Copy

${post.visual}

${post.support}

## Assets

- 4:5 PNG: \`${postDirName}/ashmo-day-${number}-4x5.png\`
- 1:1 PNG: \`${postDirName}/ashmo-day-${number}-1x1.png\`
- Editable SVGs are in the same folder.
`;
}

function readme() {
  return `# Ashmo 30-Day Social Post Pack

Generated on 2026-05-14 for the Ashmo workspace.

Schedule starts on 2026-05-15 and runs for 30 days through 2026-06-13.

## What is included

- 30 dated post folders
- 30 captions as individual \`caption.md\` files
- 60 PNG designs:
  - 1080x1350 for 4:5 posts
  - 1080x1080 for 1:1 posts
- Editable SVG source files for every design
- \`captions-all.md\` with every caption in one file
- \`content-calendar.csv\` for planning or importing
- Preview contact sheets for quick review

## Creative Direction

The designs follow the Ashmo editorial direction: warm off-white background, near-black typography, restrained amber accent, generous whitespace, and calm founder/operator language.
`;
}

async function writePostAssets(post, index) {
  const date = addDays(startDate, index);
  const number = String(index + 1).padStart(2, "0");
  const postDirName = `day-${number}-${formatDate(date)}-${slugify(post.theme)}`;
  const postDir = path.join(outputRoot, "posts", postDirName);
  await fs.mkdir(postDir, { recursive: true });

  for (const format of formats) {
    const svg = makeSvg(post, index, format, date);
    const svgPath = path.join(postDir, `ashmo-day-${number}-${format.key}.svg`);
    const pngPath = path.join(postDir, `ashmo-day-${number}-${format.key}.png`);
    await fs.writeFile(svgPath, svg, "utf8");
    await sharp(Buffer.from(svg)).png().toFile(pngPath);
  }

  await fs.writeFile(
    path.join(postDir, "caption.md"),
    captionFile(post, index, date, postDirName),
    "utf8"
  );

  return {
    ...post,
    number,
    date: formatDate(date),
    dir: postDirName,
  };
}

async function makeContactSheet(format) {
  const thumbWidth = format.key === "4x5" ? 216 : 216;
  const thumbHeight = format.key === "4x5" ? 270 : 216;
  const cols = 5;
  const rows = Math.ceil(posts.length / cols);
  const gap = 24;
  const pad = 40;
  const width = pad * 2 + cols * thumbWidth + (cols - 1) * gap;
  const height = pad * 2 + rows * thumbHeight + (rows - 1) * gap;
  const composites = [];

  for (let i = 0; i < posts.length; i += 1) {
    const date = addDays(startDate, i);
    const number = String(i + 1).padStart(2, "0");
    const postDirName = `day-${number}-${formatDate(date)}-${slugify(posts[i].theme)}`;
    const input = path.join(
      outputRoot,
      "posts",
      postDirName,
      `ashmo-day-${number}-${format.key}.png`
    );
    const buffer = await sharp(input)
      .resize(thumbWidth, thumbHeight, { fit: "cover" })
      .png()
      .toBuffer();
    composites.push({
      input: buffer,
      top: pad + Math.floor(i / cols) * (thumbHeight + gap),
      left: pad + (i % cols) * (thumbWidth + gap),
    });
  }

  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: palette.background,
    },
  })
    .composite(composites)
    .jpeg({ quality: 88 })
    .toFile(path.join(outputRoot, `preview-contact-sheet-${format.key}.jpg`));
}

async function main() {
  await fs.rm(outputRoot, { recursive: true, force: true });
  await fs.mkdir(path.join(outputRoot, "posts"), { recursive: true });

  const rows = [];
  for (let i = 0; i < posts.length; i += 1) {
    rows.push(await writePostAssets(posts[i], i));
  }

  const captions = rows
    .map((post) => {
      return `## Day ${post.number} — ${post.date}

**Pillar:** ${post.pillar}

**Visual:** ${post.visual}

${post.caption}
`;
    })
    .join("\n---\n\n");

  await fs.writeFile(path.join(outputRoot, "README.md"), readme(), "utf8");
  await fs.writeFile(path.join(outputRoot, "captions-all.md"), `# Captions All\n\n${captions}`, "utf8");

  const header = [
    "day",
    "date",
    "publish_time",
    "pillar",
    "theme",
    "visual_copy",
    "support_copy",
    "caption",
    "asset_4x5",
    "asset_1x1",
  ];
  const csvRows = rows.map((post) => {
    const dir = `posts/${post.dir}`;
    return [
      post.number,
      post.date,
      "16:00 Asia/Dubai",
      post.pillar,
      post.theme,
      post.visual,
      post.support,
      post.caption,
      `${dir}/ashmo-day-${post.number}-4x5.png`,
      `${dir}/ashmo-day-${post.number}-1x1.png`,
    ]
      .map(csvCell)
      .join(",");
  });
  await fs.writeFile(
    path.join(outputRoot, "content-calendar.csv"),
    `${header.map(csvCell).join(",")}\n${csvRows.join("\n")}\n`,
    "utf8"
  );

  const indexHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Ashmo 30-Day Social Pack</title>
  <style>
    body { margin: 0; font-family: Inter, Arial, sans-serif; background: ${palette.background}; color: ${palette.text}; }
    main { max-width: 1180px; margin: 0 auto; padding: 56px 24px; }
    h1 { font-family: Georgia, serif; font-size: 44px; line-height: 1.1; margin: 0 0 10px; }
    p { color: ${palette.secondary}; font-size: 17px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 22px; margin-top: 34px; }
    article { border-top: 1px solid ${palette.border}; padding-top: 16px; }
    img { width: 100%; height: auto; display: block; background: ${palette.surface}; }
    h2 { font-size: 14px; color: ${palette.secondary}; font-weight: 600; margin: 12px 0 0; }
  </style>
</head>
<body>
  <main>
    <h1>Ashmo 30-Day Social Pack</h1>
    <p>4:5 preview shown below. Square versions and captions are inside each day folder.</p>
    <section class="grid">
      ${rows
        .map((post) => {
          const img = `posts/${post.dir}/ashmo-day-${post.number}-4x5.png`;
          return `<article><img src="${img}" alt="Day ${post.number} social post"><h2>Day ${post.number} / ${post.date}</h2></article>`;
        })
        .join("\n      ")}
    </section>
  </main>
</body>
</html>`;
  await fs.writeFile(path.join(outputRoot, "preview.html"), indexHtml, "utf8");

  await makeContactSheet(formats[0]);
  await makeContactSheet(formats[1]);

  console.log(`Created ${posts.length} posts in ${outputRoot}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
