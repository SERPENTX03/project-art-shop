export type Post = {
  id: string;
  content: string | null;
  images: string[];
  Reaction: { emoji: string }[];
  PollQuestion?: {
    id: string;
    question: string;
    options: {
      id: string;
      text: string;
      votes: { id: string; userId: string }[];
    }[];
  }[];
};
