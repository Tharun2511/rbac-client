"use client";

import {
  Box,
  Button,
  MenuItem,
  TextField,
  Stack,
  Typography,
  Grid,
  Paper,
  Divider,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/app/components/layout/PageHeader";
import { useCreateUser } from "@/hooks/useCreateUser";

export default function CreateUserPage() {
  const router = useRouter();

  const {
    name,
    email,
    password,
    role,
    loading,
    setName,
    setEmail,
    setPassword,
    setRole,
    submit,
  } = useCreateUser(() => {
    router.push("/admin/users");
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () =>
    setShowPassword((show: boolean) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  return (
    <>
      <PageHeader title="Create New User" />

      <Paper
        variant="outlined"
        sx={{
          p: { xs: 3, md: 5 },
          mt: 2,
          borderRadius: 2,
          borderColor: "divider",
          backgroundColor: "background.paper",
        }}
      >
        <Stack spacing={4}>
          {/* Section 1: User Identity */}
          <Box>
            <Typography
              variant="h6"
              color="text.primary"
              fontWeight={600}
              gutterBottom
            >
              Personal Details
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Enter the user basic profile information.
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Full Name"
                  placeholder="e.g. Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Email Address"
                  placeholder="e.g. jane@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  required
                  type="email"
                />
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* Section 2: Access Control */}
          <Box>
            <Typography
              variant="h6"
              color="text.primary"
              fontWeight={600}
              gutterBottom
            >
              Security & Access
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Define login credentials and system permissions.
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOff fontSize="small" />
                          ) : (
                            <Visibility fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  // helperText="Must be at least 8 characters"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Role"
                  select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  fullWidth
                  required
                >
                  <MenuItem value="ADMIN">Admin</MenuItem>
                  <MenuItem value="MANAGER">Manager</MenuItem>
                  <MenuItem value="RESOLVER">Resolver</MenuItem>
                  <MenuItem value="USER">User (Standard)</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Box>

          <Box pt={2} display="flex" justifyContent="flex-end" gap={2}>
            <Button
              size="large"
              onClick={() => router.push("/admin/users")}
              disabled={loading}
              color="inherit"
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={submit}
              disabled={loading || !name || !email || !password}
              sx={{ px: 4, borderRadius: 2 }}
            >
              {loading ? "Creating..." : "Create User"}
            </Button>
          </Box>
        </Stack>
      </Paper>
    </>
  );
}
