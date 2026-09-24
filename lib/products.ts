import { connection } from "next/server";
import type { RowDataPacket } from "mysql2";
import { db } from "./db";
import type { Category } from "./constants";
export { CATEGORIES, LOW_STOCK, type Category } from "./constants";

// Model Product — semua query ke tabel products.

export type Product = {
  id: number;
  name: string;
  category: Category;
  price: number;
  stock: number;
  created_at: Date;
  updated_at: Date;
};

export type ProductInput = Pick<
  Product,
  "name" | "category" | "price" | "stock"
>;

export async function getProducts(): Promise<Product[]> {
  await connection(); // query jalan saat request, bukan saat build
  const [rows] = await db.query<(Product & RowDataPacket)[]>(
    "SELECT * FROM products ORDER BY id DESC",
  );
  return rows;
}

export async function getProduct(id: number): Promise<Product | undefined> {
  await connection();
  const [rows] = await db.query<(Product & RowDataPacket)[]>(
    "SELECT * FROM products WHERE id = ?",
    [id],
  );
  return rows[0];
}

export async function countProducts(): Promise<number> {
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT COUNT(*) AS total FROM products",
  );
  return Number(rows[0].total);
}

export async function insertProduct(data: ProductInput) {
  await db.execute(
    "INSERT INTO products (name, category, price, stock) VALUES (?, ?, ?, ?)",
    [data.name, data.category, data.price, data.stock],
  );
}

export async function updateProduct(id: number, data: ProductInput) {
  await db.execute(
    "UPDATE products SET name = ?, category = ?, price = ?, stock = ? WHERE id = ?",
    [data.name, data.category, data.price, data.stock, id],
  );
}

export async function deleteProduct(id: number) {
  await db.execute("DELETE FROM products WHERE id = ?", [id]);
}
