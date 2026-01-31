import { apiClient as api } from "../api";
import { ITicket, IComment, ITimelineItem } from "../types";

export function getAllTickets() {
  return api<ITicket[]>("/tickets", { auth: true });
}

export function getMyTickets() {
  return api<ITicket[]>("/tickets/me", {
    auth: true,
  });
}

export function createTicket(title: string, description: string) {
  return api<ITicket>("/tickets", {
    method: "POST",
    auth: true,
    body: JSON.stringify({ title, description }),
  });
}

export function assignTicket(ticketId: string, resolverId: string) {
  return api<ITicket>(`/tickets/assign/${ticketId}`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify({ resolverId }),
  });
}

export function resolveTicket(ticketId: string) {
  return api<ITicket>(`/tickets/resolve/${ticketId}`, {
    method: "PATCH",
    auth: true,
  });
}

export function verifyTicket(ticketId: string) {
  return api<ITicket>(`/tickets/verify/${ticketId}`, {
    method: "PATCH",
    auth: true,
  });
}

export function closeTicket(ticketId: string) {
  return api<ITicket>(`/tickets/close/${ticketId}`, {
    method: "PATCH",
    auth: true,
  });
}

export function getTicketById(ticketId: string) {
  return api<ITicket>(`/tickets/${ticketId}`, {
    auth: true,
  });
}

export async function getMyTicketHistory() {
  return api<ITicket[]>("/tickets/my/history", {
    auth: true,
  });
}

export async function getAssignedTickets(resolverId: string) {
  return api<ITicket[]>(`/tickets/assigned/${resolverId}`, { auth: true });
}

export function getTicketComments(ticketId: string) {
  return api<IComment[]>(`/comments/${ticketId}`, {
    auth: true,
  });
}

export function createComment(ticketId: string, comment: string) {
  return api<IComment>(`/comments/${ticketId}`, {
    method: "POST",
    auth: true,
    body: JSON.stringify({ comment }),
  });
}

export function getTicketTimeline(ticketId: string) {
  return api<ITimelineItem[]>(`/timeline/${ticketId}`, {
    auth: true,
  });
}
