"use client";

import { Logout, DarkMode, LightMode } from "@mui/icons-material";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Avatar,
  Stack,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
  Divider,
  Tooltip,
  Chip,
} from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import { useRBAC } from "@/context/RBACContext";
import { useState, MouseEvent } from "react";
import { useColorMode } from "@/theme/ColorModeContext";

export default function TopBar() {
  const { user, logout } = useAuth();
  const { organizations, activeOrgId, isSystemAdmin } = useRBAC();
  const { mode, toggleColorMode } = useColorMode();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  const getInitials = (name: string) => {
    if (!name) return "";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    if (parts.length >= 2)
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    return "";
  };

  const activeOrg = organizations.find((o) => o.id === activeOrgId);

  return (
    <AppBar
      position="sticky"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ minHeight: "64px" }}>
        {/* Active Org Badge */}
        {activeOrg && (
          <Chip
            label={activeOrg.name}
            size="small"
            sx={{
              fontWeight: 600,
              fontSize: "0.75rem",
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(76, 154, 255, 0.15)"
                  : "#E6EFFC",
              color: "primary.main",
              border: "none",
            }}
          />
        )}

        {isSystemAdmin && (
          <Chip
            label="System Admin"
            size="small"
            sx={{
              ml: 1,
              fontWeight: 600,
              fontSize: "0.7rem",
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255, 171, 0, 0.15)"
                  : "#FFF3E0",
              color: "#E65100",
            }}
          />
        )}

        <Box flexGrow={1} />

        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip
            title={
              mode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
            }
          >
            <IconButton onClick={toggleColorMode} color="inherit">
              {mode === "dark" ? (
                <LightMode />
              ) : (
                <DarkMode sx={{ color: "#5E6C84" }} />
              )}
            </IconButton>
          </Tooltip>

          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar
              sx={{
                bgcolor: "#0052CC",
                width: 32,
                height: 32,
                fontSize: "0.875rem",
              }}
            >
              {user ? getInitials(user.name) : ""}
            </Avatar>
          </IconButton>
        </Stack>
        <Menu
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
        >
          <Box px={2} py={1}>
            <Typography variant="subtitle1" fontWeight={600} noWrap>
              {user?.name || "User"}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {user?.email}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
            <ListItemIcon>
              <Logout fontSize="small" sx={{ color: "error.main" }} />
            </ListItemIcon>
            Sign out
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
