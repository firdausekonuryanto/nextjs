import { connection } from "next/server";
import type { RowDataPacket } from "mysql2";
import bcrypt from "bcryptjs";
import { db } from "./db";

export type Role = "admin" | "staff";
export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
  created_at: Date;
};
export type UserInput = {
  name: string;
  email: string;
  role: Role;
  password?: string;
};

// Kolom password sengaja TIDAK di-SELECT (seperti $hidden di Model Laravel)
const COLUMNS = "id, name, email, role, created_at";

export async function getUsers(q = ""): Promise<User[]> {
  await connection();
  const [rows] = await db.query<(User & RowDataPacket)[]>(
    `SELECT ${COLUMNS} FROM users WHERE name LIKE ? OR email LIKE ? ORDER BY id DESC`,
    [`%${q}%`, `%${q}%`],
  );
  return rows;
}

export async function getUser(id: number): Promise<User | undefined> {
  await connection();
  const [rows] = await db.query<(User & RowDataPacket)[]>(
    `SELECT ${COLUMNS} FROM users WHERE id = ?`,
    [id],
  );
  return rows[0];
}

// = rule unique:users,email,$id
export async function emailExists(email: string, exceptId?: number) {
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT id FROM users WHERE email = ? AND id <> ?",
    [email, exceptId ?? 0],
  );
  return rows.length > 0;
}

export async function insertUser(data: UserInput) {
  const hash = await bcrypt.hash(data.password!, 10); // = Hash::make()
  await db.execute(
    "INSERT INTO users (name, email, role, password) VALUES (?, ?, ?, ?)",
    [data.name, data.email, data.role, hash],
  );
}

export async function updateUser(id: number, data: UserInput) {
  if (data.password) {
    const hash = await bcrypt.hash(data.password, 10);
    await db.execute(
      "UPDATE users SET name = ?, email = ?, role = ?, password = ? WHERE id = ?",
      [data.name, data.email, data.role, hash, id],
    );
  } else {
    await db.execute(
      "UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?",
      [data.name, data.email, data.role, id],
    );
  }
}

export async function deleteUser(id: number) {
  await db.execute("DELETE FROM users WHERE id = ?", [id]);
}

export async function getUserForLogin(email: string) {
  const [rows] = await db.query<
    (User & { password: string } & RowDataPacket)[]
  >(`SELECT ${COLUMNS}, password FROM users WHERE email = ?`, [email]);
  return rows[0];
}
