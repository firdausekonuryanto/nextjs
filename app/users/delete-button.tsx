"use client";

import { deleteUserAction } from "./actions";

export default function DeleteButton({
  id,
  name,
}: {
  id: number;
  name: string;
}) {
  return (
    <form
      action={deleteUserAction.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm(`Hapus user "${name}"?`)) e.preventDefault();
      }}
    >
      <button type="submit" className="text-red-600 hover:underline">
        Hapus
      </button>
    </form>
  );
}
