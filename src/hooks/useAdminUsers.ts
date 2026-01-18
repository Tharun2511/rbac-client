import { getUsers } from "@/lib/api/api.users";
import { IUser } from "@/lib/types";
import { useEffect, useState } from "react";

export function useAdminUsers() {
  const [rows, setRows] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    const data = await getUsers();
    setRows(data);
    setLoading(false);
  };

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      const data = await getUsers();
      setRows(data);
      setLoading(false);
    };

    loadUsers();
  }, []);

  return {
    rows,
    loading,
    selectedUser,
    setSelectedUser,
    refresh: fetchUsers,
  };
}
