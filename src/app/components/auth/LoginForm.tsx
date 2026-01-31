"use client";

import { useLogin } from "@/hooks/useLogin";
import { Box, Button, TextField, Typography, Alert, Fade } from "@mui/material";

export default function LoginForm() {
  const {
    email,
    password,
    loading,
    error,
    setEmail: onEmailChange,
    setPassword: onPasswordChange,
    submit: onSubmit,
  } = useLogin();
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {error && (
        <Fade in={!!error}>
          <Alert
            severity="error"
            variant="filled"
            sx={{
              borderRadius: 2,
              fontWeight: 500,
              boxShadow: (theme) => theme.shadows[2],
            }}
          >
            {error}
          </Alert>
        </Fade>
      )}

      <Box>
        <Typography
          variant="subtitle2"
          fontWeight={600}
          mb={1}
          color="text.primary"
        >
          Email
        </Typography>
        <TextField
          placeholder="Enter your email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          fullWidth
          autoFocus
          variant="outlined"
          size="small"
          error={!!error}
          sx={{ borderRadius: 2 }}
        />
      </Box>

      <Box>
        <Typography
          variant="subtitle2"
          fontWeight={600}
          mb={1}
          color="text.primary"
        >
          Password
        </Typography>
        <TextField
          placeholder="Enter your password"
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && onSubmit()}
          fullWidth
          variant="outlined"
          size="small"
          error={!!error}
          sx={{ borderRadius: 2 }}
        />
      </Box>

      <Button
        variant="contained"
        size="large"
        disabled={loading}
        onClick={() => onSubmit()}
        sx={{
          borderRadius: 2,
          height: 48,
          fontSize: "1rem",
          fontWeight: 600,
          textTransform: "none",
        }}
      >
        {loading ? "Signing in…" : "Sign in"}
      </Button>
    </Box>
  );
}
