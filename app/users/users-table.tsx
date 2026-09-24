"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import DataTable, { columnHelper } from "@/app/components/data-table";
import { Icon } from "@/app/components/ui/icons";
import type { User } from "@/lib/users";
import DeleteButton from "./delete-button";

const tanggal = (d: Date) =>
  new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(d));

export default function UsersTable({
  users,
  meId,
  editingId,
}: {
  users: User[];
  meId: number;
  editingId?: number;
}) {
  const [role, setRole] = useState("");
  const data = useMemo(
    () => (role ? users.filter((u) => u.role === role) : users),
    [users, role],
  );

  // Kolom butuh meId (sembunyikan Hapus untuk diri sendiri), jadi dibuat dengan useMemo
  const columns = useMemo(() => {
    const col = columnHelper<User>();
    return col.columns([
      col.accessor("id", {
        header: "#",
        cell: (c) => <span className="text-slate-400">{c.getValue()}</span>,
      }),
      col.accessor("name", {
        header: "Nama",
        cell: ({ row }) => (
          <span className="flex items-center gap-2 font-medium">
            <span className="grid h-6 w-6 place-items-center rounded-full border bg-slate-100 text-xs font-semibold">
              {row.original.name.charAt(0).toUpperCase()}
            </span>
            {row.original.name}
            {row.original.id === meId && (
              <span className="text-xs font-normal text-slate-400">(Anda)</span>
            )}
          </span>
        ),
      }),
      col.accessor("email", {
        header: "Email",
        cell: (c) => <span className="text-slate-600">{c.getValue()}</span>,
      }),
      col.accessor("role", {
        header: "Role",
        meta: { align: "center" },
        cell: (c) => (
          <span
            className={`rounded px-1.5 py-0.5 text-xs font-medium ${
              c.getValue() === "admin"
                ? "bg-purple-100 text-purple-700"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {c.getValue()}
          </span>
        ),
      }),
      col.accessor("created_at", {
        header: "Dibuat",
        sortFn: "datetime",
        enableGlobalFilter: false,
        cell: (c) => (
          <span className="text-slate-500">{tanggal(c.getValue())}</span>
        ),
      }),
      col.display({
        id: "actions",
        header: "Aksi",
        meta: { align: "center" },
        cell: ({ row }) => (
          <span className="inline-flex items-center gap-2 text-xs">
            <Link
              href={`/users?edit=${row.original.id}`}
              className="inline-flex items-center gap-1 text-blue-600 hover:underline"
            >
              <Icon.Pencil className="h-3.5 w-3.5" /> Edit
            </Link>
            {row.original.id !== meId && (
              <>
                <span className="text-slate-300">|</span>
                <DeleteButton id={row.original.id} name={row.original.name} />
              </>
            )}
          </span>
        ),
      }),
    ]);
  }, [meId]);

  return (
    <DataTable
      title="Daftar Users"
      data={data}
      columns={columns}
      getRowId={(u) => String(u.id)}
      itemLabel="user"
      searchPlaceholder="Cari nama atau email..."
      highlightRowId={editingId ? String(editingId) : undefined}
      exportFileName="users"
      toolbar={
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="h-8 rounded-md border border-slate-300 bg-white px-2 text-sm"
        >
          <option value="">Semua Role</option>
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
        </select>
      }
    />
  );
}
