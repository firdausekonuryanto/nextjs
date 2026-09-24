"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  deleteProduct,
  insertProduct,
  updateProduct,
  type ProductInput,
} from "@/lib/products";

export type FormState = {
  errors?: Partial<Record<keyof ProductInput, string>>;
  values?: { name: string; price: string; stock: string };
};

// Validasi — padanan $request->validate([...])
function validate(formData: FormData) {
  const values = {
    name: String(formData.get("name") ?? "").trim(),
    price: String(formData.get("price") ?? "").trim(),
    stock: String(formData.get("stock") ?? "").trim(),
  };
  const errors: FormState["errors"] = {};

  if (!values.name) errors.name = "Nama wajib diisi.";
  else if (values.name.length > 100)
    errors.name = "Nama maksimal 100 karakter.";
  if (!/^\d+$/.test(values.price))
    errors.price = "Harga harus angka bulat ≥ 0.";
  if (!/^\d+$/.test(values.stock)) errors.stock = "Stok harus angka bulat ≥ 0.";

  const data: ProductInput = {
    name: values.name,
    price: Number(values.price),
    stock: Number(values.stock),
  };
  return { values, errors, data, ok: Object.keys(errors).length === 0 };
}

// store()
export async function createProductAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { ok, errors, values, data } = validate(formData);
  if (!ok) return { errors, values }; // = withErrors()->withInput()

  await insertProduct(data);
  revalidatePath("/products");
  redirect("/products?msg=created");
}

// update($id)
export async function updateProductAction(
  id: number,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { ok, errors, values, data } = validate(formData);
  if (!ok) return { errors, values };

  await updateProduct(id, data);
  revalidatePath("/products");
  redirect("/products?msg=updated");
}

// destroy($id)
export async function deleteProductAction(id: number) {
  await deleteProduct(id);
  revalidatePath("/products");
  redirect("/products?msg=deleted");
}
