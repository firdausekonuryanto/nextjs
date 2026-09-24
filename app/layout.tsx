import type { Metadata } from "next";
import AppShell from "@/app/components/app-shell";
import { getCurrentUser } from "@/lib/dal";
import { getNotifications } from "@/lib/notifications";
import { countProducts } from "@/lib/products";
import "./globals.css";

export const metadata: Metadata = { title: "Toko Kecil" };

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const user = await getCurrentUser(); // null kalau belum login

  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {user ? (
          <AppShell
            user={{ name: user.name, role: user.role }}
            notifications={await getNotifications()}
            counts={{ products: await countProducts() }}
          >
            {children}
          </AppShell>
        ) : (
          <main className="px-4 py-8">{children}</main>
        )}
      </body>
    </html>
  );
}
