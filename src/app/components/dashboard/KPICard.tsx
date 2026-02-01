import {
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  alpha,
  useTheme,
} from "@mui/material";
import { ReactNode } from "react";

interface KPICardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

export default function KPICard({
  title,
  value,
  icon,
  trend,
  color = "primary.main",
}: KPICardProps) {
  const theme = useTheme();

  const resolvedColor =
    color === "primary.main" ? theme.palette.primary.main : color;

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 3,
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.1)",
        },
      }}
    >
      <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box
            sx={{
              p: 1.5,
              borderRadius: "12px",
              bgcolor: alpha(resolvedColor, 0.1),
              color: resolvedColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
          {trend && (
            <Paper
              elevation={0}
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: "20px",
                bgcolor: trend.isPositive ? "success.light" : "error.light",
                color: trend.isPositive ? "success.dark" : "error.dark",
                background: trend.isPositive
                  ? "rgba(34, 197, 94, 0.1)"
                  : "rgba(239, 68, 68, 0.1)",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <Typography variant="caption" fontWeight="600">
                {trend.isPositive ? "+" : "-"}
                {trend.value}%
              </Typography>
            </Paper>
          )}
        </Box>

        <Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 0.5, fontWeight: 500 }}
          >
            {title}
          </Typography>
          <Typography
            variant="h4"
            fontWeight="700"
            sx={{ color: "text.primary" }}
          >
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
