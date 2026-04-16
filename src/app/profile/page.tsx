import { ReviewCard } from "@/components/cards/review-card";
import { UserCard } from "@/components/cards/user-card";
import { mockProfile, mockReviews } from "@/lib/mock-data";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Profile (Private)</h1>
      <UserCard user={mockProfile} />
      <div className="rounded-lg border p-4 text-sm text-zinc-700">
        <p>{mockProfile.bio}</p>
        <p className="mt-2 font-semibold">Watched: {mockProfile.watchedCount}</p>
        <p>Favorites: {mockProfile.favorites.length}</p>
      </div>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Recent Reviews</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {mockReviews.slice(0, 2).map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </section>
    </div>
  );
}
