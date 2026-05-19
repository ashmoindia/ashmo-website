import {
  challenges as seedChallenges,
  entries as seedEntries,
  type Challenge,
  type ChallengeEntry,
  type ChallengeStatus,
  type EntryStatus,
  type SubmissionType,
} from '../data/challenges';

interface SupabaseChallengeRow {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_instructions: string[] | null;
  instagram_keyword: string;
  hashtag: string;
  prize_details: string | null;
  start_date: string;
  end_date: string;
  cover_image_url: string | null;
  rules: string[] | null;
  judging_criteria: string[] | null;
  status: ChallengeStatus;
}

interface SupabaseEntryRow {
  id: string;
  challenge_id: string;
  participant_id: string;
  manychat_contact_id: string | null;
  submission_type: SubmissionType;
  submission_url: string;
  uploaded_media_url: string | null;
  ai_tools_used: string[] | null;
  caption: string | null;
  status: EntryStatus;
  score: number | null;
  admin_notes: string | null;
  created_at: string;
  participants?: {
    name: string | null;
    instagram_username: string;
    instagram_user_id: string | null;
    email: string | null;
    phone: string | null;
  } | null;
}

const getEnv = (key: string) => {
  const viteEnv = import.meta.env?.[key];
  if (typeof viteEnv === 'string' && viteEnv.length > 0) return viteEnv;
  return undefined;
};

const getSupabaseConfig = () => {
  const url = getEnv('SUPABASE_URL')?.replace(/\/$/, '');
  const serviceRoleKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');
  const anonKey = getEnv('SUPABASE_ANON_KEY');
  const key = serviceRoleKey || anonKey;

  if (!url || !key) return null;
  return { url, key };
};

const buildQuery = (path: string) => {
  const config = getSupabaseConfig();
  if (!config) return null;

  return {
    url: `${config.url}/rest/v1/${path}`,
    headers: {
      apikey: config.key,
      authorization: `Bearer ${config.key}`,
    },
  };
};

const fetchSupabase = async <T>(path: string): Promise<T | null> => {
  const query = buildQuery(path);
  if (!query) return null;

  try {
    const response = await fetch(query.url, { headers: query.headers });
    if (!response.ok) {
      console.warn(`Supabase fetch failed for ${path}: ${response.status}`);
      return null;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.warn(`Supabase fetch failed for ${path}:`, error);
    return null;
  }
};

const mapChallenge = (row: SupabaseChallengeRow): Challenge => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  shortDescription: row.short_description,
  fullInstructions: row.full_instructions || [],
  instagramKeyword: row.instagram_keyword,
  hashtag: row.hashtag,
  prize: row.prize_details || '',
  startDate: row.start_date,
  endDate: row.end_date,
  coverImage: row.cover_image_url || undefined,
  rules: row.rules || [],
  judgingCriteria: row.judging_criteria || [],
  status: row.status,
});

const mapEntry = (row: SupabaseEntryRow): ChallengeEntry => ({
  id: row.id,
  challengeId: row.challenge_id,
  participantName: row.participants?.name || row.participants?.instagram_username || 'Unknown creator',
  instagramUsername: row.participants?.instagram_username || 'unknown',
  instagramUserId: row.participants?.instagram_user_id || undefined,
  email: row.participants?.email || undefined,
  phone: row.participants?.phone || undefined,
  manychatContactId: row.manychat_contact_id || undefined,
  submissionType: row.submission_type,
  submissionUrl: row.submission_url,
  uploadedMediaUrl: row.uploaded_media_url || undefined,
  aiToolsUsed: row.ai_tools_used || [],
  caption: row.caption || undefined,
  status: row.status,
  score: row.score || undefined,
  adminNotes: row.admin_notes || undefined,
  submittedAt: row.created_at,
});

export const getChallenges = async (options: { publicOnly?: boolean } = {}) => {
  const statusFilter = options.publicOnly
    ? '&status=in.(active,closed,archived)'
    : '';
  const rows = await fetchSupabase<SupabaseChallengeRow[]>(
    `challenges?select=*&order=start_date.desc${statusFilter}`,
  );

  const fallbackChallenges = options.publicOnly
    ? seedChallenges.filter((challenge) => ['active', 'closed', 'archived'].includes(challenge.status))
    : seedChallenges;

  return rows?.length ? rows.map(mapChallenge) : [...fallbackChallenges];
};

export const getChallengeBySlug = async (slug: string, options: { publicOnly?: boolean } = {}) => {
  const challenges = await getChallenges(options);
  return challenges.find((challenge) => challenge.slug === slug);
};

export const getEntries = async (options: { challengeId?: string; publicOnly?: boolean } = {}) => {
  const filters = [
    'select=*,participants(name,instagram_username,instagram_user_id,email,phone)',
    'order=created_at.desc',
  ];

  if (options.challengeId) filters.push(`challenge_id=eq.${encodeURIComponent(options.challengeId)}`);
  if (options.publicOnly) filters.push('status=in.(approved,shortlisted,finalist,winner)');

  const rows = await fetchSupabase<SupabaseEntryRow[]>(`entries?${filters.join('&')}`);
  if (rows?.length) return rows.map(mapEntry);

  const entries = options.challengeId
    ? seedEntries.filter((entry) => entry.challengeId === options.challengeId)
    : seedEntries;

  return options.publicOnly
    ? entries.filter((entry) => ['approved', 'shortlisted', 'finalist', 'winner'].includes(entry.status))
    : [...entries];
};

export const getEntriesForChallenge = async (challengeId: string, options: { publicOnly?: boolean } = {}) =>
  getEntries({ challengeId, publicOnly: options.publicOnly });

export const getWinnerEntriesForChallenge = async (challengeId: string) => {
  const entries = await getEntries({ challengeId });
  return entries.filter((entry) => entry.status === 'winner' || entry.status === 'finalist');
};
