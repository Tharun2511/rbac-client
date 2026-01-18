"use client";

import Link from "next/link";
import { IRole } from "@/lib/types";
import { logout } from "@/lib/auth";

interface Props {
  role: IRole;
}

export default function Navigation({ role }: Props) {
  return (
    <nav style={{ marginBottom: "1rem" }}>
      {role === "USER" && <Link href="/user">My Tickets</Link>}

      {role === "MANAGER" && (
        <>
          <Link href="/manager">Tickets</Link>{" "}
          <Link href="/manager/assign">Assign</Link>
        </>
      )}

      {role === "RESOLVER" && <Link href="/resolver">Assigned Tickets</Link>}

      {role === "ADMIN" && <Link href="/admin">User Management</Link>}

      <button onClick={logout} style={{ marginLeft: "1rem" }}>
        Logout
      </button>
    </nav>
  );
}
