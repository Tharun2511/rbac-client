"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { saveActiveOrg, saveActiveProject } from "@/lib/auth";

export function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const router = useRouter();
  const { login } = useAuth();

  async function submit(submitEmail?: string, submitPassword?: string) {
    const emailToUse = submitEmail ?? email;
    const passwordToUse = submitPassword ?? password;

    if (!emailToUse || !passwordToUse) {
      setError("Email and password are required.");
      return;
    }
    try {
      setLoading(true);
      setError(undefined);

      const data = await login(emailToUse, passwordToUse);

      // Auto-select first org (or the only one)
      const orgs = data.contexts.organizations;
      if (orgs.length > 0) {
        const orgId = orgs[0].id;
        saveActiveOrg(orgId);

        // Auto-select first project within the selected org
        const orgProjects = data.contexts.projects.filter(
          (p) => p.orgId === orgId,
        );
        if (orgProjects.length > 0) {
          saveActiveProject(orgProjects[0].id);
        }
      }

      // Redirect: System admins go to /admin, others go to select-org or dashboard
      if (data.user.isSystemAdmin) {
        router.replace("/dashboard");
      } else if (orgs.length === 0) {
        // User has no orgs — show a "no access" or org selection page
        router.replace("/select-org");
      } else {
        router.replace("/dashboard");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return {
    email,
    password,
    loading,
    error,
    setEmail,
    setPassword,
    submit,
  };
}
