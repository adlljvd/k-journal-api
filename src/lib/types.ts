export type ContentType = "Drama" | "Movie";
export type JournalStatus = "Watching" | "Completed" | "Dropped" | "Plan to Watch";

export interface Content {
  id: string;
  title: string;
  type: ContentType;
  year: number;
  genre: string;
  poster: string;
  synopsis: string;
  cast: string[];
  trending?: boolean;
}

export interface Review {
  id: string;
  contentId: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  contentId: string;
  username: string;
  status: JournalStatus;
  progress: string;
  notes?: string;
}

export interface UserProfile {
  username: string;
  bio: string;
  avatar: string;
  watchedCount: number;
  favorites: string[];
}
