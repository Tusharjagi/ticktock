"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { TEXT } from "@/constants/TEXT_CONSTANTS";
import { useAuth } from "@/context/auth/useAuth";

/** Top navigation bar: logo + Timesheets link, and the user menu on the right. */
export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link href="/timesheets" className="text-lg font-bold text-ink">
            {TEXT.app.name}
          </Link>
          <nav>
            <Link
              href="/timesheets"
              className="text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              {TEXT.nav.timesheets}
            </Link>
          </nav>
        </div>

        <div className="relative" ref={ref}>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={open}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-body transition-colors hover:bg-gray-50"
          >
            <span className="font-medium">
              {user?.name ?? TEXT.nav.accountFallback}
            </span>
            <ChevronDown className="h-4 w-4 text-muted" />
          </button>
          {open && (
            <div
              role="menu"
              className="absolute right-0 z-20 mt-1 w-40 overflow-hidden rounded-lg border border-line bg-white py-1 shadow-lg"
            >
              <button
                role="menuitem"
                type="button"
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-left text-sm text-body transition-colors hover:bg-gray-50"
              >
                {TEXT.nav.signOut}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
