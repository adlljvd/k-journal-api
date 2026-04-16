import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Review } from "@/lib/types";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">@{review.username}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-2 text-xs text-zinc-500">Rating: {review.rating}/5</p>
        <p className="text-sm text-zinc-700">{review.comment}</p>
      </CardContent>
    </Card>
  );
}
