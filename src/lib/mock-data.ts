import { Content, JournalEntry, Review, UserProfile } from "@/lib/types";

export const mockContents: Content[] = [
  {
    id: "1",
    title: "Queen of Tears",
    type: "Drama",
    year: 2024,
    genre: "Romance",
    poster: "https://images.unsplash.com/photo-1489599146320-1754f94962df?auto=format&fit=crop&w=600&q=80",
    synopsis: "A married chaebol couple rediscover love as their relationship reaches a breaking point.",
    cast: ["Kim Soo-hyun", "Kim Ji-won"],
    trending: true,
  },
  {
    id: "2",
    title: "My Demon",
    type: "Drama",
    year: 2023,
    genre: "Fantasy",
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&q=80",
    synopsis: "A devilish entity loses his powers after entering an unusual contract marriage.",
    cast: ["Song Kang", "Kim Yoo-jung"],
    trending: true,
  },
  {
    id: "3",
    title: "Parasite",
    type: "Movie",
    year: 2019,
    genre: "Thriller",
    poster: "https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=600&q=80",
    synopsis: "A poor family infiltrates a wealthy household, spiraling into chaos.",
    cast: ["Song Kang-ho", "Choi Woo-shik"],
    trending: true,
  },
  {
    id: "4",
    title: "Train to Busan",
    type: "Movie",
    year: 2016,
    genre: "Action",
    poster: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=600&q=80",
    synopsis: "Passengers fight for survival on a train overrun by zombies.",
    cast: ["Gong Yoo", "Ma Dong-seok"],
  },
];

export const mockReviews: Review[] = [
  {
    id: "r1",
    contentId: "1",
    username: "sojuandscenes",
    rating: 5,
    comment: "Heartbreaking and beautifully acted.",
    createdAt: "2026-04-01",
  },
  {
    id: "r2",
    contentId: "3",
    username: "cine_jiwon",
    rating: 5,
    comment: "Masterful social satire with sharp pacing.",
    createdAt: "2026-04-07",
  },
  {
    id: "r3",
    contentId: "2",
    username: "kfan90",
    rating: 4,
    comment: "Great chemistry and style, fun weekly watch.",
    createdAt: "2026-04-10",
  },
];

export const mockJournalEntries: JournalEntry[] = [
  { id: "j1", contentId: "1", username: "me", status: "Watching", progress: "8/16" },
  { id: "j2", contentId: "3", username: "me", status: "Completed", progress: "Done" },
  { id: "j3", contentId: "2", username: "me", status: "Plan to Watch", progress: "Queued" },
];

export const mockProfile: UserProfile = {
  username: "kdrama_diary",
  bio: "Reviewing K-Dramas and Korean films one episode at a time.",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  watchedCount: 89,
  favorites: ["1", "3"],
};
