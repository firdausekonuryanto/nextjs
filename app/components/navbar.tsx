"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const menus = [
  { href: "/", label: "Dashboard" },
  { href: "/products", label: "Produk" },
  { href: "/users", label: "Users" },
];

export default function Navbar() {
  const pathname = usePathname(); // URL sekarang, untuk menandai menu aktif
  const [open, setOpen] = useState(false); // buka/tutup menu di HP

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  const linkClass = (href: string) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive(href)
        ? "bg-blue-50 text-blue-700"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <header className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-white">
            T
          </span>
          Toko Kecil
        </Link>

        <div className="hidden gap-1 sm:flex">
          {menus.map((m) => (
            <Link key={m.href} href={m.href} className={linkClass(m.href)}>
              {m.label}
            </Link>
          ))}
        </div>

        <button
          onClick={() => setOpen(!open)}
          aria-label="Buka menu"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 sm:hidden"
        >
          {open ? "✕" : "☰"}
        </button>
      </nav>

      {open && (
        <div className="flex flex-col gap-1 border-t px-4 py-3 sm:hidden">
          {menus.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className={linkClass(m.href)}
              onClick={() => setOpen(false)}
            >
              {m.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
