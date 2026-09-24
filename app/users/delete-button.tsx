"use client";

import { deleteUserAction } from "./actions";
import { Icon } from "@/app/components/ui/icons";

export default function DeleteButton({
  id,
  name,
}: {
  id: number;
  name: string;
}) {
  return (
    <form
      className="inline-flex"
      action={deleteUserAction.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm(`Hapus user "${name}"?`)) e.preventDefault();
      }}
    >
      <button
        type="submit"
        className="inline-flex items-center gap-1 text-red-600 hover:underline"
      >
        <Icon.Trash className="h-3.5 w-3.5" /> Hapus
      </button>
    </form>
  );
}
