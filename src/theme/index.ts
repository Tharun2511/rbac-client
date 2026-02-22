import { createTheme } from "@mui/material/styles";
import { getPalette } from "./palette";
import { typography } from "./typography";

export const createAppTheme = (mode: "light" | "dark") => {
  return createTheme({
    palette: getPalette(mode),
    typography,
    shape: {
      borderRadius: 12, // Increased for a softer, premium look
    },
    shadows: [
      "none",
      mode === "light"
        ? "0px 1px 3px rgba(15, 23, 42, 0.08)" // subtle elevation
        : "0px 1px 3px rgba(0, 0, 0, 0.5)",
      "0px 4px 6px -1px rgba(15, 23, 42, 0.1), 0px 2px 4px -1px rgba(15, 23, 42, 0.06)",
      "0px 10px 15px -3px rgba(15, 23, 42, 0.1), 0px 4px 6px -2px rgba(15, 23, 42, 0.05)",
      ...Array(21).fill("none"),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ] as any,
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            // Premium scrollbar styling
            "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
              width: "8px",
              height: "8px",
            },
            "&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
              backgroundColor: mode === "light" ? "#CBD5E1" : "#334155",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
              {
                backgroundColor: mode === "light" ? "#94A3B8" : "#475569",
              },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8, // slightly tighter than standard paper
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "none",
            transition: "all 0.2s ease-in-out", // smooth transition
            "&:active": {
              transform: "scale(0.98)", // micro-interaction on click
            },
            "&:hover": {
              boxShadow: "none",
            },
          },
          containedPrimary: {
            "&:hover": {
              boxShadow:
                mode === "light"
                  ? "0 4px 14px 0 rgba(37,99,235,0.39)"
                  : "0 4px 14px 0 rgba(59,130,246,0.39)",
              transform: "translateY(-1px)",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
          elevation1: {
            boxShadow:
              mode === "light"
                ? "0px 1px 3px rgba(15, 23, 42, 0.08)"
                : "0px 1px 3px rgba(0, 0, 0, 0.5)",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            // Glassmorphism effect
            backgroundColor:
              mode === "light"
                ? "rgba(255, 255, 255, 0.85)"
                : "rgba(10, 10, 10, 0.85)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)", // for Safari support
            color: mode === "light" ? "#0F172A" : "#F8FAFC",
            boxShadow: "none",
            borderBottom: `1px solid ${mode === "light" ? "rgba(226, 232, 240, 0.8)" : "rgba(38, 38, 38, 0.8)"}`,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow:
              mode === "light"
                ? "0px 1px 3px rgba(15, 23, 42, 0.08)"
                : "0px 1px 3px rgba(0, 0, 0, 0.5)",
            borderRadius: 12,
            border: `1px solid ${mode === "light" ? "#F1F5F9" : "#1A1B1E"}`, // Subtle border to enhance depth
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === "light" ? "#FAFAFA" : "#0A0A0A", // Match updated darkPalette
            borderRight: `1px solid ${mode === "light" ? "#E2E8F0" : "#262626"}`,
          },
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          root: {
            color: mode === "light" ? "#64748B" : "#94A3B8",
            "&.Mui-focused": {
              color: mode === "light" ? "#2563EB" : "#3B82F6",
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: mode === "light" ? "#64748B" : "#94A3B8",
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            color: mode === "light" ? "#0F172A" : "#F8FAFC", // Input text color
            borderRadius: 8,
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderWidth: "1px", // Keep it crisp
              boxShadow:
                mode === "light"
                  ? "0 0 0 3px rgba(37,99,235,0.1)"
                  : "0 0 0 3px rgba(59,130,246,0.15)",
            },
          },
          notchedOutline: {
            borderColor: mode === "light" ? "#CBD5E1" : "#334155",
            transition: "border-color 0.2s ease-in-out",
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            color: mode === "light" ? "#0F172A" : "#F8FAFC",
            borderRadius: 6,
            margin: "0 8px", // add slight margin for a floating effect within menus
            "&:hover": {
              backgroundColor:
                mode === "light" ? "#F1F5F9" : "rgba(255,255,255,0.05)",
            },
            "&.Mui-selected": {
              backgroundColor:
                mode === "light" ? "#EFF6FF" : "rgba(59, 130, 246, 0.15)",
              color: mode === "light" ? "#2563EB" : "#60A5FA",
              "&:hover": {
                backgroundColor:
                  mode === "light" ? "#DBEAFE" : "rgba(59, 130, 246, 0.25)",
              },
            },
          },
        },
      },
    },
    spacing: 8,
  });
};
