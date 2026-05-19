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
    'Create an original AI-generated poster concept for a fictional World Cup campaign. Keep it non-branded — no real team marks, official tournament logos, or sponsor impersonation.',
    'Publish the poster as a public Instagram post or reel and include #AshmoAIChallenge in the caption so the entry can be discovered.',
    'Disclose the AI tools you used (Midjourney, Photoshop, ChatGPT, Firefly, etc.) — transparency counts toward the score.',
    'Enter by commenting POSTER on the Instagram announcement, then reply to our automatic DM with your post or reel link before the deadline.'
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
