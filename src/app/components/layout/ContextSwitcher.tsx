"use client";

import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Divider,
} from "@mui/material";
import {
  Business as OrgIcon,
  Folder as ProjectIcon,
} from "@mui/icons-material";
import { useRBAC } from "@/context/RBACContext";

export default function ContextSwitcher() {
  const {
    organizations,
    projects,
    activeOrgId,
    activeProjectId,
    setActiveOrg,
    setActiveProject,
  } = useRBAC();

  // Filter projects for the currently active org
  const orgProjects = projects.filter((p) => p.orgId === activeOrgId);

  if (organizations.length === 0) return null;

  return (
    <Box sx={{ px: 2, py: 1.5 }}>
      {/* Org Selector */}
      <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
        <InputLabel
          id="org-select-label"
          sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
        >
          <OrgIcon sx={{ fontSize: 16 }} /> Organization
        </InputLabel>
        <Select
          labelId="org-select-label"
          id="org-select"
          value={activeOrgId || ""}
          label="Organization"
          onChange={(e) => setActiveOrg(e.target.value)}
          sx={{
            borderRadius: 1,
            "& .MuiSelect-select": {
              py: 1,
              fontSize: "0.875rem",
              fontWeight: 500,
            },
          }}
        >
          {organizations.map((org) => (
            <MenuItem key={org.id} value={org.id}>
              <Typography variant="body2" fontWeight={500}>
                {org.name}
              </Typography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Project Selector */}
      {orgProjects.length > 0 && (
        <FormControl fullWidth size="small">
          <InputLabel
            id="project-select-label"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <ProjectIcon sx={{ fontSize: 16 }} /> Project
          </InputLabel>
          <Select
            labelId="project-select-label"
            id="project-select"
            value={activeProjectId || ""}
            label="Project"
            onChange={(e) => setActiveProject(e.target.value || undefined)}
            sx={{
              borderRadius: 1,
              "& .MuiSelect-select": {
                py: 1,
                fontSize: "0.875rem",
                fontWeight: 500,
              },
            }}
          >
            <MenuItem value="">
              <Typography variant="body2" color="text.secondary">
                All Projects
              </Typography>
            </MenuItem>
            {orgProjects.map((proj) => (
              <MenuItem key={proj.id} value={proj.id}>
                <Typography variant="body2" fontWeight={500}>
                  {proj.name}
                </Typography>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <Divider sx={{ mt: 2 }} />
    </Box>
  );
}
