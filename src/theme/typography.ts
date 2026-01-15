import { TypographyVariantsOptions } from "@mui/material/styles";


export const typography: TypographyVariantsOptions = {
  fontFamily: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    'Arial',
    'sans-serif',
  ].join(','),

  h1: {
    fontSize: '2rem',
    fontWeight: 600,
  },

  h2: {
    fontSize: '1.5rem',
    fontWeight: 600,
  },

  body1: {
    fontSize: '0.95rem',
  },

  body2: {
    fontSize: '0.875rem',
  },
};
