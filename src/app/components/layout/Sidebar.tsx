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
  CheckCircle as VerifyIcon,
  History as HistoryIcon,
  ListAlt as AllTicketsIcon,
  AssignmentInd as AssignedIcon,
  FactCheck as ClosureIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useUserDetails from "@/hooks/useUserDetails";

const drawerWidth = 260;

// Define the menu structure with role-based access
const MENU_GROUPS = [
  {
    title: "Overview",
    items: [
      {
        text: "Dashboard",
        icon: <DashboardIcon />,
        path: "/admin",
        roles: ["ADMIN"],
      },
      {
        text: "Dashboard",
        icon: <DashboardIcon />,
        path: "/manager",
        roles: ["MANAGER"],
      },
      {
        text: "Dashboard",
        icon: <DashboardIcon />,
        path: "/resolver",
        roles: ["RESOLVER"],
      },
      {
        text: "Dashboard",
        icon: <DashboardIcon />,
        path: "/user",
        roles: ["USER"],
      },
    ],
  },
  {
    title: "Actions",
    items: [
      // Admin Actions
      {
        text: "Add User",
        icon: <PersonAddIcon />,
        path: "/admin/users/create",
        roles: ["ADMIN"],
      },
      {
        text: "Manage Users",
        icon: <PeopleIcon />,
        path: "/admin/users",
        roles: ["ADMIN"],
      },

      // User Actions
      {
        text: "Create Ticket",
        icon: <AddIcon />,
        path: "/tickets/create",
        roles: ["USER"],
      },
      {
        text: "Verify Tickets",
        icon: <VerifyIcon />,
        path: "/tickets/verify",
        roles: ["USER"],
      },
      {
        text: "My Tickets",
        icon: <HistoryIcon />,
        path: "/tickets/history",
        roles: ["USER"],
      },

      // Manager Actions
      {
        text: "All Tickets",
        icon: <AllTicketsIcon />,
        path: "/manager/tickets",
        roles: ["MANAGER"],
      },
      {
        text: "Assigned Tickets",
        icon: <AssignedIcon />,
        path: "/manager/tickets?filter=assigned",
        roles: ["MANAGER"],
      },
      {
        text: "Pending Closure",
        icon: <ClosureIcon />,
        path: "/manager/tickets?filter=ready-to-close",
        roles: ["MANAGER"],
      },

      // Resolver Actions
      {
        text: "My Assigned Tickets",
        icon: <AssignedIcon />,
        path: "/resolver/tickets",
        roles: ["RESOLVER"],
      },
    ],
  },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const user = useUserDetails();

  if (!user) return null; // Or a loading skeleton

  const userRole = user.role;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          // Background and border handled by theme/index.ts now
        },
      }}
    >
      <Toolbar>
        <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
          RBAC Platform
        </Typography>
      </Toolbar>

      <Box sx={{ overflow: "auto", mt: 2 }}>
        {MENU_GROUPS.map((group, groupIndex) => {
          // Filter items based on role
          const visibleItems = group.items.filter((item) =>
            item.roles.includes(userRole),
          );

          if (visibleItems.length === 0) return null;

          return (
            <Box key={group.title}>
              {groupIndex > 0 && <Divider sx={{ my: 1, mx: 2 }} />}

              <List>
                {visibleItems.map((item) => {
                  // Check active state
                  let isActive = pathname === item.path;

                  // Handle paths with query params
                  if (item.path.includes("?")) {
                    const [path, query] = item.path.split("?");
                    const itemParams = new URLSearchParams(query);
                    // Check if base path matches AND current search params contain the item's params
                    if (pathname === path) {
                      isActive = true;
                      itemParams.forEach((value, key) => {
                        if (searchParams.get(key) !== value) isActive = false;
                      });
                    } else {
                      isActive = false;
                    }
                  }

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
                                ? "rgba(76, 154, 255, 0.15)"
                                : "#E6EFFC",
                            color: "primary.main",
                            "&:hover": {
                              backgroundColor: (theme) =>
                                theme.palette.mode === "dark"
                                  ? "rgba(76, 154, 255, 0.25)"
                                  : "#E6EFFC",
                            },
                            "& .MuiListItemIcon-root": {
                              color: "primary.main",
                            },
                          },
                          "&:hover": {
                            backgroundColor: (theme) =>
                              theme.palette.mode === "dark"
                                ? "rgba(255, 255, 255, 0.05)"
                                : "rgba(9, 30, 66, 0.08)",
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
