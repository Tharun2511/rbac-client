import { getAllTickets } from "@/lib/api/api.tickets";
import { useEffect, useState } from "react";

export function useUserTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyTickets()
      .then(setTickets)
      .finally(() => setLoading(false));
  }, []);

  return { tickets, loading };
}

export function useManagerTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllTickets()
      .then(setTickets)
      .finally(() => setLoading(false));
  }, []);

  return { tickets, loading };
}

export function useResolverTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAssignedTickets()
      .then(setTickets)
      .finally(() => setLoading(false));
  }, []);

  return { tickets, loading };
}
