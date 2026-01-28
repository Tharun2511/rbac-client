"use client";

import AdminUserTable from "@/app/components/data/AdminUserTable";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { Box } from "@mui/material";
import ChangeRoleDialog from "@/app/components/dialogs/ChangeRoleDialog";
import { useChangeRole } from "@/hooks/useChangeRole";
import { useToggleUserStatus } from "@/hooks/useUserToggleStatus";
import ConfirmDialog from "@/app/components/dialogs/ConfirmDialog";
import PageHeader from "@/app/components/layout/PageHeader";

const AdminUsersPage = () => {
  const { rows, loading, setSelectedUser, refresh } = useAdminUsers();

  const {
    editOpen,
    setEditOpen,
    setNewSelectedRole,
    roleUser,
    loading: roleLoading,
    setRoleUser,
    submit: submitRole,
  } = useChangeRole(refresh);

  const {
    toggleStatusOpen,
    setToggleStatusOpen,
    targetUser,
    setTargetUser,
    loading: toggleLoading,
    submit: submitToggle,
  } = useToggleUserStatus(() => {
    refresh();
  });

  return (
    <Box>
      <PageHeader title="User Management" />

      <AdminUserTable
        rows={rows}
        loading={loading}
        onChangeRole={(user) => {
          setSelectedUser(user.id);
          setRoleUser(user);
          setEditOpen(true);
        }}
        onChangeStatus={(user) => {
          setSelectedUser(user.id);
          setTargetUser(user);
          setToggleStatusOpen(true);
        }}
      />

      <ChangeRoleDialog
        open={editOpen}
        currentRole={roleUser?.role ?? ""}
        loading={roleLoading}
        onSelectRole={setNewSelectedRole}
        onClose={() => setEditOpen(false)}
        onSubmit={submitRole}
      />

      <ConfirmDialog
        open={!!toggleStatusOpen}
        loading={toggleLoading}
        title={targetUser?.isActive ? "Deactivate User" : "Activate User"}
        description={
          targetUser?.isActive
            ? "This will prevent the user from logging in or performing any actions."
            : "This will re-enable the user's access to the system."
        }
        confirmLabel={targetUser?.isActive ? "Deactivate" : "Activate"}
        onCancel={() => setToggleStatusOpen(false)}
        onConfirm={submitToggle}
      />
    </Box>
  );
};

export default AdminUsersPage;
