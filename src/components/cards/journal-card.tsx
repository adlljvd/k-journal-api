import { JournalEntry } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function JournalCard({ entry }: { entry: JournalEntry }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Entry #{entry.id}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Badge>{entry.status}</Badge>
        <p className="text-sm text-zinc-700">Progress: {entry.progress}</p>
      </CardContent>
    </Card>
  );
}
