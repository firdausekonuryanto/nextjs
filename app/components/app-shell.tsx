"use client";

// Kerangka setelah login: Header (atas, penuh) + Sidebar (kiri) + konten.
import { useState, type ReactNode } from "react";
import Sidebar from "./sidebar";
import Header from "./header";
import type { Notification } from "@/lib/notifications";

type Props = {
  user: { name: string; role: "admin" | "staff" };
  notifications: Notification[];
  counts: { products: number };
  children: ReactNode;
};

export default function AppShell({
  user,
  notifications,
  counts,
  children,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Header
        user={user}
        notifications={notifications}
        onMenuClick={() => setOpen(true)}
      />
      <div className="md:flex">
        <Sidebar
          role={user.role}
          counts={counts}
          open={open}
          onClose={() => setOpen(false)}
        />
        <main className="min-w-0 flex-1 p-4 md:p-5 print:p-0">{children}</main>
      </div>
    </>
  );
}
