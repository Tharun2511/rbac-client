import { updateUserRole } from "@/lib/api/api.users";
import { IRole, IUser } from "@/lib/types";
import { useState } from "react";

export function useChangeRole(onSuccess: () => void) {
  const [editOpen, setEditOpen] = useState(false);
  const [roleUser, setRoleUser] = useState<IUser | null>(null);
  const [newSelectedRole, setNewSelectedRole] = useState<IRole | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!roleUser) return;
    setLoading(true);

    await updateUserRole(roleUser.id, newSelectedRole as IRole);

    setLoading(false);
    onSuccess();
    setEditOpen(false);
  }

  return {
    editOpen,
    setEditOpen,
    loading,
    submit,
    roleUser,
    setRoleUser,
    newSelectedRole,
    setNewSelectedRole,
  };
}
