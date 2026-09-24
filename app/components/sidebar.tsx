"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import { Icon } from "@/app/components/ui/icons";

type Menu = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  badge?: "products";
  adminOnly?: boolean;
};

// Menu dikelompokkan per section
const sections: { title: string; menus: Menu[] }[] = [
  {
    title: "Menu",
    menus: [
      { href: "/", label: "Dashboard", icon: Icon.Home },
      { href: "/products", label: "Produk", icon: Icon.Box, badge: "products" },
    ],
  },
  {
    title: "Pengaturan",
    menus: [
      { href: "/users", label: "Users", icon: Icon.Users, adminOnly: true },
    ],
  },
];

type Props = {
  role: "admin" | "staff";
  counts: { products: number };
  open: boolean;
  onClose: () => void;
};

export default function Sidebar({ role, counts, open, onClose }: Props) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const content = (
    <nav className="space-y-4 p-3">
      {sections.map((s) => {
        const menus = s.menus.filter((m) => !m.adminOnly || role === "admin");
        if (menus.length === 0) return null;
        return (
          <div key={s.title}>
            <p className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {s.title}
            </p>
            {menus.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                onClick={onClose}
                className={`flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition ${
                  isActive(m.href)
                    ? "bg-blue-50 font-medium text-blue-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <m.icon className="h-4 w-4" />
                <span className="flex-1">{m.label}</span>
                {m.badge && (
                  <span className="rounded bg-blue-100 px-1.5 text-xs font-medium text-blue-700">
                    {counts[m.badge]}
                  </span>
                )}
              </Link>
            ))}
          </div>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop: di bawah header (top-12) */}
      <aside className="sticky top-12 hidden h-[calc(100vh-3rem)] w-48 shrink-0 overflow-y-auto border-r bg-white md:block print:hidden">
        {content}
      </aside>

      {/* HP: drawer */}
      {open && (
        <div className="fixed inset-0 z-30 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <aside className="absolute inset-y-0 left-0 w-60 bg-white shadow-xl">
            <div className="flex h-12 items-center justify-between border-b px-3 font-bold">
              Toko Kecil
              <button
                onClick={onClose}
                aria-label="Tutup menu"
                className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
