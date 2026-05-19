insert into public.challenges (
  title,
  slug,
  short_description,
  full_instructions,
  instagram_keyword,
  hashtag,
  prize_details,
  start_date,
  end_date,
  rules,
  judging_criteria,
  status
) values (
  'AI World Cup Poster Challenge',
  'ai-world-cup-poster',
  'Create a poster concept for a fictional World Cup campaign using AI image, layout, and copy tools.',
  array[
    'Create one public Instagram post or reel that shows your final poster concept.',
    'Include the challenge hashtag in your caption so the entry can be discovered publicly.',
    'Mention the AI tools used and keep the concept original, non-branded, and safe for public sharing.',
    'Send the public Instagram post or reel link to @iam_ashmo in DM before the deadline.'
  ],
  'POSTER',
  '#AshmoAIChallenge',
  'Featured finalist showcase plus a private AI creative workflow review with Ashmo.',
  '2026-06-01',
  '2026-06-21',
  array[
    'One entry per creator per challenge.',
    'Submissions must be public Instagram posts or reels until winners are announced.',
    'Entries must disclose the AI tools used.',
    'No copyrighted team marks, official tournament marks, or impersonation of real sponsors.'
  ],
  array[
    'Creative idea and campaign clarity',
    'Visual execution and composition',
    'Quality of AI usage and iteration',
    'Caption, presentation, and public engagement'
  ],
  'active'
)
on conflict (slug) do update set
  title = excluded.title,
  short_description = excluded.short_description,
  full_instructions = excluded.full_instructions,
  instagram_keyword = excluded.instagram_keyword,
  hashtag = excluded.hashtag,
  prize_details = excluded.prize_details,
  start_date = excluded.start_date,
  end_date = excluded.end_date,
  rules = excluded.rules,
  judging_criteria = excluded.judging_criteria,
  status = excluded.status;
