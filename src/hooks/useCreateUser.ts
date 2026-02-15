import { createUser } from "@/lib/api/api.users";
import { useState } from "react";

export function useCreateUser(onSuccess?: () => void) {
  const [addOpen, setAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgId, setOrgId] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    try {
      setLoading(true);
      await createUser({ name, email, password, orgId });
      onSuccess?.();
      setAddOpen(false);
    } finally {
      setLoading(false);
    }
  }

  return {
    addOpen,
    name,
    email,
    password,
    orgId,
    loading,
    setAddOpen,
    setName,
    setEmail,
    setPassword,
    setOrgId,
    submit,
  };
}
