"use client";

import { useState, type ReactNode } from "react";
import Sidebar from "./sidebar";
import Header from "./header";
import type { Notification } from "@/lib/notifications";

type Props = {
  user: { name: string; role: "admin" | "staff" };
  notifications: Notification[];
  children: ReactNode;
};

export default function AppShell({ user, notifications, children }: Props) {
  const [open, setOpen] = useState(false); // sidebar HP terbuka?

  return (
    <div className="md:flex">
      <Sidebar role={user.role} open={open} onClose={() => setOpen(false)} />
      <div className="min-w-0 flex-1">
        <Header
          user={user}
          notifications={notifications}
          onMenuClick={() => setOpen(true)}
        />
        <main className="px-4 py-8 md:px-8">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
