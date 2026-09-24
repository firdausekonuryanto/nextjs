import "server-only";
import type { RowDataPacket } from "mysql2";
import { db } from "./db";

export type Notification = {
  id: string;
  title: string;
  message: string;
  href: string;
};

export const LOW_STOCK = 10; // batas stok menipis

export async function getNotifications(): Promise<Notification[]> {
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT id, name, stock FROM products WHERE stock <= ? ORDER BY stock ASC LIMIT 10",
    [LOW_STOCK],
  );
  return rows.map((p) => ({
    id: `stock-${p.id}`,
    title: p.stock === 0 ? "Stok habis" : "Stok menipis",
    message: `${p.name} — sisa ${p.stock}`,
    href: `/products?edit=${p.id}`,
  }));
}
