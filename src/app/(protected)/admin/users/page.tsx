"use client";

import { useState } from "react";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Select,
  Box,
  Skeleton,
  Fade,
  alpha,
  useTheme,
} from "@mui/material";
import { MoreVert, Circle, People } from "@mui/icons-material";
import { useRBAC } from "@/context/RBACContext";
import { IUser } from "@/lib/types";
import ChangeRoleDialog from "@/app/components/dialogs/ChangeRoleDialog";
import { useChangeRole } from "@/hooks/useChangeRole";
import { useToggleUserStatus } from "@/hooks/useUserToggleStatus";
import ConfirmDialog from "@/app/components/dialogs/ConfirmDialog";
import PageHeader from "@/app/components/layout/PageHeader";

const AdminUsersPage = () => {
  const theme = useTheme();
  const { organizations } = useRBAC();
  const [selectedOrgId, setSelectedOrgId] = useState<string | undefined>(
    undefined,
  );
  const { rows, loading, setSelectedUser, refresh } =
    useAdminUsers(selectedOrgId);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuUser, setMenuUser] = useState<IUser | null>(null);

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

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    user: IUser,
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuUser(null);
  };

  const handleChangeRole = () => {
    if (menuUser) {
      setSelectedUser(menuUser.id);
      setRoleUser(menuUser);
      setEditOpen(true);
    }
    handleMenuClose();
  };

  const handleChangeStatus = () => {
    if (menuUser) {
      setSelectedUser(menuUser.id);
      setTargetUser(menuUser);
      setToggleStatusOpen(true);
    }
    handleMenuClose();
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <PageHeader
        title="Users"
        subtitle="View and manage users across organizations"
      />

      {/* Organization Selector */}
      <Box sx={{ mb: 3 }}>
        <Select
          value={selectedOrgId || "all"}
          onChange={(e) =>
            setSelectedOrgId(e.target.value === "all" ? undefined : e.target.value)
          }
          displayEmpty
          fullWidth
          sx={{
            maxWidth: 400,
            "& .MuiSelect-select": {
              display: "flex",
              alignItems: "center",
              gap: 1,
            },
          }}
        >
          <MenuItem value="all">
            <People sx={{ mr: 1, fontSize: 20 }} />
            All Organizations
          </MenuItem>
          {organizations.map((org) => (
            <MenuItem key={org.id} value={org.id}>
              <People sx={{ mr: 1, fontSize: 20, color: "primary.main" }} />
              {org.name}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* User Cards Grid */}
      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
              <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      ) : rows.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 8 }}>
            <People sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No users found
            </Typography>
            <Typography variant="body2" color="text.disabled">
              {selectedOrgId
                ? "No users in this organization"
                : "No users in the system"}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Fade in>
          <Grid container spacing={3}>
            {rows.map((user) => (
              <Grid key={user.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  sx={{
                    height: "100%",
                    transition: "all 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: theme.shadows[8],
                    },
                  }}
                >
                  <CardContent>
                    {/* Header with Avatar and Menu */}
                    <Box
                      sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: user.isSystemAdmin
                            ? "error.main"
                            : "primary.main",
                          width: 56,
                          height: 56,
                          fontSize: "1.5rem",
                          mr: 2,
                        }}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: "1.1rem",
                            fontWeight: 600,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {user.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {user.email}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, user)}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>

                    {/* Badges */}
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        alignItems: "center",
                      }}
                    >
                      {user.isSystemAdmin && (
                        <Chip
                          label="System Admin"
                          size="small"
                          sx={{
                            bgcolor: alpha(theme.palette.error.main, 0.1),
                            color: "error.main",
                            fontWeight: 600,
                          }}
                        />
                      )}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          px: 1,
                          py: 0.5,
                          bgcolor: user.isActive
                            ? alpha(theme.palette.success.main, 0.1)
                            : alpha(theme.palette.grey[500], 0.1),
                          borderRadius: 1,
                        }}
                      >
                        <Circle
                          sx={{
                            fontSize: 10,
                            color: user.isActive
                              ? "success.main"
                              : "grey.400",
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                            color: user.isActive
                              ? "success.main"
                              : "text.secondary",
                          }}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Fade>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleChangeRole}>Change Role</MenuItem>
        <MenuItem onClick={handleChangeStatus}>
          {menuUser?.isActive ? "Deactivate User" : "Activate User"}
        </MenuItem>
      </Menu>

      {/* Dialogs */}
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
    </Container>
  );
};

export default AdminUsersPage;
