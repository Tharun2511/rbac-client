"use client";

import AdminUserTable from "@/app/components/data/AdminUserTable";
import PageHeader from "@/app/components/layout.tsx/PageHeader";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useCreateUser } from "@/hooks/useCreateUser";
import AddUserDialog from "@/app/components/dialogs/AddUserDialog";
import ChangeRoleDialog from "@/app/components/dialogs/ChangeRoleDialog";
import { useChangeRole } from "@/hooks/useChangeRole";
import { useToggleUserStatus } from "@/hooks/useUserToggleStatus";
import ConfirmDialog from "@/app/components/dialogs/ConfirmDialog";

const AdminUsersPage = () => {
  const { rows, loading, setSelectedUser, refresh } = useAdminUsers();
  const {
    addOpen,
    name,
    email,
    password,
    role,
    loading: createLoading,
    setAddOpen,
    setName,
    setEmail,
    setPassword,
    setRole,
    submit,
  } = useCreateUser(refresh);

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
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          onClick={() => setAddOpen(true)}
          startIcon={<AddIcon />}
        >
          Add User
        </Button>
      </Box>

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

      <AddUserDialog
        open={addOpen}
        name={name}
        email={email}
        password={password}
        role={role}
        loading={createLoading}
        onClose={() => setAddOpen(false)}
        onNameChange={setName}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onRoleChange={setRole}
        onSubmit={submit}
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
