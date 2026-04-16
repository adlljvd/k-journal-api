import { notFound } from "next/navigation";
import { ContentCard } from "@/components/cards/content-card";
import { UserCard } from "@/components/cards/user-card";
import { mockContents, mockJournalEntries, mockProfile } from "@/lib/mock-data";

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  if (username !== mockProfile.username) {
    notFound();
  }

  const favoriteContents = mockContents.filter((item) => mockProfile.favorites.includes(item.id));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Public Profile</h1>
      <UserCard user={mockProfile} />
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Favorites</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {favoriteContents.map((content) => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-lg font-semibold">Journal Entries</h2>
        <ul className="mt-2 space-y-2 text-sm text-zinc-700">
          {mockJournalEntries.map((entry) => (
            <li key={entry.id}>
              {entry.status}: #{entry.contentId} ({entry.progress})
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
