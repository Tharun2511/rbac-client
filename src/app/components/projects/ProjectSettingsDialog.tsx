"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Box,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  PersonRemove as RemoveIcon,
} from "@mui/icons-material";
import { IProject } from "@/lib/types";
import { useRBAC } from "@/context/RBACContext";
import {
  updateProject,
  deleteProject,
  getProjectMembers,
  removeMember,
  addMemberToProject,
  getOrgUsersForProject,
  getProjectRoles,
  ProjectMember,
  OrgUser,
  ProjectRole,
} from "@/lib/api/api.projects";

interface Props {
  open: boolean;
  onClose: () => void;
  project: IProject;
  onUpdate: () => void;
}

export default function ProjectSettingsDialog({
  open,
  onClose,
  project,
  onUpdate,
}: Props) {
  const { can, activeOrgId } = useRBAC();
  const [tab, setTab] = useState(0);

  // General State
  const [name, setName] = useState(project.name);
  const [updating, setUpdating] = useState(false);

  // Members State
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  // Add Member State
  const [availableUsers, setAvailableUsers] = useState<OrgUser[]>([]);
  const [projectRoles, setProjectRoles] = useState<ProjectRole[]>([]);
  const [selectedUser, setSelectedUser] = useState<OrgUser | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [addingMember, setAddingMember] = useState(false);

  // Danger Zone State
  const [deleting, setDeleting] = useState(false);

  const fetchMembers = useCallback(async () => {
    try {
      setLoadingMembers(true);
      const data = await getProjectMembers(project.id);
      setMembers(data);
    } catch (err) {
      console.error("Failed to load members", err);
    } finally {
      setLoadingMembers(false);
    }
  }, [project.id]);

  const fetchAvailableUsers = useCallback(async () => {
    if (!activeOrgId) return;
    try {
      const users = await getOrgUsersForProject(activeOrgId, project.id);
      setAvailableUsers(users);
    } catch (err) {
      console.error("Failed to load available users", err);
    }
  }, [activeOrgId, project.id]);

  const fetchRoles = useCallback(async () => {
    try {
      const roles = await getProjectRoles();
      setProjectRoles(roles);
      if (roles.length > 0 && !selectedRoleId) {
        setSelectedRoleId(roles[0].id);
      }
    } catch (err) {
      console.error("Failed to load roles", err);
    }
  }, [selectedRoleId]);

  useEffect(() => {
    if (open) {
      setName(project.name);
      fetchMembers();
      fetchAvailableUsers();
      fetchRoles();
    }
  }, [open, project, fetchMembers, fetchAvailableUsers, fetchRoles]);

  const handleSaveGeneral = async () => {
    if (!name) return;
    setUpdating(true);
    try {
      await updateProject(project.id, name);
      onUpdate();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!confirm("Are you sure? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await deleteProject(project.id);
      onUpdate();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm("Remove this member?")) return;
    try {
      await removeMember(project.id, userId);
      fetchMembers();
      fetchAvailableUsers(); // Refresh available users
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMember = async () => {
    if (!selectedUser || !selectedRoleId || !activeOrgId) return;
    setAddingMember(true);
    try {
      await addMemberToProject(
        project.id,
        selectedUser.id,
        selectedRoleId,
        activeOrgId,
      );
      setSelectedUser(null);
      fetchMembers();
      fetchAvailableUsers(); // Refresh available users
    } catch (err) {
      console.error("Failed to add member:", err);
      alert("Failed to add member. Please try again.");
    } finally {
      setAddingMember(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Project Settings: {project.name}</DialogTitle>
      <DialogContent>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label="General" />
          <Tab label="Members" />
          <Tab label="Danger Zone" />
        </Tabs>

        {/* General Tab */}
        {tab === 0 && (
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Project Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Slug"
              value={project.slug}
              fullWidth
              disabled
              helperText="Slug cannot be changed after creation"
            />
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                variant="contained"
                onClick={handleSaveGeneral}
                disabled={updating || !can("project.update")}
              >
                {updating ? "Saving..." : "Save Changes"}
              </Button>
            </Box>
          </Box>
        )}

        {/* Members Tab */}
        {tab === 1 && (
          <Box>
            {loadingMembers ? (
              <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <List>
                {members.map((m) => (
                  <ListItem key={m.id}>
                    <ListItemText
                      primary={m.name}
                      secondary={`${m.email} • ${m.roleName}`}
                    />
                    <ListItemSecondaryAction>
                      {can("project.manage_members") && (
                        <IconButton
                          edge="end"
                          onClick={() => handleRemoveMember(m.userId)}
                        >
                          <RemoveIcon />
                        </IconButton>
                      )}
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
                {members.length === 0 && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    No members found.
                  </Typography>
                )}
              </List>
            )}

            {/* Add Member UI */}
            {can("project.manage_members") && (
              <Box mt={3} p={2} bgcolor="action.hover" borderRadius={1}>
                <Typography variant="subtitle2" gutterBottom>
                  Add Member from Organization
                </Typography>
                <Box display="flex" gap={1} flexDirection="column">
                  <Box display="flex" gap={1} alignItems="flex-start">
                    <Autocomplete
                      size="small"
                      options={availableUsers}
                      getOptionLabel={(opt) => `${opt.name} (${opt.email})`}
                      value={selectedUser}
                      onChange={(_, value) => setSelectedUser(value)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select user..."
                          size="small"
                        />
                      )}
                      fullWidth
                      noOptionsText="No available users in this organization"
                    />
                    <TextField
                      size="small"
                      select
                      value={selectedRoleId}
                      onChange={(e) => setSelectedRoleId(e.target.value)}
                      sx={{ minWidth: 160 }}
                      label="Role"
                    >
                      {projectRoles.map((role) => (
                        <MenuItem key={role.id} value={role.id}>
                          {role.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                  <Button
                    variant="contained"
                    size="small"
                    disabled={!selectedUser || !selectedRoleId || addingMember}
                    onClick={handleAddMember}
                    sx={{ alignSelf: "flex-end" }}
                  >
                    {addingMember ? "Adding..." : "Add Member"}
                  </Button>
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  mt={1}
                >
                  * Shows organization members not yet added to this project.
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Danger Zone Tab */}
        {tab === 2 && (
          <Box
            border="1px solid"
            borderColor="error.main"
            borderRadius={1}
            p={2}
            mt={1}
          >
            <Typography variant="h6" color="error" gutterBottom>
              Delete Project
            </Typography>
            <Typography variant="body2" paragraph>
              Once you delete a project, there is no going back. Please be
              certain.
            </Typography>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteProject}
              disabled={deleting || !can("project.delete")}
            >
              {deleting ? "Deleting..." : "Delete Project"}
            </Button>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
