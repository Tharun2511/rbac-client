"use client";

import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Add as AddIcon,
  History as HistoryIcon,
  ListAlt as AllTicketsIcon,
  Business as OrgIcon,
  FolderOpen as ProjectIcon,
} from "@mui/icons-material";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useRBAC } from "@/context/RBACContext";
import SentinelLogo from "../branding/SentinelLogo";
import ContextSwitcher from "./ContextSwitcher";

const drawerWidth = 260;

interface NavItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  /** If set, item is shown only when `can(permission)` returns true */
  permission?: string;
  /** If true, item is always shown (e.g., Dashboard) */
  always?: boolean;
  /** If true, only system admins see this */
  systemAdminOnly?: boolean;
  /** If true, item is only shown when a project is selected */
  requireProject?: boolean;
}

const MENU_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: "Overview",
    items: [
      {
        text: "Dashboard",
        icon: <DashboardIcon />,
        path: "/dashboard",
        always: true,
      },
    ],
  },
  {
    title: "Tickets",
    items: [
      {
        text: "Create Ticket",
        icon: <AddIcon />,
        path: "/tickets/create",
        permission: "ticket.create",
        requireProject: true,
      },
      {
        text: "My Tickets",
        icon: <HistoryIcon />,
        path: "/tickets/history",
        permission: "ticket.create",
        requireProject: true,
      },
      {
        text: "All Tickets",
        icon: <AllTicketsIcon />,
        path: "/tickets",
        permission: "ticket.view",
        requireProject: true,
      },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        text: "Users",
        icon: <PeopleIcon />,
        path: "/admin/users",
        permission: "system.manage_users",
      },
      {
        text: "Organizations",
        icon: <OrgIcon />,
        path: "/organizations",
        permission: "system.manage_tenants",
      },
      {
        text: "Projects",
        icon: <ProjectIcon />,
        path: "/projects",
        permission: "project.create",
      },
    ],
  },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { can, isSystemAdmin, activeProjectId } = useRBAC();

  if (!user) return null;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar sx={{ px: 2, gap: 1.5, minHeight: 70 }}>
        <SentinelLogo size={36} />
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "linear-gradient(45deg, #60A5FA 30%, #3B82F6 90%)"
                : "linear-gradient(45deg, #2563EB 30%, #1D4ED8 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.5px",
            fontSize: "1.5rem",
          }}
        >
          Sentinel
        </Typography>
      </Toolbar>

      {/* Context Switcher */}
      <ContextSwitcher />

      <Box sx={{ overflow: "auto", mt: 1 }}>
        {MENU_GROUPS.map((group, groupIndex) => {
          // Filter items based on permissions
          const visibleItems = group.items.filter((item) => {
            if (item.always) return true;
            if (item.systemAdminOnly) return isSystemAdmin;
            if (item.requireProject && !activeProjectId) return false;
            if (item.permission) return can(item.permission);
            return false;
          });

          if (visibleItems.length === 0) return null;

          return (
            <Box key={group.title}>
              {groupIndex > 0 && <Divider sx={{ my: 1, mx: 2 }} />}

              <Typography
                variant="overline"
                sx={{
                  px: 2,
                  py: 0.5,
                  display: "block",
                  color: "text.secondary",
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  letterSpacing: "0.08em",
                }}
              >
                {group.title}
              </Typography>

              <List disablePadding>
                {visibleItems.map((item) => {
                  const isActive =
                    pathname === item.path ||
                    (item.path !== "/dashboard" &&
                      pathname.startsWith(item.path + "/"));

                  return (
                    <ListItem key={item.text} disablePadding>
                      <ListItemButton
                        onClick={() => router.push(item.path)}
                        selected={isActive}
                        sx={{
                          my: 0.5,
                          mx: 1,
                          borderRadius: 1,
                          "&.Mui-selected": {
                            backgroundColor: (theme) =>
                              theme.palette.mode === "dark"
                                ? "rgba(59, 130, 246, 0.15)" // Blue 500 alpha
                                : "#EFF6FF", // Blue 50
                            color: "primary.main",
                            "&:hover": {
                              backgroundColor: (theme) =>
                                theme.palette.mode === "dark"
                                  ? "rgba(59, 130, 246, 0.25)"
                                  : "#DBEAFE", // Blue 100
                            },
                            "& .MuiListItemIcon-root": {
                              color: "primary.main",
                            },
                          },
                          "&:hover": {
                            backgroundColor: (theme) =>
                              theme.palette.mode === "dark"
                                ? "rgba(255, 255, 255, 0.05)"
                                : "rgba(15, 23, 42, 0.04)", // Slate 900 alpha
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 40,
                            color: isActive ? "primary.main" : "text.secondary",
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.text}
                          primaryTypographyProps={{
                            fontWeight: isActive ? 600 : 500,
                            fontSize: "0.95rem",
                            color: isActive ? "primary.main" : "text.primary",
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          );
        })}
      </Box>
    </Drawer>
  );
}
