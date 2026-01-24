import { getAllUsers } from "@/lib/api/api.users";
import { IUser } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";

const useAdminDashboard = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsers()
      .then((u) => setUsers(u))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    return {
      totalUsers: users.length,
      activeUsers: users.filter((u) => u.isActive).length,
      managers: users.filter((u) => u.role === "MANAGER").length,
      resolvers: users.filter((u) => u.role === "RESOLVER").length,
      loading,
    };
  }, [users, loading]);

  return stats;
};

export default useAdminDashboard;
