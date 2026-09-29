export type NovelSummary = {
  id: number;
  slug: string;
  title: string;
  alias: string;
  author: string;
  status: string;
  description: string;
  isHidden: boolean;
  chaptersCount: number;
  ratingValue: number;
  createdAt: string;
  updatedAt: string;
  views: number;
  bayesianScore: number;
};