"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  Box,
} from "@mui/material";

interface AddUserDialogProps {
  open: boolean;
  name: string;
  email: string;
  password: string;
  role: string;
  loading: boolean;
  onClose: () => void;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onSubmit: () => void;
}

export default function AddUserDialog({
  open,
  name,
  email,
  password,
  role,
  loading,
  onClose,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onRoleChange,
  onSubmit,
}: AddUserDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundImage: "none",
          bgcolor: "background.paper",
        },
      }}
    >
      <DialogTitle>Add User</DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} m={1}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
          />

          <TextField
            label="Email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
          />

          <TextField
            label="Role"
            select
            value={role}
            onChange={(e) => onRoleChange(e.target.value)}
          >
            <MenuItem value="ADMIN">Admin</MenuItem>
            <MenuItem value="MANAGER">Manager</MenuItem>
            <MenuItem value="RESOLVER">Resolver</MenuItem>
            <MenuItem value="USER">User</MenuItem>
          </TextField>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={onSubmit} disabled={loading}>
          {loading ? "Creating…" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
