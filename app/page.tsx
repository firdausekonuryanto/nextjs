import Link from "next/link";
import { connection } from "next/server";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";

async function count(table: "products" | "users") {
  await connection();
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT COUNT(*) AS total FROM ${table}`,
  );
  return Number(rows[0].total);
}

export default async function Dashboard() {
  const [products, users] = await Promise.all([
    count("products"),
    count("users"),
  ]);
  const cards = [
    { label: "Total Produk", value: products, href: "/products" },
    { label: "Total Users", value: users, href: "/users" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-xl border bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow"
          >
            <p className="text-sm text-slate-500">{c.label}</p>
            <p className="mt-1 text-3xl font-bold">{c.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
