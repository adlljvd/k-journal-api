import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-violet-300 placeholder:text-zinc-500 focus-visible:ring-2",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
