"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Skeleton,
  Fade,
  IconButton,
  Tooltip,
  alpha,
  useTheme,
} from "@mui/material";
import { Add, Business, People } from "@mui/icons-material";
import { apiClient } from "@/lib/api";
import PageHeader from "@/app/components/layout/PageHeader";

interface Organization {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

interface OrgMember {
  id: string;
  name: string;
  email: string;
  roleName: string;
}

export default function OrganizationsPage() {
  const theme = useTheme();
  const router = useRouter();
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  // Members panel
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);

  const fetchOrgs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiClient<Organization[]>("/organizations", {
        auth: true,
      });
      setOrgs(data);
    } catch (err) {
      console.error("Failed to fetch organizations:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrgs();
  }, [fetchOrgs]);

  const fetchMembers = async (org: Organization) => {
    setSelectedOrg(org);
    setMembersLoading(true);
    try {
      const data = await apiClient<OrgMember[]>(
        `/organizations/${org.id}/members`,
        { auth: true },
      );
      setMembers(data);
    } catch (err) {
      console.error("Failed to fetch members:", err);
      setMembers([]);
    } finally {
      setMembersLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PageHeader
        title="Organizations"
        subtitle="Manage all organizations on the platform"
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => router.push("/admin/organizations/create")}
        >
          Create Organization
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" height={80} />
          ))}
        </Box>
      ) : orgs.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <Business sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No organizations yet
            </Typography>
            <Typography variant="body2" color="text.disabled">
              Create your first organization to get started.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Fade in>
          <Box sx={{ display: "flex", gap: 3 }}>
            {/* Org Table */}
            <TableContainer
              component={Paper}
              sx={{ flex: selectedOrg ? 1 : "auto" }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Slug</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orgs.map((org) => (
                    <TableRow
                      key={org.id}
                      hover
                      selected={selectedOrg?.id === org.id}
                      sx={{ cursor: "pointer" }}
                      onClick={() => fetchMembers(org)}
                    >
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Business
                            sx={{ fontSize: 20, color: "primary.main" }}
                          />
                          <Typography fontWeight={600}>{org.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={org.slug}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(org.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="View Members">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              fetchMembers(org);
                            }}
                          >
                            <People fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Members Panel */}
            {selectedOrg && (
              <Fade in>
                <Paper sx={{ flex: 1, p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    <People
                      sx={{
                        fontSize: 20,
                        mr: 1,
                        verticalAlign: "text-bottom",
                      }}
                    />
                    {selectedOrg.name} — Members
                  </Typography>

                  {membersLoading ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        mt: 2,
                      }}
                    >
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} height={40} />
                      ))}
                    </Box>
                  ) : members.length === 0 ? (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 2 }}
                    >
                      No members in this organization.
                    </Typography>
                  ) : (
                    <Table size="small" sx={{ mt: 1 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>Role</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {members.map((m) => (
                          <TableRow key={m.id}>
                            <TableCell>{m.name}</TableCell>
                            <TableCell>{m.email}</TableCell>
                            <TableCell>
                              <Chip
                                label={m.roleName}
                                size="small"
                                sx={{
                                  fontWeight: 600,
                                  bgcolor: alpha(
                                    theme.palette.primary.main,
                                    0.08,
                                  ),
                                  color: "primary.main",
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </Paper>
              </Fade>
            )}
          </Box>
        </Fade>
      )}
    </Container>
  );
}
