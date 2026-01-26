"use client";

import { useLogin } from "@/hooks/useLogin";
import { Box, Button, TextField, Typography } from "@mui/material";

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
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="h5" fontWeight={600}>
        Sign in
      </Typography>

      <Typography variant="body2" color="text.secondary">
        Use your work account to continue
      </Typography>

      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}

      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        fullWidth
        autoFocus
      />

      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && onSubmit()}
        fullWidth
      />

      <Button
        variant="contained"
        size="large"
        disabled={loading}
        onClick={() => onSubmit()}
      >
        {loading ? "Signing in…" : "Sign in"}
      </Button>
    </Box>
  );
}
