import { Box, BoxProps, useTheme } from "@mui/material";

interface SentinelLogoProps extends BoxProps {
  size?: number;
  color?: string;
  gradient?: boolean;
}

export default function SentinelLogo({
  size = 32,
  color,
  gradient = true,
  ...props
}: SentinelLogoProps) {
  const theme = useTheme();
  const primaryColor = color || theme.palette.primary.main;
  const secondaryColor = theme.palette.primary.dark;

  return (
    <Box
      component="svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient
          id="sentinel_shield_gradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor={primaryColor} stopOpacity={1} />
          <stop offset="100%" stopColor={secondaryColor} stopOpacity={1} />
        </linearGradient>
      </defs>
      <path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        fill={gradient ? "url(#sentinel_shield_gradient)" : primaryColor}
        stroke="none"
      />
      <path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke="white"
        strokeOpacity="0.2"
        fill="none"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Box>
  );
}
