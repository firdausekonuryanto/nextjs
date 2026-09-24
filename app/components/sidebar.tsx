"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type Props = {
  role: "admin" | "staff";
  open: boolean; // drawer HP terbuka?
  onClose: () => void;
};

const icon = (d: string) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="h-5 w-5 shrink-0"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

const menus: {
  href: string;
  label: string;
  icon: ReactNode;
  adminOnly?: boolean;
}[] = [
  {
    href: "/",
    label: "Dashboard",
    icon: icon("M3 12l9-9 9 9M5 10v10h5v-6h4v6h5V10"),
  },
  {
    href: "/products",
    label: "Produk",
    icon: icon(
      "M20 7l-8-4-8 4m16 0v10l-8 4m8-14l-8 4m0 10L4 17V7m8 14V11M4 7l8 4",
    ),
  },
  {
    href: "/users",
    label: "Users",
    adminOnly: true,
    icon: icon(
      "M17 20h5v-2a4 4 0 00-5-3.9M9 20H2v-2a4 4 0 014-4h2a4 4 0 014 4v2zm3-12a3 3 0 11-6 0 3 3 0 016 0zm7 1a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z",
    ),
  },
];

export default function Sidebar({ role, open, onClose }: Props) {
  const pathname = usePathname();
  const visibleMenus = menus.filter((m) => !m.adminOnly || role === "admin");
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 border-b px-5 font-semibold">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-white">
          T
        </span>
        Toko Kecil
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Menu
        </p>
        {visibleMenus.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            onClick={onClose}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              isActive(m.href)
                ? "bg-blue-50 text-blue-700"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            {m.icon}
            {m.label}
          </Link>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r bg-white md:block">
        {content}
      </aside>

      {/* HP: drawer */}
      {open && (
        <div className="fixed inset-0 z-30 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-white shadow-xl">
            <button
              onClick={onClose}
              aria-label="Tutup menu"
              className="absolute right-3 top-4 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
            >
              ✕
            </button>
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
