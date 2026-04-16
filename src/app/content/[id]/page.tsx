"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { JournalEntryForm } from "@/components/forms/journal-entry-form";
import { ReviewCard } from "@/components/cards/review-card";
import { EmptyState } from "@/components/state/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useContent, useReviews } from "@/lib/hooks/use-kjournal-queries";
import { useAppDispatch } from "@/store/hooks";
import { toggleModal } from "@/store/slices/ui-slice";

export default function ContentDetailPage() {
  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const contentQuery = useContent(params.id);
  const reviewsQuery = useReviews(params.id);

  if (!contentQuery.data) {
    return <EmptyState message="Content not found." />;
  }

  const content = contentQuery.data;

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-[260px_1fr]">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl border">
          <Image src={content.poster} alt={content.title} fill className="object-cover" />
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{content.title}</h1>
          <div className="flex gap-2">
            <Badge>{content.type}</Badge>
            <Badge variant="outline">{content.genre}</Badge>
            <Badge variant="outline">{content.year}</Badge>
          </div>
          <p className="text-sm text-zinc-700">{content.synopsis}</p>
          <div>
            <h2 className="font-semibold">Cast</h2>
            <ul className="mt-2 list-inside list-disc text-sm text-zinc-600">
              {content.cast.map((member) => (
                <li key={member}>{member}</li>
              ))}
            </ul>
          </div>
          <Button onClick={() => dispatch(toggleModal())}>Add to Journal</Button>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Reviews</h2>
        {reviewsQuery.data?.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {reviewsQuery.data.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <EmptyState message="No reviews for this title yet." />
        )}
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Add Journal Entry</h2>
        <JournalEntryForm />
      </section>
    </div>
  );
}
