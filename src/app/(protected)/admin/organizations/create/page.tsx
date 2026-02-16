"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";
import PageHeader from "@/app/components/layout/PageHeader";
import { apiClient } from "@/lib/api";
import { useRBAC } from "@/context/RBACContext";

export default function CreateOrganizationPage() {
  const router = useRouter();
  const { refreshContexts } = useRBAC();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;

    setCreating(true);
    setError(null);

    try {
      await apiClient("/organizations", {
        auth: true,
        method: "POST",
        body: JSON.stringify({ name, slug, description }),
      });

      // Refresh contexts to include new org
      await refreshContexts();

      // Navigate back to organizations page
      router.push("/organizations");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create organization",
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <PageHeader
        title="Create Organization"
        subtitle="Add a new organization to the platform"
      />

      <Card>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleCreate}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {error && <Alert severity="error">{error}</Alert>}

              <TextField
                label="Organization Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  // Auto-generate slug
                  setSlug(
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/(^-|-$)/g, ""),
                  );
                }}
                required
                fullWidth
                autoFocus
                helperText="The full name of the organization"
              />

              <TextField
                label="Slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                fullWidth
                helperText="URL-friendly identifier (auto-generated, can be edited)"
              />

              <TextField
                label="Description (Optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={3}
                fullWidth
                helperText="Brief description of the organization"
              />

              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  onClick={() => router.back()}
                  disabled={creating}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={creating || !name || !slug}
                >
                  {creating ? "Creating..." : "Create Organization"}
                </Button>
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}
