export type Review = {
  id: string;
  package: string;
  rating: number;
  review: string;
  response?: string;
  generative: boolean;
};
