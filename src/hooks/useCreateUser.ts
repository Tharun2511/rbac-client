import { createUser } from "@/lib/api/api.users";
import { useState } from "react";

export function useCreateUser(onSuccess?: () => void) {
  const [addOpen, setAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [loading, setLoading] = useState(false);

  async function submit() {
    try {
      setLoading(true);
      await createUser({ name, email, password, role });
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
    role,
    loading,
    setAddOpen,
    setName,
    setEmail,
    setPassword,
    setRole,
    submit,
  };
}
