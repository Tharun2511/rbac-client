"use client";

import {
  Box,
  Button,
  MenuItem,
  TextField,
  Stack,
  Typography,
  Paper,
  Divider,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/app/components/layout/PageHeader";
import { useCreateUser } from "@/hooks/useCreateUser";
import { getOrganizations, IOrgBasic } from "@/lib/api/api.users";

export default function CreateUserPage() {
  const router = useRouter();

  const {
    name,
    email,
    password,
    orgId,
    loading,
    setName,
    setEmail,
    setPassword,
    setOrgId,
    submit,
  } = useCreateUser(() => {
    router.push("/admin/users");
  });

  const [showPassword, setShowPassword] = useState(false);
  const [orgs, setOrgs] = useState<IOrgBasic[]>([]);
  const [loadingOrgs, setLoadingOrgs] = useState(true);

  useEffect(() => {
    getOrganizations()
      .then(setOrgs)
      .catch(console.error)
      .finally(() => setLoadingOrgs(false));
  }, []);

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
              Enter the user&apos;s basic profile information.
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

          {/* Section 2: Security */}
          <Box>
            <Typography
              variant="h6"
              color="text.primary"
              fontWeight={600}
              gutterBottom
            >
              Security
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Set the login password for this user.
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
                />
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* Section 3: Organization Assignment */}
          <Box>
            <Typography
              variant="h6"
              color="text.primary"
              fontWeight={600}
              gutterBottom
            >
              Organization
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              The user will be added as a member of the selected organization
              with a default role. The org owner/admin can assign specific roles
              later.
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                {loadingOrgs ? (
                  <CircularProgress size={24} />
                ) : (
                  <TextField
                    label="Organization"
                    select
                    value={orgId}
                    onChange={(e) => setOrgId(e.target.value)}
                    fullWidth
                    required
                    helperText="User must be assigned to an organization"
                  >
                    {orgs.map((org) => (
                      <MenuItem key={org.id} value={org.id}>
                        {org.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
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
              disabled={loading || !name || !email || !password || !orgId}
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
