"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { createAppTheme } from "@/theme";
import { useState, useMemo } from "react";
import { ColorModeContext } from "@/theme/ColorModeContext";
import Cookies from "js-cookie";

export default function Providers({
  children,
  initialMode = "light",
}: {
  children: React.ReactNode;
  initialMode?: "light" | "dark";
}) {
  const [mode, setMode] = useState<"light" | "dark">(initialMode);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === "light" ? "dark" : "light";
          Cookies.set("themeMode", newMode, { expires: 365 }); // Set cookie for 1 year
          return newMode;
        });
      },
      mode,
    }),
    [mode],
  );

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
