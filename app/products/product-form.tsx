"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { FormState } from "./actions";
import type { ProductInput } from "@/lib/products";
import { Button, ButtonLink } from "@/app/components/ui/button";

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  product?: ProductInput;
  submitLabel: string;
};

export default function ProductForm({ action, product, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, {});

  // seperti old('name', $product->name)
  const v = state.values ?? {
    name: product?.name ?? "",
    price: product ? String(product.price) : "",
    stock: product ? String(product.stock) : "",
  };

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-xl border bg-white p-6 shadow-sm"
    >
      <Field
        label="Nama produk"
        name="name"
        defaultValue={v.name}
        error={state.errors?.name}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Harga (Rp)"
          name="price"
          type="number"
          defaultValue={v.price}
          error={state.errors?.price}
        />
        <Field
          label="Stok"
          name="stock"
          type="number"
          defaultValue={v.stock}
          error={state.errors?.stock}
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" loading={pending}>
          {pending ? "Menyimpan..." : submitLabel}
        </Button>
        <ButtonLink href="/products" variant="ghost">
          Batal
        </ButtonLink>
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
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue: string;
  error?: string;
}) {
  return (
    <label className="block">
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
