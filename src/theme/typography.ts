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
    fontWeight: 800,
    lineHeight: 1.2,
    letterSpacing: "-0.02em",
  },
  h2: {
    fontSize: "2rem",
    fontWeight: 700,
    lineHeight: 1.25,
    letterSpacing: "-0.01em",
  },
  h3: {
    fontSize: "1.75rem",
    fontWeight: 700,
    lineHeight: 1.3,
    letterSpacing: "-0.01em",
  },
  h4: {
    fontSize: "1.5rem",
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h5: {
    fontSize: "1.25rem",
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h6: {
    fontSize: "1rem",
    fontWeight: 600,
    lineHeight: 1.4,
  },
  body1: {
    fontSize: "0.95rem",
    lineHeight: 1.6,
  },
  body2: {
    fontSize: "0.875rem",
    lineHeight: 1.5,
  },
  button: {
    textTransform: "none",
    fontWeight: 600,
    letterSpacing: "0.01em",
  },
  subtitle1: {
    fontSize: "1rem",
    fontWeight: 500,
  },
  subtitle2: {
    fontSize: "0.875rem",
    fontWeight: 600,
    letterSpacing: "0.02em",
  },
};
