import { z } from "zod";

export const journalEntrySchema = z.object({
  status: z.enum(["Watching", "Completed", "Dropped", "Plan to Watch"]),
  progress: z.string().min(1),
  notes: z.string().optional(),
});

export type JournalEntryValues = z.infer<typeof journalEntrySchema>;
