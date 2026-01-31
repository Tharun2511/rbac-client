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
import {
  Send as SendIcon,
  TaskAlt as TaskAltIcon,
  FiberManualRecord as FiberManualRecordIcon,
  AssignmentInd as AssignmentIndIcon,
  CheckCircle as CheckCircleIcon,
  Lock as LockIcon,
  AddCircle as AddCircleIcon,
  History as HistoryIcon,
  LabelImportant as LabelImportantIcon,
} from "@mui/icons-material";
import { useTicketTimeline } from "@/hooks/tickets/useTicketTimeline";
import useUserDetails from "@/hooks/useUserDetails";
import { ITimelineItem, ITicket } from "@/lib/types";
import { ActivityTypes } from "@/constant/activity";

interface TicketTimelineProps {
  ticket: ITicket;
}

export default function TicketTimeline({ ticket }: TicketTimelineProps) {
  const { timeline, loading, submitting, addComment } = useTicketTimeline(
    ticket.id,
    ticket,
  );
  const [commentText, setCommentText] = useState("");
  const currentUser = useUserDetails();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new items
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [timeline]);

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

  const getRoleColor = (role?: string) => {
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case ActivityTypes.CREATED:
        return <AddCircleIcon fontSize="small" color="primary" />;
      case ActivityTypes.ASSIGNED:
        return <AssignmentIndIcon fontSize="small" color="info" />;
      case ActivityTypes.RESOLVED:
        return <TaskAltIcon fontSize="small" color="success" />;
      case ActivityTypes.VERIFIED:
        return <CheckCircleIcon fontSize="small" color="success" />;
      case ActivityTypes.CLOSED:
        return <LockIcon fontSize="small" color="action" />;
      case "TYPE_CHANGED":
      case "PRIORITY_CHANGED":
        return <LabelImportantIcon fontSize="small" color="warning" />;
      default:
        return <FiberManualRecordIcon fontSize="small" color="disabled" />;
    }
  };

  const getActivityText = (item: ITimelineItem) => {
    switch (item.type) {
      case ActivityTypes.CREATED:
        return "created the ticket";
      case ActivityTypes.ASSIGNED:
        return `assigned to ${item.resolver?.name || "a resolver"}`;
      case ActivityTypes.RESOLVED:
        return "marked this ticket as resolved";
      case ActivityTypes.VERIFIED:
        return "verified the resolution";
      case ActivityTypes.CLOSED:
        return "closed the ticket";
      case "TYPE_CHANGED":
        return `changed type from ${item.metadata?.oldType || "None"} to ${item.metadata?.newType}`;
      case "PRIORITY_CHANGED":
        return `changed priority from ${item.metadata?.oldPriority || "None"} to ${item.metadata?.newPriority}`;
      default:
        return "performed an action";
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  // Filter out redundant COMMENT_ADDED activities if we have the actual comments
  // Assuming 'COMMENT' is the type for actual comment objects
  const displayItems = timeline.filter(
    (item) => item.type !== ActivityTypes.COMMENT_ADDED,
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: 550,
      }}
    >
      {/* Timeline List */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", mb: 3, px: 2 }}>
        {displayItems.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            py={8}
            color="text.secondary"
          >
            <HistoryIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
            <Typography variant="body1">No activity yet</Typography>
          </Box>
        ) : (
          <Stack spacing={3} mt={2}>
            {displayItems.map((item) => {
              const isComment = item.type === "COMMENT";
              const isMe = currentUser?.name === item.userName;

              if (isComment) {
                return (
                  <Box
                    key={item.id}
                    display="flex"
                    gap={2}
                    alignItems="flex-start"
                    flexDirection={isMe ? "row-reverse" : "row"}
                  >
                    <Avatar
                      sx={{
                        bgcolor:
                          item.userRole === "MANAGER"
                            ? "secondary.main"
                            : item.userRole === "RESOLVER"
                              ? "success.main"
                              : "primary.main",
                        width: 40,
                        height: 40,
                        fontSize: "0.9rem",
                        mt: 0.5,
                      }}
                    >
                      {getUserInitials(item.userName)}
                    </Avatar>
                    <Box flexGrow={1}>
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                        mb={0.5}
                        justifyContent={isMe ? "flex-end" : "flex-start"}
                      >
                        <Stack
                          direction={isMe ? "row-reverse" : "row"}
                          alignItems="center"
                          gap={1}
                        >
                          <Typography variant="subtitle2" fontWeight="bold">
                            {isMe ? "You" : item.userName || "Unknown User"}
                          </Typography>
                          <Chip
                            label={item.userRole || "USER"}
                            size="small"
                            color={getRoleColor(item.userRole)}
                            variant="outlined"
                            sx={{ height: 20, fontSize: "0.65rem" }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {new Date(item.createdAt).toLocaleString()}
                          </Typography>
                        </Stack>
                      </Box>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          bgcolor: (theme) => {
                            return theme.palette.mode === "dark"
                              ? "rgba(255,255,255,0.05)"
                              : "rgba(0,0,0,0.03)";
                          },
                          color: "text.secondary",
                          borderRadius: 2,
                          borderTopLeftRadius: isMe ? 2 : 0,
                          borderTopRightRadius: isMe ? 0 : 2,
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="inherit"
                          sx={{ whiteSpace: "pre-wrap" }}
                        >
                          {item.comment}
                        </Typography>
                      </Paper>
                    </Box>
                  </Box>
                );
              } else {
                // Activity Item
                return (
                  <Box key={item.id} position="relative" pl={2.5}>
                    {/* Visual Connector - simplified vertical line effect could go here */}
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          bgcolor: (theme) => theme.palette.action.hover,
                        }}
                      >
                        {getActivityIcon(item.type)}
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.primary">
                          <Typography
                            component="span"
                            variant="subtitle2"
                            fontWeight="bold"
                          >
                            {item.userName} {isMe && "(You)"}
                          </Typography>{" "}
                          {getActivityText(item)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(item.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                );
              }
            })}
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
                size="medium"
                endIcon={
                  submitting ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <SendIcon />
                  )
                }
                onClick={handleSubmit}
                disabled={!commentText.trim() || submitting}
                sx={{ borderRadius: 2 }}
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
