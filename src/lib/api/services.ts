import { apiClient } from "@/lib/api/client";
import { mockContents, mockJournalEntries, mockReviews } from "@/lib/mock-data";
import { Content, JournalEntry, Review } from "@/lib/types";

export interface ExploreFilters {
  query?: string;
  genre?: string;
  type?: string;
  year?: string;
}

export async function fetchContents(filters?: ExploreFilters): Promise<Content[]> {
  try {
    const { data } = await apiClient.get<Content[]>("/contents", { params: filters });
    return data;
  } catch {
    return mockContents;
  }
}

export async function fetchContentById(id: string): Promise<Content | null> {
  try {
    const { data } = await apiClient.get<Content>(`/contents/${id}`);
    return data;
  } catch {
    return mockContents.find((item) => item.id === id) ?? null;
  }
}

export async function fetchReviews(contentId?: string): Promise<Review[]> {
  try {
    const { data } = await apiClient.get<Review[]>("/reviews", { params: { contentId } });
    return data;
  } catch {
    return contentId
      ? mockReviews.filter((review) => review.contentId === contentId)
      : mockReviews;
  }
}

export async function fetchJournals(): Promise<JournalEntry[]> {
  try {
    const { data } = await apiClient.get<JournalEntry[]>("/journals");
    return data;
  } catch {
    return mockJournalEntries;
  }
}

export async function createJournalEntry(payload: Partial<JournalEntry>) {
  const { data } = await apiClient.post<JournalEntry>("/journals", payload);
  return data;
}

export async function updateJournalEntry(id: string, payload: Partial<JournalEntry>) {
  const { data } = await apiClient.patch<JournalEntry>(`/journals/${id}`, payload);
  return data;
}

export async function deleteJournalEntry(id: string) {
  await apiClient.delete(`/journals/${id}`);
  return id;
}
