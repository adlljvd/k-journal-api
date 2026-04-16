"use client";

import { ContentCard } from "@/components/cards/content-card";
import { EmptyState } from "@/components/state/empty-state";
import { LoadingGrid } from "@/components/state/loading-grid";
import { Input } from "@/components/ui/input";
import { useContents } from "@/lib/hooks/use-kjournal-queries";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetFilters, setFilter } from "@/store/slices/filters-slice";

export default function ExplorePage() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filters);
  const query = useContents(filters);

  const filtered =
    query.data?.filter((item) =>
      [
        !filters.query || item.title.toLowerCase().includes(filters.query.toLowerCase()),
        !filters.genre || item.genre === filters.genre,
        !filters.type || item.type === filters.type,
        !filters.year || String(item.year) === filters.year,
      ].every(Boolean),
    ) ?? [];

  return (
    <div className="space-y-6">
      <div className="grid gap-3 rounded-lg border p-4 md:grid-cols-4">
        <Input placeholder="Search title" value={filters.query} onChange={(e) => dispatch(setFilter({ key: "query", value: e.target.value }))} />
        <Input placeholder="Genre" value={filters.genre} onChange={(e) => dispatch(setFilter({ key: "genre", value: e.target.value }))} />
        <Input placeholder="Type (Drama/Movie)" value={filters.type} onChange={(e) => dispatch(setFilter({ key: "type", value: e.target.value }))} />
        <Input placeholder="Year" value={filters.year} onChange={(e) => dispatch(setFilter({ key: "year", value: e.target.value }))} />
      </div>
      <button onClick={() => dispatch(resetFilters())} className="text-sm text-violet-700 hover:underline">
        Clear filters
      </button>
      {query.isLoading ? (
        <LoadingGrid />
      ) : filtered.length ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {filtered.map((content) => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
      ) : (
        <EmptyState message="No matching content found." />
      )}
    </div>
  );
}
