-- Realign the seeded challenge keyword from POSTER to WORLDCUP
-- to match the ManyChat comment-trigger config.

update public.challenges
  set instagram_keyword = 'WORLDCUP'
  where slug = 'ai-world-cup-poster'
    and instagram_keyword = 'POSTER';
