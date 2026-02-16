import { apiClient } from "@/lib/api";
import { IUser } from "@/lib/types";
import { useEffect, useState, useCallback } from "react";

export function useAdminUsers(selectedOrgId?: string) {
  const [rows, setRows] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      // Pass org context via custom headers if selectedOrgId is provided
      const headers: Record<string, string> = {};
      if (selectedOrgId) {
        headers["x-org-id"] = selectedOrgId;
      }

      const data = await apiClient<IUser[]>("/users", {
        auth: true,
        headers,
      });
      setRows(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [selectedOrgId]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    rows,
    loading,
    selectedUser,
    setSelectedUser,
    refresh: fetchUsers,
  };
}
