import { connection } from "next/server";
import type { RowDataPacket } from "mysql2";
import { db } from "./db";

export type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  created_at: Date;
  updated_at: Date;
};

export type ProductInput = Pick<Product, "name" | "price" | "stock">;

// READ semua + cari — Product::where('name','like',"%$q%")->get()
export async function getProducts(q = ""): Promise<Product[]> {
  await connection(); // query jalan saat request, bukan saat build
  const [rows] = await db.query<(Product & RowDataPacket)[]>(
    "SELECT * FROM products WHERE name LIKE ? ORDER BY id DESC",
    [`%${q}%`],
  );
  return rows;
}

// READ satu — Product::find($id)
export async function getProduct(id: number): Promise<Product | undefined> {
  await connection();
  const [rows] = await db.query<(Product & RowDataPacket)[]>(
    "SELECT * FROM products WHERE id = ?",
    [id],
  );
  return rows[0];
}

// CREATE
export async function insertProduct(data: ProductInput) {
  await db.execute(
    "INSERT INTO products (name, price, stock) VALUES (?, ?, ?)",
    [data.name, data.price, data.stock],
  );
}

// UPDATE
export async function updateProduct(id: number, data: ProductInput) {
  await db.execute(
    "UPDATE products SET name = ?, price = ?, stock = ? WHERE id = ?",
    [data.name, data.price, data.stock, id],
  );
}

// DELETE
export async function deleteProduct(id: number) {
  await db.execute("DELETE FROM products WHERE id = ?", [id]);
}
