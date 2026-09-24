import type { Metadata } from "next";
import Navbar from "@/app/components/navbar";
import "./globals.css";

export const metadata: Metadata = { title: "Belajar CRUD Next.js" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
