import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-violet-300 placeholder:text-zinc-500 focus-visible:ring-2",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
