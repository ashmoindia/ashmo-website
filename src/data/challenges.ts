export type ChallengeStatus = 'draft' | 'active' | 'closed' | 'archived';
export type EntryStatus = 'new' | 'approved' | 'rejected' | 'shortlisted' | 'finalist' | 'winner';
export type SubmissionType = 'post' | 'reel' | 'upload';

export interface Challenge {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullInstructions: string[];
  instagramKeyword: string;
  hashtag: string;
  prize: string;
  startDate: string;
  endDate: string;
  coverImage?: string;
  rules: string[];
  judgingCriteria: string[];
  status: ChallengeStatus;
  showPublicEntries?: boolean;
}

export interface ChallengeEntry {
  id: string;
  challengeId: string;
  participantName: string;
  instagramUsername: string;
  instagramUserId?: string;
  email?: string;
  phone?: string;
  manychatContactId?: string;
  submissionType: SubmissionType;
  submissionUrl: string;
  uploadedMediaUrl?: string;
  aiToolsUsed: string[];
  caption?: string;
  status: EntryStatus;
  score?: number;
  adminNotes?: string;
  submittedAt: string;
}

export const challenges: Challenge[] = [
  {
    id: 'world-cup-poster-2026',
    title: 'AI World Cup Poster Challenge',
    slug: 'ai-world-cup-poster',
    shortDescription:
      'Create a poster concept for a fictional World Cup campaign using AI image, layout, and copy tools.',
    fullInstructions: [
      'Comment WORLDCUP on the Instagram announcement.',
      'We DM you back automatically. Reply with your Instagram post or reel link and the AI tools used.',
      'Your entry lands in our review dashboard. Shortlisted work is featured here under #AshmoAIChallenge.',
    ],
    instagramKeyword: 'WORLDCUP',
    hashtag: '#AshmoAIChallenge',
    prize: 'Featured finalist showcase plus a private AI creative workflow review with Ashmo.',
    startDate: '2026-06-01',
    endDate: '2026-06-21',
    rules: [
      'One entry per creator per challenge.',
      'Submissions must be public Instagram posts or reels until winners are announced.',
      'Entries must disclose the AI tools used.',
      'No copyrighted team marks, official tournament marks, or impersonation of real sponsors.',
    ],
    judgingCriteria: [
      'Creative idea and campaign clarity',
      'Visual execution and composition',
      'Quality of AI usage and iteration',
      'Caption, presentation, and public engagement',
    ],
    status: 'active',
    showPublicEntries: true,
  },
  {
    id: 'ai-brand-concept-sprint',
    title: 'AI Brand Concept Sprint',
    slug: 'ai-brand-concept-sprint',
    shortDescription:
      'Design a compact identity direction for a fictional cafe, product, or creator-led brand.',
    fullInstructions: [
      'Publish a carousel or reel showing the brand concept, including name, visual direction, and one sample touchpoint.',
      'Use the challenge hashtag and disclose the tools used.',
      'Submit the Instagram URL through the ManyChat DM flow.',
    ],
    instagramKeyword: 'BRAND',
    hashtag: '#AshmoBrandSprint',
    prize: 'Shortlisted creators enter the public showcase and creator database for future collaborations.',
    startDate: '2026-07-01',
    endDate: '2026-07-14',
    rules: [
      'The concept must be fictional or owned by the participant.',
      'No direct copying of existing brand identities.',
      'Entries must stay public for review and finalist announcement.',
    ],
    judgingCriteria: [
      'Positioning clarity',
      'Distinctive visual direction',
      'System thinking across touchpoints',
      'Use of AI as a creative accelerator',
    ],
    status: 'draft',
  },
];

export const entries: ChallengeEntry[] = [
  {
    id: 'entry-001',
    challengeId: 'world-cup-poster-2026',
    participantName: 'Maya Noor',
    instagramUsername: 'maya.ai.studio',
    manychatContactId: 'mc_demo_001',
    submissionType: 'post',
    submissionUrl: 'https://www.instagram.com/p/demo-poster-entry/',
    aiToolsUsed: ['Midjourney', 'Photoshop', 'ChatGPT'],
    caption: 'A cinematic poster route for a future football campaign built around desert light and street energy.',
    status: 'approved',
    score: 84,
    adminNotes: 'Strong composition. Good candidate for shortlist.',
    submittedAt: '2026-06-03T10:30:00+04:00',
  },
  {
    id: 'entry-002',
    challengeId: 'world-cup-poster-2026',
    participantName: 'Omar Khalid',
    instagramUsername: 'omar.generates',
    manychatContactId: 'mc_demo_002',
    submissionType: 'reel',
    submissionUrl: 'https://www.instagram.com/reel/demo-poster-reel/',
    aiToolsUsed: ['Runway', 'DALL-E', 'CapCut'],
    caption: 'Motion-first poster reveal with crowd energy and bold type.',
    status: 'shortlisted',
    score: 91,
    adminNotes: 'Motion format has the strongest social potential.',
    submittedAt: '2026-06-05T18:12:00+04:00',
  },
  {
    id: 'entry-003',
    challengeId: 'world-cup-poster-2026',
    participantName: 'Sara V.',
    instagramUsername: 'sarav.design',
    manychatContactId: 'mc_demo_003',
    submissionType: 'post',
    submissionUrl: 'https://www.instagram.com/p/demo-finalist-entry/',
    aiToolsUsed: ['Firefly', 'Illustrator', 'ChatGPT'],
    caption: 'A graphic poster system built from modular pitch lines and national color references.',
    status: 'finalist',
    score: 94,
    adminNotes: 'Most system-ready entry.',
    submittedAt: '2026-06-08T13:44:00+04:00',
  },
];

export const statusLabels: Record<ChallengeStatus, string> = {
  draft: 'Draft',
  active: 'Active',
  closed: 'Closed',
  archived: 'Archived',
};

export const entryStatusLabels: Record<EntryStatus, string> = {
  new: 'New',
  approved: 'Approved',
  rejected: 'Rejected',
  shortlisted: 'Shortlisted',
  finalist: 'Finalist',
  winner: 'Winner',
};

export const getChallengeBySlug = (slug: string) =>
  challenges.find((challenge) => challenge.slug === slug);

export const getEntriesForChallenge = (challengeId: string) =>
  entries.filter((entry) => entry.challengeId === challengeId);

export const getApprovedEntriesForChallenge = (challengeId: string) =>
  getEntriesForChallenge(challengeId).filter((entry) =>
    ['approved', 'shortlisted', 'finalist', 'winner'].includes(entry.status),
  );

export const getWinnerEntriesForChallenge = (challengeId: string) =>
  getEntriesForChallenge(challengeId).filter((entry) => entry.status === 'winner' || entry.status === 'finalist');
