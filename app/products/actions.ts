"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/dal";
import {
  CATEGORIES,
  deleteProduct,
  insertProduct,
  updateProduct,
  type Category,
  type ProductInput,
} from "@/lib/products";

export type FormState = {
  errors?: Partial<Record<keyof ProductInput, string>>;
  values?: { name: string; category: string; price: string; stock: string };
};

// Validasi — padanan $request->validate([...]) di Laravel.
function validate(formData: FormData) {
  const values = {
    name: String(formData.get("name") ?? "").trim(),
    category: String(formData.get("category") ?? ""),
    price: String(formData.get("price") ?? "").trim(),
    stock: String(formData.get("stock") ?? "").trim(),
  };
  const errors: FormState["errors"] = {};

  if (!values.name) errors.name = "Nama wajib diisi.";
  else if (values.name.length > 100)
    errors.name = "Nama maksimal 100 karakter.";

  if (!CATEGORIES.includes(values.category as Category))
    errors.category = "Pilih kategori.";
  if (!/^\d+$/.test(values.price))
    errors.price = "Harga harus angka bulat ≥ 0.";
  if (!/^\d+$/.test(values.stock)) errors.stock = "Stok harus angka bulat ≥ 0.";

  const data: ProductInput = {
    name: values.name,
    category: values.category as Category,
    price: Number(values.price),
    stock: Number(values.stock),
  };
  return { values, errors, data, ok: Object.keys(errors).length === 0 };
}

export async function createProductAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireUser();
  const { ok, errors, values, data } = validate(formData);
  if (!ok) return { errors, values };

  await insertProduct(data);
  revalidatePath("/products");
  redirect("/products?msg=created");
}

export async function updateProductAction(
  id: number,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireUser();
  const { ok, errors, values, data } = validate(formData);
  if (!ok) return { errors, values };

  await updateProduct(id, data);
  revalidatePath("/products");
  redirect("/products?msg=updated");
}

export async function deleteProductAction(id: number) {
  await requireUser();
  await deleteProduct(id);
  revalidatePath("/products");
  redirect("/products?msg=deleted");
}
