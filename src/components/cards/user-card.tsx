import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { UserProfile } from "@/lib/types";

export function UserCard({ user }: { user: UserProfile }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 pt-4">
        <Avatar>
          <AvatarImage src={user.avatar} alt={user.username} />
          <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <p className="text-sm font-semibold">@{user.username}</p>
          <Link href={`/u/${user.username}`} className="text-xs text-violet-700 hover:underline">
            View profile
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
