"use client";

import { Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import VerifiedIcon from "@mui/icons-material/Verified";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import HandymanIcon from "@mui/icons-material/Handyman";
import PersonIcon from "@mui/icons-material/Person";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import SignalCellularAlt1BarIcon from "@mui/icons-material/SignalCellularAlt1Bar";
import SignalCellularAlt2BarIcon from "@mui/icons-material/SignalCellularAlt2Bar";
import WarningIcon from "@mui/icons-material/Warning";
import BugReportIcon from "@mui/icons-material/BugReport";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import HelpIcon from "@mui/icons-material/Help";
import ArticleIcon from "@mui/icons-material/Article";
import { useTheme } from "@mui/material/styles";

// ---------------------------
// STATUS CONFIG
// ---------------------------
const STATUS_CONFIG = {
  OPEN: {
    label: "Open",
    icon: <HourglassBottomIcon sx={{ fontSize: 16 }} />,
    light: {
      color: "#1976d2",
      bg: "rgba(25,118,210,0.08)",
      border: "rgba(25,118,210,0.18)",
    },
    dark: {
      color: "#42a5f5", // Blue 400
      bg: "rgba(66, 165, 245, 0.16)",
      border: "rgba(66, 165, 245, 0.3)",
    },
  },
  ASSIGNED: {
    label: "Assigned",
    icon: <PersonSearchIcon sx={{ fontSize: 16 }} />,
    light: {
      color: "#9c27b0",
      bg: "rgba(156,39,176,0.08)",
      border: "rgba(156,39,176,0.18)",
    },
    dark: {
      color: "#ab47bc", // Purple 400
      bg: "rgba(171, 71, 188, 0.16)",
      border: "rgba(171, 71, 188, 0.3)",
    },
  },
  RESOLVED: {
    label: "Resolved",
    icon: <TaskAltIcon sx={{ fontSize: 16 }} />,
    light: {
      color: "#2e7d32",
      bg: "rgba(46,125,50,0.08)",
      border: "rgba(46,125,50,0.18)",
    },
    dark: {
      color: "#66bb6a", // Green 400
      bg: "rgba(102, 187, 106, 0.16)",
      border: "rgba(102, 187, 106, 0.3)",
    },
  },
  VERIFIED: {
    label: "Verified",
    icon: <VerifiedIcon sx={{ fontSize: 16 }} />,
    light: {
      color: "#ed6c02",
      bg: "rgba(237,108,2,0.08)",
      border: "rgba(237,108,2,0.18)",
    },
    dark: {
      color: "#ffa726", // Orange 400
      bg: "rgba(255, 167, 38, 0.16)",
      border: "rgba(255, 167, 38, 0.3)",
    },
  },
  CLOSED: {
    label: "Closed",
    icon: <CheckCircleIcon sx={{ fontSize: 16 }} />,
    light: {
      color: "#616161",
      bg: "rgba(97,97,97,0.08)",
      border: "rgba(97,97,97,0.18)",
    },
    dark: {
      color: "#bdbdbd", // Grey 400
      bg: "rgba(189, 189, 189, 0.16)",
      border: "rgba(189, 189, 189, 0.3)",
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

// ---------------------------
// ROLE CONFIG
// ---------------------------
const ROLE_CONFIG = {
  ADMIN: {
    label: "Admin",
    icon: <AdminPanelSettingsIcon sx={{ fontSize: 16 }} />,
    light: {
      color: "#d32f2f",
      bg: "rgba(211,47,47,0.08)",
      border: "rgba(211,47,47,0.18)",
    },
    dark: {
      color: "#ef5350", // Red 400
      bg: "rgba(239, 83, 80, 0.16)",
      border: "rgba(239, 83, 80, 0.3)",
    },
  },
  MANAGER: {
    label: "Manager",
    icon: <ManageAccountsIcon sx={{ fontSize: 16 }} />,
    light: {
      color: "#0288d1",
      bg: "rgba(2,136,209,0.08)",
      border: "rgba(2,136,209,0.18)",
    },
    dark: {
      color: "#29b6f6", // Light Blue 400
      bg: "rgba(41, 182, 246, 0.16)",
      border: "rgba(41, 182, 246, 0.3)",
    },
  },
  RESOLVER: {
    label: "Resolver",
    icon: <HandymanIcon sx={{ fontSize: 16 }} />,
    light: {
      color: "#2e7d32",
      bg: "rgba(46,125,50,0.08)",
      border: "rgba(46,125,50,0.18)",
    },
    dark: {
      color: "#66bb6a", // Green 400
      bg: "rgba(102, 187, 106, 0.16)",
      border: "rgba(102, 187, 106, 0.3)",
    },
  },
  USER: {
    label: "User",
    icon: <PersonIcon sx={{ fontSize: 16 }} />,
    light: {
      color: "#6a1b9a",
      bg: "rgba(106,27,154,0.08)",
      border: "rgba(106,27,154,0.18)",
    },
    dark: {
      color: "#ab47bc", // Purple 400
      bg: "rgba(171, 71, 188, 0.16)",
      border: "rgba(171, 71, 188, 0.3)",
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

// ---------------------------
// PRIORITY CONFIG
// ---------------------------
const PRIORITY_CONFIG = {
  LOW: {
    label: "Low",
    icon: <SignalCellularAlt1BarIcon sx={{ fontSize: 16 }} />,
    light: {
      color: "#2e7d32",
      bg: "rgba(46,125,50,0.08)",
      border: "rgba(46,125,50,0.18)",
    },
    dark: {
      color: "#66bb6a",
      bg: "rgba(102, 187, 106, 0.16)",
      border: "rgba(102, 187, 106, 0.3)",
    },
  },
  MEDIUM: {
    label: "Medium",
    icon: <SignalCellularAlt2BarIcon sx={{ fontSize: 16 }} />,
    light: {
      color: "#ed6c02",
      bg: "rgba(237,108,2,0.08)",
      border: "rgba(237,108,2,0.18)",
    },
    dark: {
      color: "#ffa726",
      bg: "rgba(255, 167, 38, 0.16)",
      border: "rgba(255, 167, 38, 0.3)",
    },
  },
  HIGH: {
    label: "High",
    icon: <SignalCellularAltIcon sx={{ fontSize: 16 }} />,
    light: {
      color: "#d32f2f",
      bg: "rgba(211,47,47,0.08)",
      border: "rgba(211,47,47,0.18)",
    },
    dark: {
      color: "#ef5350",
      bg: "rgba(239, 83, 80, 0.16)",
      border: "rgba(239, 83, 80, 0.3)",
    },
  },
  CRITICAL: {
    label: "Critical",
    icon: <WarningIcon sx={{ fontSize: 16 }} />,
    light: {
      color: "#c62828",
      bg: "rgba(198,40,40,0.15)",
      border: "rgba(198,40,40,0.3)",
    },
    dark: {
      color: "#ff5252",
      bg: "rgba(255, 82, 82, 0.2)",
      border: "rgba(255, 82, 82, 0.4)",
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

// ---------------------------
// TICKET TYPE CONFIG
// ---------------------------
const TICKET_TYPE_CONFIG = {
  BUG: {
    label: "Bug",
    icon: <BugReportIcon sx={{ fontSize: 16 }} />,
    light: {
      color: "#d32f2f",
      bg: "rgba(211,47,47,0.08)",
      border: "rgba(211,47,47,0.18)",
    },
    dark: {
      color: "#ef5350",
      bg: "rgba(239, 83, 80, 0.16)",
      border: "rgba(239, 83, 80, 0.3)",
    },
  },
  FEATURE: {
    label: "Feature",
    icon: <LightbulbIcon sx={{ fontSize: 16 }} />,
    light: {
      color: "#ed6c02",
      bg: "rgba(237,108,2,0.08)",
      border: "rgba(237,108,2,0.18)",
    },
    dark: {
      color: "#ffa726",
      bg: "rgba(255, 167, 38, 0.16)",
      border: "rgba(255, 167, 38, 0.3)",
    },
  },
  SUPPORT: {
    label: "Support",
    icon: <HelpIcon sx={{ fontSize: 16 }} />,
    light: {
      color: "#0288d1",
      bg: "rgba(2,136,209,0.08)",
      border: "rgba(2,136,209,0.18)",
    },
    dark: {
      color: "#29b6f6",
      bg: "rgba(41, 182, 246, 0.16)",
      border: "rgba(41, 182, 246, 0.3)",
    },
  },
  GENERAL: {
    label: "General",
    icon: <ArticleIcon sx={{ fontSize: 16 }} />,
    light: {
      color: "#616161",
      bg: "rgba(97,97,97,0.08)",
      border: "rgba(97,97,97,0.18)",
    },
    dark: {
      color: "#bdbdbd",
      bg: "rgba(189, 189, 189, 0.16)",
      border: "rgba(189, 189, 189, 0.3)",
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

// ---------------------------
// UNIVERSAL CHIP COMPONENT
// ---------------------------
export default function LabelChip({
  type,
  value,
}: {
  type: "status" | "role" | "priority" | "ticketType";
  value: string;
}) {
  const theme = useTheme();
  const mode = theme.palette.mode;

  let config;
  if (type === "status") config = STATUS_CONFIG[value];
  else if (type === "role") config = ROLE_CONFIG[value];
  else if (type === "priority") config = PRIORITY_CONFIG[value];
  else if (type === "ticketType") config = TICKET_TYPE_CONFIG[value];

  const fallback = {
    label: value,
    icon: <FiberManualRecordIcon sx={{ fontSize: 12 }} />,
    color: mode === "dark" ? "#bdbdbd" : "#616161",
    bg: mode === "dark" ? "rgba(189,189,189,0.16)" : "rgba(97,97,97,0.08)",
    border: mode === "dark" ? "rgba(189,189,189,0.3)" : "rgba(97,97,97,0.18)",
  };

  const style = config
    ? {
        label: config.label,
        icon: config.icon,
        ...config[mode],
      }
    : fallback;

  return (
    <Chip
      label={style.label}
      icon={style.icon}
      size="small"
      sx={{
        fontWeight: 600,
        borderRadius: "8px",
        color: style.color,
        backgroundColor: style.bg,
        border: `1px solid ${style.border}`,
        letterSpacing: "0.3px",
        paddingX: "6px",
        ".MuiChip-icon": {
          color: style.color,
        },
      }}
    />
  );
}
