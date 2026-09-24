"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { logoutAction } from "@/app/login/actions";
import { Icon } from "@/app/components/ui/icons";
import type { Notification } from "@/lib/notifications";

type Props = {
  user: { name: string; role: "admin" | "staff" };
  notifications: Notification[];
  onMenuClick: () => void;
};

// Breadcrumb per halaman
const crumbs: Record<string, string[]> = {
  "/": ["Dashboard"],
  "/products": ["Katalog", "Produk"],
  "/users": ["Pengaturan", "Users"],
};

export default function Header({ user, notifications, onMenuClick }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) =>
      ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const trail = crumbs["/" + (pathname.split("/")[1] ?? "")] ?? [];
  const count = notifications.length;
  const iconBtn =
    "relative grid h-8 w-8 place-items-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900";

  return (
    <header className="sticky top-0 z-20 flex h-12 items-center border-b bg-white print:hidden">
      {/* Logo (selebar sidebar) */}
      <div className="flex h-full items-center gap-2 px-3 md:w-48">
        <button
          onClick={onMenuClick}
          aria-label="Buka menu"
          className={`${iconBtn} md:hidden`}
        >
          <Icon.Menu />
        </button>
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-blue-600 text-sm text-white">
            T
          </span>
          Toko Kecil
        </Link>
      </div>

      {/* Breadcrumb */}
      <nav className="hidden items-center gap-1.5 border-l pl-4 text-sm text-slate-500 sm:flex">
        {trail.map((c, i) => (
          <span key={c} className="flex items-center gap-1.5">
            {i > 0 && <Icon.ChevronRight className="h-3.5 w-3.5" />}
            <span
              className={
                i === trail.length - 1 ? "font-medium text-slate-900" : ""
              }
            >
              {c}
            </span>
          </span>
        ))}
      </nav>

      {/* Kanan */}
      <div className="ml-auto flex items-center gap-1 px-3">
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen(!open)}
            aria-label="Notifikasi"
            className={iconBtn}
          >
            <Icon.Bell />
            {count > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            )}
          </button>
          {open && (
            <div className="absolute right-0 mt-1 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg border bg-white shadow-lg">
              <div className="flex items-center justify-between border-b px-3 py-2 text-sm">
                <span className="font-semibold">Notifikasi</span>
                <span className="text-xs text-slate-500">{count} baru</span>
              </div>
              <ul className="max-h-80 overflow-y-auto text-sm">
                {notifications.map((n) => (
                  <li key={n.id}>
                    <Link
                      href={n.href}
                      onClick={() => setOpen(false)}
                      className="flex gap-2.5 border-b px-3 py-2 last:border-0 hover:bg-slate-50"
                    >
                      <span
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.title === "Stok habis" ? "bg-red-500" : "bg-amber-500"}`}
                      />
                      <span>
                        <span className="block font-medium">{n.title}</span>
                        <span className="text-xs text-slate-500">
                          {n.message}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
                {count === 0 && (
                  <li className="px-3 py-6 text-center text-slate-500">
                    Tidak ada notifikasi 🎉
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <span className="mx-1 h-6 border-l" />

        <div className="flex items-center gap-2 pr-1">
          <span className="grid h-7 w-7 place-items-center rounded-full border bg-slate-100 text-xs font-semibold">
            {user.name.charAt(0).toUpperCase()}
          </span>
          <span className="hidden text-sm leading-tight sm:block">
            <span className="block font-semibold">{user.name}</span>
            <span className="block text-xs text-slate-500">{user.role}</span>
          </span>
        </div>

        <form action={logoutAction}>
          <button
            type="submit"
            aria-label="Logout"
            title="Logout"
            className={`${iconBtn} hover:bg-red-50 hover:text-red-600`}
          >
            <Icon.Logout />
          </button>
        </form>
      </div>
    </header>
  );
}
