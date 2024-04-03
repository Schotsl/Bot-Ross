export enum ReviewState {
  USER_REPLIED = "USER_REPLIED",
  AI_PENDING = "AI_PENDING",
  AI_REPLIED = "AI_REPLIED",
}

export type Review = {
  id: string;
  state: ReviewState;
  package: string;
  rating: number;
  review: string;
  discord?: string;
  response?: string;
};
