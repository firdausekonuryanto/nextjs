"use client";

import { deleteProductAction } from "./actions";

export default function DeleteButton({
  id,
  name,
}: {
  id: number;
  name: string;
}) {
  return (
    <form
      action={deleteProductAction.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm(`Hapus "${name}"?`)) e.preventDefault();
      }}
    >
      <button type="submit" className="text-red-600 hover:underline">
        Hapus
      </button>
    </form>
  );
}
