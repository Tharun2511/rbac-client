import { useState } from "react";
import { saveAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/api.auth";

export function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const router = useRouter();

  async function submit(submitEmail?: string, submitPassword?: string) {
    const emailToUse = submitEmail ?? email;
    const passwordToUse = submitPassword ?? password;
    try {
      setLoading(true);
      setError(undefined);

      // Add 200ms delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const { token, user } = await login(emailToUse, passwordToUse);
      saveAuth(token, user);

      router.replace(`/${user.role.toLowerCase()}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
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
