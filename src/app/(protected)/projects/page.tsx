"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
import { Add, FolderOpen, People, Settings } from "@mui/icons-material";
import { apiClient } from "@/lib/api";
import { useRBAC } from "@/context/RBACContext";
import PageHeader from "@/app/components/layout/PageHeader";
import ProjectSettingsDialog from "@/app/components/projects/ProjectSettingsDialog";

interface Project {
  id: string;
  name: string;
  slug: string;
  orgId: string;
  createdAt: string;
}

interface ProjectMember {
  id: string;
  name: string;
  email: string;
  roleName: string;
}

export default function ProjectsPage() {
  const theme = useTheme();
  const { activeOrgId, can, refreshContexts } = useRBAC();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [creating, setCreating] = useState(false);

  // Settings Dialog
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

  // Members panel
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);

  const fetchProjects = useCallback(async () => {
    if (!activeOrgId) return;
    try {
      setLoading(true);
      const data = await apiClient<Project[]>(
        `/projects?orgId=${activeOrgId}`,
        {
          auth: true,
        },
      );
      setProjects(data);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  }, [activeOrgId]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const fetchMembers = async (project: Project) => {
    setSelectedProject(project);
    setMembersLoading(true);
    try {
      const data = await apiClient<ProjectMember[]>(
        `/projects/${project.id}/members`,
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

  const handleCreate = async () => {
    if (!name || !slug || !activeOrgId) return;
    setCreating(true);
    try {
      await apiClient("/projects", {
        auth: true,
        method: "POST",
        body: JSON.stringify({ name, slug, orgId: activeOrgId }),
      });
      setDialogOpen(false);
      setName("");
      setSlug("");
      fetchProjects();
      refreshContexts();
    } catch (err) {
      console.error("Failed to create project:", err);
    } finally {
      setCreating(false);
    }
  };

  const handleOpenSettings = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setProjectToEdit(project);
    setSettingsOpen(true);
  };

  const handleSettingsUpdate = () => {
    fetchProjects();
    refreshContexts();
  };

  if (!activeOrgId) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <PageHeader
          title="Projects"
          description="Select an organization first to view its projects"
        />
        <Card>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <FolderOpen sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No organization selected
            </Typography>
            <Typography variant="body2" color="text.disabled">
              Use the context switcher in the sidebar to select an organization.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PageHeader
        title="Projects"
        description="Manage projects in the current organization"
      />

      {can("project.create") && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setDialogOpen(true)}
          >
            Create Project
          </Button>
        </Box>
      )}

      {loading ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" height={80} />
          ))}
        </Box>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <FolderOpen sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No projects yet
            </Typography>
            <Typography variant="body2" color="text.disabled">
              Create a project to start organizing work.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Fade in>
          <Box sx={{ display: "flex", gap: 3 }}>
            {/* Project Table */}
            <TableContainer
              component={Paper}
              sx={{ flex: selectedProject ? 1 : "auto" }}
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
                  {projects.map((proj) => (
                    <TableRow
                      key={proj.id}
                      hover
                      selected={selectedProject?.id === proj.id}
                      sx={{ cursor: "pointer" }}
                      onClick={() => fetchMembers(proj)}
                    >
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <FolderOpen
                            sx={{ fontSize: 20, color: "primary.main" }}
                          />
                          <Typography fontWeight={600}>{proj.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={proj.slug}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(proj.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">
                        <Box display="flex" justifyContent="flex-end">
                          <Tooltip title="View Members">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                fetchMembers(proj);
                              }}
                              sx={{ mr: 1 }}
                            >
                              <People fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {can("project.update") && (
                            <Tooltip title="Settings">
                              <IconButton
                                size="small"
                                onClick={(e) => handleOpenSettings(proj, e)}
                              >
                                <Settings fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Members Panel */}
            {selectedProject && (
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
                    {selectedProject.name} — Members
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
                      No members assigned to this project.
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

      {/* Create Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create Project</DialogTitle>
        <DialogContent>
          <TextField
            label="Project Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setSlug(
                e.target.value
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)/g, ""),
              );
            }}
            fullWidth
            sx={{ mt: 1 }}
          />
          <TextField
            label="Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
            helperText="URL-friendly identifier (auto-generated)"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={creating || !name || !slug}
          >
            {creating ? "Creating..." : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Settings Dialog */}
      {projectToEdit && (
        <ProjectSettingsDialog
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          project={projectToEdit}
          onUpdate={handleSettingsUpdate}
        />
      )}
    </Container>
  );
}
