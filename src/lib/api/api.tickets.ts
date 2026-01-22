import { api } from "../api";
import { ITicket } from "../types";

export function getAllTickets() {
  return api<ITicket[]>("/tickets", { auth: true });
}

export function createTicket(title: string, description: string) {
  return api<ITicket>("/tickets", {
    method: "POST",
    auth: true,
    body: JSON.stringify({ title, description }),
  });
}

export function assignTicket(ticketId: string, resolverId: string) {
  return api<ITicket>(`/tickets/${ticketId}/assign`, {
    method: "POST",
    auth: true,
    body: JSON.stringify({ resolverId }),
  });
}

export function resolveTicket(ticketId: string) {
  return api<ITicket>(`/tickets/${ticketId}/resolve`, {
    method: "POST",
    auth: true,
  });
}

export function verifyTicket(ticketId: string) {
  return api<ITicket>(`/tickets/${ticketId}/verify`, {
    method: "POST",
    auth: true,
  });
}

export function closeTicket(ticketId: string) {
  return api<ITicket>(`/tickets/${ticketId}/close`, {
    method: "POST",
    auth: true,
  });
}

export function getTicketById(ticketId: string) {
  return api<ITicket>(`/tickets/${ticketId}`, {
    method: "GET",
    auth: true,
  });
}
