import { updateUserStatus } from '@/lib/api/api.users';
import { IUser } from '@/lib/types';
import { useState } from 'react';

export function useToggleUserStatus(onSuccess: () => void) {
    const [toggleStatusOpen, setToggleStatusOpen] = useState(false);
  const [targetUser, setTargetUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!targetUser) return;

    setLoading(true);

    await updateUserStatus(targetUser.id, !targetUser.isActive);

    setLoading(false);
    onSuccess();
    setTargetUser(null);
  }

  return {
    toggleStatusOpen,
    setToggleStatusOpen,
    targetUser,
    setTargetUser,
    loading,
    submit,
  };
}
