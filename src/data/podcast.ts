export type PodcastEpisode = {
  title: string;
  show: string;
  episode: string;
  description: string;
  youtubeId: string;
  date: string;
  pillar: string;
};

export const podcastEpisodes: PodcastEpisode[] = [
  {
    title: 'CAFE PROFIT: This Is What Successful Coffee Shop Owners Do Differently',
    show: 'The eCom Show by Shan',
    episode: '#86',
    description:
      'What separates thriving cafe owners from those who struggle? In this episode, Ashmo shares the strategies, brand thinking, and operational discipline behind building a 70+ outlet cafe chain — and what most coffee shop owners get wrong.',
    youtubeId: 'E0W1FqtuKw0',
    date: '2025',
    pillar: 'brand-growth',
  },
];

export const featuredPodcastEpisode: PodcastEpisode = (() => {
  const featuredEpisode = podcastEpisodes.find(
    (episode) => episode.youtubeId === 'E0W1FqtuKw0'
  );

  if (!featuredEpisode) {
    throw new Error('Featured podcast episode E0W1FqtuKw0 is missing.');
  }

  return featuredEpisode;
})();
