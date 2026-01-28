import { TypographyVariantsOptions } from "@mui/material/styles";

export const typography: TypographyVariantsOptions = {
  fontFamily: [
    "Inter",
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    "Oxygen",
    "Ubuntu",
    "Cantarell",
    '"Fira Sans"',
    '"Droid Sans"',
    '"Helvetica Neue"',
    "sans-serif",
  ].join(","),
  h1: {
    fontSize: "2.5rem",
    fontWeight: 700,
    lineHeight: 1.2,
    color: "#172B4D",
  },
  h2: {
    fontSize: "2rem",
    fontWeight: 600,
    lineHeight: 1.3,
    color: "#172B4D",
  },
  h3: {
    fontSize: "1.75rem",
    fontWeight: 600,
    lineHeight: 1.3,
    color: "#172B4D",
  },
  h4: {
    fontSize: "1.5rem",
    fontWeight: 500,
    lineHeight: 1.4,
    color: "#172B4D",
  },
  h5: {
    fontSize: "1.25rem",
    fontWeight: 500,
    lineHeight: 1.4,
    color: "#172B4D",
  },
  h6: {
    fontSize: "1rem",
    fontWeight: 600,
    lineHeight: 1.4,
    color: "#172B4D",
  },
  body1: {
    fontSize: "0.95rem",
    lineHeight: 1.5,
    color: "#172B4D",
  },
  body2: {
    fontSize: "0.875rem",
    lineHeight: 1.5,
    color: "#5E6C84",
  },
  button: {
    textTransform: "none",
    fontWeight: 500,
  },
  subtitle1: {
    fontSize: "1rem",
    color: "#5E6C84",
  },
  subtitle2: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#5E6C84",
  },
};
