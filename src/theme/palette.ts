import { PaletteOptions } from "@mui/material/styles";

const lightPalette: PaletteOptions = {
  mode: "light",
  primary: {
    main: "#0052CC", // Jira Blue
    light: "#4C9AFF",
    dark: "#0747A6",
    contrastText: "#FFFFFF",
  },
  secondary: {
    main: "#00B8D9", // Cyan/Teal
    light: "#B3F5FF",
    dark: "#008DA6",
    contrastText: "#FFFFFF",
  },
  error: {
    main: "#DE350B", // Red
    light: "#FFBDAD",
    dark: "#BF2600",
  },
  warning: {
    main: "#FF991F", // Orange
    light: "#FFC400",
    dark: "#FF7452",
  },
  success: {
    main: "#00875A", // Green
    light: "#36B37E",
    dark: "#006644",
  },
  info: {
    main: "#42526E", // Neutral Blue-Gray
    light: "#5E6C84",
    dark: "#172B4D",
  },
  text: {
    primary: "#172B4D", // Dark Gray/Navy
    secondary: "#5E6C84", // Muted Gray
    disabled: "#A5ADBA",
  },
  background: {
    default: "#F4F5F7", // Light Gray background
    paper: "#FFFFFF",
  },
  divider: "#EBECF0",
};

const darkPalette: PaletteOptions = {
  mode: "dark",
  primary: {
    main: "#4C9AFF", // Lighter Blue for Dark Mode
    light: "#B3D4FF",
    dark: "#0052CC",
    contrastText: "#1D2125",
  },
  secondary: {
    main: "#00B8D9",
    light: "#B3F5FF",
    dark: "#008DA6",
    contrastText: "#1D2125",
  },
  error: {
    main: "#FF5630", // Brighter Red
    light: "#FF8F73",
    dark: "#DE350B",
  },
  warning: {
    main: "#FFAB00", // Brighter Orange
    light: "#FFE380",
    dark: "#FF991F",
  },
  success: {
    main: "#36B37E", // Brighter Green
    light: "#79F2C0",
    dark: "#006644",
  },
  info: {
    main: "#8993A4", // Lighter Gray
    light: "#C1C7D0",
    dark: "#42526E",
  },
  text: {
    primary: "#B6C2CF", // Light Gray for text
    secondary: "#8C9BAB", // Muted Gray
    disabled: "#596773",
  },
  background: {
    default: "#161A1D", // Dark Blue-Gray background (Jira Dark)
    paper: "#1D2125", // Slightly lighter for cards
  },
  divider: "#2C333A", // Dark Divider
};

export const getPalette = (mode: "light" | "dark"): PaletteOptions => {
  return mode === "dark" ? darkPalette : lightPalette;
};
