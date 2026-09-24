import { PageHeader, StatChip } from "@/app/components/page-header";
import Flash from "@/app/components/flash";
import { getUser, getUsers } from "@/lib/users";
import { requireAdmin } from "@/lib/dal";
import UserForm from "./user-form";
import UsersTable from "./users-table";

const messages: Record<string, string> = {
  created: "User berhasil ditambahkan.",
  updated: "User berhasil diperbarui.",
  deleted: "User berhasil dihapus.",
};

export default async function UsersPage({ searchParams }: PageProps<"/users">) {
  const me = await requireAdmin();
  const { msg, edit } = (await searchParams) as { msg?: string; edit?: string };

  const users = await getUsers();
  const editing = edit ? await getUser(Number(edit)) : undefined;
  const admins = users.filter((u) => u.role === "admin").length;

  return (
    <>
      <PageHeader title="Manajemen User" total={`Total: ${users.length} User`}>
        <StatChip label="Admin" value={admins} />
        <StatChip label="Staff" value={users.length - admins} />
      </PageHeader>

      <Flash message={msg ? messages[msg] : undefined} />
      <Flash
        tone="error"
        message={
          msg === "self" ? "Anda tidak bisa menghapus akun sendiri." : undefined
        }
      />

      <UserForm
        key={editing ? `edit-${editing.id}` : `new-${crypto.randomUUID()}`}
        user={editing}
      />
      <UsersTable users={users} meId={me.id} editingId={editing?.id} />
    </>
  );
}
