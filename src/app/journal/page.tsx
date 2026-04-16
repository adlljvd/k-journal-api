"use client";

import { JournalCard } from "@/components/cards/journal-card";
import { EmptyState } from "@/components/state/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useJournals } from "@/lib/hooks/use-kjournal-queries";

const statuses = ["Watching", "Completed", "Dropped", "Plan to Watch"] as const;

export default function JournalPage() {
  const journalsQuery = useJournals();

  return (
    <Tabs defaultValue="Watching" className="space-y-4">
      <TabsList>
        {statuses.map((status) => (
          <TabsTrigger key={status} value={status}>
            {status}
          </TabsTrigger>
        ))}
      </TabsList>
      {statuses.map((status) => {
        const entries = journalsQuery.data?.filter((entry) => entry.status === status) ?? [];
        return (
          <TabsContent key={status} value={status}>
            {entries.length ? (
              <div className="grid gap-3 md:grid-cols-3">
                {entries.map((entry) => (
                  <JournalCard key={entry.id} entry={entry} />
                ))}
              </div>
            ) : (
              <EmptyState message={`No ${status.toLowerCase()} entries yet.`} />
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
