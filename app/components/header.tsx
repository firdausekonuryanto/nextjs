"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { logoutAction } from "@/app/login/actions";
import type { Notification } from "@/lib/notifications";

type Props = {
  user: { name: string; role: "admin" | "staff" };
  notifications: Notification[];
  onMenuClick: () => void; // buka sidebar di HP
};

const iconBtn =
  "relative grid h-10 w-10 place-items-center rounded-lg text-slate-600 transition hover:bg-slate-100";

export default function Header({ user, notifications, onMenuClick }: Props) {
  const [open, setOpen] = useState(false); // dropdown notifikasi
  const ref = useRef<HTMLDivElement>(null);

  // Tutup dropdown saat klik di luar atau tekan Esc
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const count = notifications.length;

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b bg-white/90 px-4 backdrop-blur md:px-8">
      {/* Kiri: hamburger (HP) */}
      <div className="flex items-center gap-2">
        <button
          onClick={onMenuClick}
          aria-label="Buka menu"
          className={`${iconBtn} md:hidden`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="h-5 w-5"
          >
            <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="font-semibold md:hidden">Toko Kecil</span>
      </div>

      {/* Kanan: notifikasi, user, logout */}
      <div className="flex items-center gap-1">
        {/* Notifikasi */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen(!open)}
            aria-label="Notifikasi"
            className={iconBtn}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {count > 0 && (
              <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border bg-white shadow-lg">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <span className="font-semibold">Notifikasi</span>
                <span className="text-xs text-slate-500">{count} baru</span>
              </div>
              <ul className="max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <li key={n.id}>
                    <Link
                      href={n.href}
                      onClick={() => setOpen(false)}
                      className="flex gap-3 border-b px-4 py-3 last:border-0 hover:bg-slate-50"
                    >
                      <span
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.title === "Stok habis" ? "bg-red-500" : "bg-amber-500"}`}
                      />
                      <span className="text-sm">
                        <span className="block font-medium">{n.title}</span>
                        <span className="text-slate-500">{n.message}</span>
                      </span>
                    </Link>
                  </li>
                ))}
                {count === 0 && (
                  <li className="px-4 py-8 text-center text-sm text-slate-500">
                    Tidak ada notifikasi 🎉
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* User */}
        <div className="ml-2 hidden items-center gap-2 border-l pl-3 sm:flex">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="text-sm leading-tight">
            <div className="font-medium">{user.name}</div>
            <div className="text-xs text-slate-500">{user.role}</div>
          </div>
        </div>

        {/* Logout */}
        <form action={logoutAction}>
          <button
            type="submit"
            aria-label="Logout"
            title="Logout"
            className={`${iconBtn} hover:bg-red-50 hover:text-red-600`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </form>
      </div>
    </header>
  );
}
