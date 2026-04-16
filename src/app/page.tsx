"use client";

import { motion } from "framer-motion";
import { ContentCard } from "@/components/cards/content-card";
import { ReviewCard } from "@/components/cards/review-card";
import { EmptyState } from "@/components/state/empty-state";
import { LoadingGrid } from "@/components/state/loading-grid";
import { useContents, useReviews } from "@/lib/hooks/use-kjournal-queries";

export default function HomePage() {
  const contentsQuery = useContents();
  const reviewsQuery = useReviews();
  const trending = contentsQuery.data?.filter((item) => item.trending) ?? [];

  return (
    <div className="space-y-10">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 p-8 text-white"
      >
        <h1 className="text-3xl font-bold">Track every K-Drama and K-Movie moment</h1>
        <p className="mt-2 max-w-xl text-sm text-violet-100">
          Build your watch history, leave reviews, and discover what the community is watching now.
        </p>
      </motion.section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Trending Content</h2>
        {contentsQuery.isLoading ? (
          <LoadingGrid />
        ) : trending.length ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {trending.map((content) => (
              <ContentCard key={content.id} content={content} />
            ))}
          </div>
        ) : (
          <EmptyState message="No trending titles yet." />
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Reviews</h2>
        {reviewsQuery.isLoading ? (
          <LoadingGrid />
        ) : reviewsQuery.data?.length ? (
          <div className="grid gap-3 md:grid-cols-3">
            {reviewsQuery.data.slice(0, 3).map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <EmptyState message="No reviews posted yet." />
        )}
      </section>
    </div>
  );
}
