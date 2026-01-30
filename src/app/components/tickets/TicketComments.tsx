"use client";

import { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  Stack,
  Paper,
  CircularProgress,
  Chip,
} from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import { useTicketComments } from "@/hooks/tickets/useTicketComments";
import useUserDetails from "@/hooks/useUserDetails";

interface TicketCommentsProps {
  ticketId: string;
}

export default function TicketComments({ ticketId }: TicketCommentsProps) {
  const { comments, loading, submitting, addComment } =
    useTicketComments(ticketId);
  const [commentText, setCommentText] = useState("");
  const currentUser = useUserDetails();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new comments
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments]);

  const handleSubmit = async () => {
    if (!commentText.trim()) return;
    const success = await addComment(commentText);
    if (success) {
      setCommentText("");
    }
  };

  const getUserInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (
    role?: string,
  ):
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "success"
    | "info"
    | "warning" => {
    switch (role) {
      case "MANAGER":
        return "secondary";
      case "RESOLVER":
        return "success";
      case "ADMIN":
        return "error";
      default:
        return "primary"; // USER
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: 550,
      }}
    >
      {/* Comments List */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", mb: 3, px: 2 }}>
        {comments.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            py={8}
            color="text.secondary"
          >
            <Typography variant="body1">No comments yet</Typography>
            <Typography variant="caption">Start the conversation!</Typography>
          </Box>
        ) : (
          <Stack spacing={3}>
            {comments.map((comment) => (
              <Box key={comment.id} display="flex" gap={2} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor:
                      comment.user?.role === "MANAGER"
                        ? "secondary.main"
                        : comment.user?.role === "RESOLVER"
                          ? "success.main"
                          : "primary.main",
                    width: 40,
                    height: 40,
                    fontSize: "0.9rem",
                  }}
                >
                  {getUserInitials(comment.user?.name)}
                </Avatar>
                <Box flexGrow={1}>
                  <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {comment.user?.name || "Unknown User"}
                    </Typography>
                    <Chip
                      label={comment.user?.role || "USER"}
                      size="small"
                      color={getRoleColor(comment.user?.role)}
                      variant="outlined"
                      sx={{ height: 20, fontSize: "0.65rem" }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {new Date(comment.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(0,0,0,0.03)",
                      borderRadius: 2,
                      borderTopLeftRadius: 0,
                    }}
                  >
                    <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                      {comment.comment}
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            ))}
            <div ref={bottomRef} />
          </Stack>
        )}
      </Box>

      {/* Input Area */}
      <Paper elevation={3} sx={{ p: 2, borderRadius: 2, mt: "auto" }}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Avatar sx={{ width: 40, height: 40 }}>
            {getUserInitials(currentUser?.name)}
          </Avatar>
          <Box flexGrow={1}>
            <TextField
              fullWidth
              multiline
              minRows={1}
              maxRows={4}
              placeholder="Write a comment..."
              variant="outlined"
              size="small"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={submitting}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
            <Box display="flex" justifyContent="flex-end" mt={1}>
              <Button
                variant="contained"
                size="small"
                endIcon={
                  submitting ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <SendIcon />
                  )
                }
                onClick={handleSubmit}
                disabled={!commentText.trim() || submitting}
              >
                Post
              </Button>
            </Box>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
