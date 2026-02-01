"use client";

import { Box, Typography, Breadcrumbs, Link } from "@mui/material";
import { NavigateNext } from "@mui/icons-material";

interface Props {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

const PageHeader = ({ title, description, actions }: Props) => {
  return (
    <Box mb={4}>
      <Breadcrumbs
        separator={<NavigateNext fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ mb: 1, color: "text.secondary" }}
      >
        <Link underline="hover" color="inherit" href="/" fontSize="0.875rem">
          Home
        </Link>
        <Typography color="text.primary" fontSize="0.875rem">
          {title}
        </Typography>
      </Breadcrumbs>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="space-between"
      >
        <Typography
          variant="h4"
          component="h1"
          fontWeight={700}
          color="primary.main"
        >
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
        {actions && <Box>{actions}</Box>}
      </Box>
    </Box>
  );
};

export default PageHeader;
