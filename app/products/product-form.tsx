"use client";

import { useActionState } from "react";
import { Button, ButtonLink } from "@/app/components/ui/button";
import {
  createProductAction,
  updateProductAction,
  type FormState,
} from "./actions";
import type { Product } from "@/lib/products";

// Satu form untuk Tambah & Edit. Kalau `product` ada → mode edit.
export default function ProductForm({ product }: { product?: Product }) {
  const action = product
    ? updateProductAction.bind(null, product.id)
    : createProductAction;
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    action,
    {},
  );

  const v = state.values ?? {
    name: product?.name ?? "",
    price: product ? String(product.price) : "",
    stock: product ? String(product.stock) : "",
  };
  const e = state.errors ?? {};

  return (
    <form
      action={formAction}
      className={`rounded-xl border bg-white p-5 shadow-sm ${product ? "border-blue-300 ring-2 ring-blue-100" : ""}`}
    >
      <h2 className="mb-4 font-semibold">
        {product ? (
          <>
            Edit Produk <span className="text-slate-400">#{product.id}</span>
          </>
        ) : (
          "Tambah Produk"
        )}
      </h2>

      {/* 1 baris di desktop: Nama | Harga | Stok | Tombol */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:items-start">
        <Field
          className="sm:col-span-2 lg:col-span-5"
          label="Nama produk"
          name="name"
          defaultValue={v.name}
          error={e.name}
        />
        <Field
          className="lg:col-span-2"
          label="Harga (Rp)"
          name="price"
          type="number"
          defaultValue={v.price}
          error={e.price}
        />
        <Field
          className="lg:col-span-2"
          label="Stok"
          name="stock"
          type="number"
          defaultValue={v.stock}
          error={e.stock}
        />

        <div className="flex gap-2 sm:col-span-2 lg:col-span-3 lg:pt-6">
          <Button type="submit" loading={pending} className="flex-1">
            {product ? "Update" : "Simpan"}
          </Button>
          {product && (
            <ButtonLink href="/products" variant="secondary">
              Batal
            </ButtonLink>
          )}
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  error,
  className = "",
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue: string;
  error?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-sm font-medium">{label}</span>
      <input
        key={defaultValue}
        name={name}
        type={type}
        min={type === "number" ? 0 : undefined}
        defaultValue={defaultValue}
        className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-slate-300"
        }`}
      />
      {error && (
        <span className="mt-1 block text-sm text-red-600">{error}</span>
      )}
    </label>
  );
}
