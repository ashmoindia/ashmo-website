export type PodcastEpisode = {
  title: string;
  show: string;
  episode: string;
  description: string;
  youtubeId: string;
  date: string;
  pillar: string;
};

// Publish recordings only after reviewing the complete audio, video and asset permissions.
export const podcastEpisodes: PodcastEpisode[] = [];
