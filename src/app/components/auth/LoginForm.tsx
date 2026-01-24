"use client";

import { Box, Button, TextField, Typography } from "@mui/material";

interface Props {
  email: string;
  password: string;
  loading: boolean;
  error?: string;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onSubmit: () => void;
}

export default function LoginForm({
  email,
  password,
  loading,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: Props) {
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
        onClick={onSubmit}
      >
        {loading ? "Signing in…" : "Sign in"}
      </Button>
    </Box>
  );
}
