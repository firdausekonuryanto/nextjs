import UserForm from "../user-form";
import { createUserAction } from "../actions";

export default function NewUserPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tambah User</h1>
      <UserForm action={createUserAction} submitLabel="Simpan" />
    </div>
  );
}
