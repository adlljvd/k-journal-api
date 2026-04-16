"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/store/hooks";
import { toggleSidebar } from "@/store/slices/ui-slice";

const links = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/journal", label: "Journal" },
  { href: "/profile", label: "Profile" },
];

export function Navbar() {
  const dispatch = useAppDispatch();

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold text-violet-700">
          K-Journal
        </Link>
        <div className="hidden items-center gap-5 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-zinc-700 transition hover:text-violet-700">
              {link.label}
            </Link>
          ))}
          <Button asChild size="sm">
            <Link href="/login">Login</Link>
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="md:hidden"
          onClick={() => dispatch(toggleSidebar())}
          aria-label="Toggle mobile menu"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>
    </nav>
  );
}
