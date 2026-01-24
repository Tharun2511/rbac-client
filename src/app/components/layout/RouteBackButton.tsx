"use client";

import { ArrowBack } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function RouteBack() {
  const router = useRouter();
  return (
    <Button
      variant="contained"
      onClick={() => router.back()}
      startIcon={<ArrowBack />}
      color="error"
      sx={{ mb: 2 }}
    >
      Back
    </Button>
  );
}
