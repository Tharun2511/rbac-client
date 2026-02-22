import { PaletteOptions } from "@mui/material/styles";

const lightPalette: PaletteOptions = {
  mode: "light",
  primary: {
    main: "#2563EB", // Vibrant Blue
    light: "#60A5FA",
    dark: "#1D4ED8",
    contrastText: "#FFFFFF",
  },
  secondary: {
    main: "#0EA5E9", // Sky Blue
    light: "#38BDF8",
    dark: "#0369A1",
    contrastText: "#FFFFFF",
  },
  error: {
    main: "#EF4444",
    light: "#F87171",
    dark: "#B91C1C",
  },
  warning: {
    main: "#F59E0B",
    light: "#FCD34D",
    dark: "#B45309",
  },
  success: {
    main: "#10B981",
    light: "#34D399",
    dark: "#047857",
  },
  info: {
    main: "#64748B",
    light: "#94A3B8",
    dark: "#334155",
  },
  text: {
    primary: "#0F172A", // Slate 900
    secondary: "#475569", // Slate 600
    disabled: "#94A3B8",
  },
  background: {
    default: "#FAFAFA", // Very subtle off-white
    paper: "#FFFFFF",
  },
  divider: "#E2E8F0", // Slate 200
};

const darkPalette: PaletteOptions = {
  mode: "dark",
  primary: {
    main: "#3B82F6", // Blue 500
    light: "#60A5FA",
    dark: "#2563EB",
    contrastText: "#FFFFFF",
  },
  secondary: {
    main: "#0EA5E9",
    light: "#38BDF8",
    dark: "#0284C7",
    contrastText: "#FFFFFF",
  },
  error: {
    main: "#F87171",
    light: "#FCA5A5",
    dark: "#DC2626",
  },
  warning: {
    main: "#FBBF24",
    light: "#FDE047",
    dark: "#D97706",
  },
  success: {
    main: "#34D399",
    light: "#6EE7B7",
    dark: "#059669",
  },
  info: {
    main: "#94A3B8",
    light: "#CBD5E1",
    dark: "#475569",
  },
  text: {
    primary: "#F8FAFC", // Slate 50
    secondary: "#94A3B8", // Slate 400
    disabled: "#475569",
  },
  background: {
    default: "#090A0B", // Deep OLED Black/Gray
    paper: "#141517", // Slightly lighter for surfaces
  },
  divider: "#262626", // Neutral 800
};

export const getPalette = (mode: "light" | "dark"): PaletteOptions => {
  return mode === "dark" ? darkPalette : lightPalette;
};
