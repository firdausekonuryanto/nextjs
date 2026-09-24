"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logoutAction } from "@/app/login/actions";

// Data user dikirim dari layout.tsx (null = belum login)
type NavUser = { name: string; role: "admin" | "staff" } | null;

const menus = [
  { href: "/", label: "Dashboard" },
  { href: "/products", label: "Produk" },
  { href: "/users", label: "Users", adminOnly: true }, // khusus admin
];

export default function Navbar({ user }: { user: NavUser }) {
  const pathname = usePathname(); // URL sekarang, untuk menandai menu aktif
  const [open, setOpen] = useState(false); // buka/tutup menu di HP

  // Staff tidak melihat menu Users
  const visibleMenus = menus.filter(
    (m) => !m.adminOnly || user?.role === "admin",
  );

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  const linkClass = (href: string) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive(href)
        ? "bg-blue-50 text-blue-700"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  const logoutButton = (
    <form action={logoutAction}>
      <button
        type="submit"
        className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        Logout
      </button>
    </form>
  );

  return (
    <header className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-white">
            T
          </span>
          Toko Kecil
        </Link>

        {/* Belum login (halaman /login): tidak tampilkan menu */}
        {user && (
          <>
            {/* Desktop */}
            <div className="hidden flex-1 items-center justify-between sm:flex">
              <div className="flex gap-1">
                {visibleMenus.map((m) => (
                  <Link
                    key={m.href}
                    href={m.href}
                    className={linkClass(m.href)}
                  >
                    {m.label}
                  </Link>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right text-sm leading-tight">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-slate-500">{user.role}</div>
                </div>
                {logoutButton}
              </div>
            </div>

            {/* Tombol hamburger (HP) */}
            <button
              onClick={() => setOpen(!open)}
              aria-label="Buka menu"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 sm:hidden"
            >
              {open ? "✕" : "☰"}
            </button>
          </>
        )}
      </nav>

      {/* Menu HP */}
      {user && open && (
        <div className="flex flex-col gap-1 border-t px-4 py-3 sm:hidden">
          <div className="px-3 pb-2 text-sm">
            <span className="font-medium">{user.name}</span>{" "}
            <span className="text-slate-500">({user.role})</span>
          </div>
          {visibleMenus.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className={linkClass(m.href)}
              onClick={() => setOpen(false)}
            >
              {m.label}
            </Link>
          ))}
          {logoutButton}
        </div>
      )}
    </header>
  );
}
