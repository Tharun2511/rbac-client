import { api } from "../api";
import { Ticket } from "../types";

export function getTickets() {
  return api<Ticket[]>("/tickets", { auth: true });
}

export function createTicket(title: string, description: string) {
  return api<Ticket>("/tickets", {
    method: "POST",
    auth: true,
    body: JSON.stringify({ title, description }),
  });
}

export function assignTicket(ticketId: string, resolverId: string) {
  return api<Ticket>(`/tickets/${ticketId}/assign`, {
    method: "POST",
    auth: true,
    body: JSON.stringify({ resolverId }),
  });
}

export function resolveTicket(ticketId: string) {
  return api<Ticket>(`/tickets/${ticketId}/resolve`, {
    method: "POST",
    auth: true,
  });
}

export function verifyTicket(ticketId: string) {
  return api<Ticket>(`/tickets/${ticketId}/verify`, {
    method: "POST",
    auth: true,
  });
}

export function closeTicket(ticketId: string) {
  return api<Ticket>(`/tickets/${ticketId}/close`, {
    method: "POST",
    auth: true,
  });
}
