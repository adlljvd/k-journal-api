"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createJournalEntry,
  deleteJournalEntry,
  fetchContentById,
  fetchContents,
  fetchJournals,
  fetchReviews,
  type ExploreFilters,
  updateJournalEntry,
} from "@/lib/api/services";
import { JournalEntry } from "@/lib/types";

export const queryKeys = {
  contents: (filters?: ExploreFilters) => ["contents", filters] as const,
  content: (id: string) => ["content", id] as const,
  journals: ["journals"] as const,
  reviews: (contentId?: string) => ["reviews", contentId] as const,
};

export function useContents(filters?: ExploreFilters) {
  return useQuery({
    queryKey: queryKeys.contents(filters),
    queryFn: () => fetchContents(filters),
  });
}

export function useContent(id: string) {
  return useQuery({
    queryKey: queryKeys.content(id),
    queryFn: () => fetchContentById(id),
  });
}

export function useJournals() {
  return useQuery({
    queryKey: queryKeys.journals,
    queryFn: fetchJournals,
  });
}

export function useReviews(contentId?: string) {
  return useQuery({
    queryKey: queryKeys.reviews(contentId),
    queryFn: () => fetchReviews(contentId),
  });
}

export function useJournalMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.journals });

  return {
    create: useMutation({ mutationFn: createJournalEntry, onSuccess: invalidate }),
    update: useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: Partial<JournalEntry> }) =>
        updateJournalEntry(id, payload),
      onSuccess: invalidate,
    }),
    remove: useMutation({ mutationFn: deleteJournalEntry, onSuccess: invalidate }),
  };
}
