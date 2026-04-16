import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Content } from "@/lib/types";

export function ContentCard({ content }: { content: Content }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="overflow-hidden">
        <div className="relative aspect-[3/4] w-full">
          <Image src={content.poster} alt={content.title} fill className="object-cover" sizes="(max-width:768px) 50vw, 25vw" />
        </div>
        <CardHeader>
          <CardTitle className="line-clamp-1 text-base">{content.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-2">
          <Badge>{content.type}</Badge>
          <span className="text-xs text-zinc-500">{content.year}</span>
          <Link href={`/content/${content.id}`} className="text-xs font-semibold text-violet-700 hover:underline">
            Details
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}
