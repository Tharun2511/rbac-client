import { createTheme } from "@mui/material/styles";
import { getPalette } from "./palette";
import { typography } from "./typography";

export const createAppTheme = (mode: "light" | "dark") => {
  return createTheme({
    palette: getPalette(mode),
    typography,
    shape: {
      borderRadius: 6,
    },
    shadows: [
      "none",
      mode === "light"
        ? "0px 1px 2px 0px rgba(9, 30, 66, 0.25), 0px 0px 1px 0px rgba(9, 30, 66, 0.31)"
        : "0px 1px 2px 0px rgba(0, 0, 0, 0.5), 0px 0px 1px 0px rgba(0, 0, 0, 0.6)", // Darker shadow for dark mode
      "0px 3px 6px 0px rgba(9, 30, 66, 0.25)",
      "0px 8px 16px -4px rgba(9, 30, 66, 0.25)",
      ...Array(21).fill("none"),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ] as any,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
          },
          containedPrimary: {
            "&:hover": {
              backgroundColor: mode === "light" ? "#0065FF" : "#2684FF",
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
                ? "0px 1px 2px 0px rgba(9, 30, 66, 0.25), 0px 0px 1px 0px rgba(9, 30, 66, 0.31)"
                : "0px 1px 2px 0px rgba(0, 0, 0, 0.5), 0px 0px 1px 0px rgba(0, 0, 0, 0.6)",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "light" ? "#FFFFFF" : "#1D2125",
            color: mode === "light" ? "#172B4D" : "#B6C2CF",
            boxShadow: "none",
            borderBottom: `1px solid ${mode === "light" ? "#EBECF0" : "#2C333A"}`,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow:
              mode === "light"
                ? "0px 1px 2px 0px rgba(9, 30, 66, 0.25), 0px 0px 1px 0px rgba(9, 30, 66, 0.31)"
                : "0px 1px 2px 0px rgba(0, 0, 0, 0.5), 0px 0px 1px 0px rgba(0, 0, 0, 0.6)",
            borderRadius: 4,
          },
        },
      },
      // Ensure specific overrides for dark mode text readability
      MuiTypography: {
        styleOverrides: {
          root: {
            color: mode === "light" ? "inherit" : undefined, // Let palette handle it mostly, but specific overrides if needed
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === "light" ? "#F4F5F7" : "#161A1D",
            borderRight: `1px solid ${mode === "light" ? "#EBECF0" : "#2C333A"}`,
          },
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          root: {
            color: mode === "light" ? "#5E6C84" : "#8C9BAB",
            "&.Mui-focused": {
              color: mode === "light" ? "#0052CC" : "#4C9AFF",
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: mode === "light" ? "#5E6C84" : "#8C9BAB",
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            color: mode === "light" ? "#172B4D" : "#B6C2CF", // Input text color
          },
          notchedOutline: {
            borderColor: mode === "light" ? "#DFE1E6" : "#454F59",
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            color: mode === "light" ? "#172B4D" : "#B6C2CF",
            "&:hover": {
              backgroundColor:
                mode === "light" ? "#F4F5F7" : "rgba(255,255,255,0.08)",
            },
            "&.Mui-selected": {
              backgroundColor:
                mode === "light" ? "#E6EFFC" : "rgba(76, 154, 255, 0.15)",
              color: mode === "light" ? "#0052CC" : "#4C9AFF",
              "&:hover": {
                backgroundColor:
                  mode === "light" ? "#E6EFFC" : "rgba(76, 154, 255, 0.25)",
              },
            },
          },
        },
      },
    },
    spacing: 8,
  });
};
