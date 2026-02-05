"use client";

import { useLogin } from "@/hooks/useLogin";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Fade,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () =>
    setShowPassword((show: boolean) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

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
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && onSubmit()}
          fullWidth
          variant="outlined"
          size="small"
          error={!!error}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? (
                    <VisibilityOff fontSize="small" />
                  ) : (
                    <Visibility fontSize="small" />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
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
