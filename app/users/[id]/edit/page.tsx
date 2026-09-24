import { notFound } from "next/navigation";
import { getUser } from "@/lib/users";
import { updateUserAction } from "../../actions";
import UserForm from "../../user-form";

export default async function EditUserPage({
  params,
}: PageProps<"/users/[id]/edit">) {
  const { id } = await params;
  const user = await getUser(Number(id));
  if (!user) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit User</h1>
      <UserForm
        action={updateUserAction.bind(null, user.id)}
        user={user}
        submitLabel="Update"
      />
    </div>
  );
}
