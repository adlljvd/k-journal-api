"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useJournalMutations } from "@/lib/hooks/use-kjournal-queries";
import { journalEntrySchema, JournalEntryValues } from "@/lib/validations/journal";

export function JournalEntryForm() {
  const { create } = useJournalMutations();
  const form = useForm<JournalEntryValues>({
    resolver: zodResolver(journalEntrySchema),
    defaultValues: { status: "Watching", progress: "", notes: "" },
  });

  return (
    <form onSubmit={form.handleSubmit((values) => create.mutate(values))} className="space-y-4 rounded-lg border p-4">
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          className="flex h-10 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-violet-300 focus-visible:ring-2"
          {...form.register("status")}
        >
          <option value="Watching">Watching</option>
          <option value="Completed">Completed</option>
          <option value="Dropped">Dropped</option>
          <option value="Plan to Watch">Plan to Watch</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="progress">Progress</Label>
        <Input id="progress" placeholder="e.g. 4/16" {...form.register("progress")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" placeholder="Short note" {...form.register("notes")} />
      </div>
      <Button type="submit" className="w-full" disabled={create.isPending}>
        Save to Journal
      </Button>
    </form>
  );
}
