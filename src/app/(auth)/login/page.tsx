"use client";
import LoginCard from "@/app/components/auth/LoginCard";
import LoginForm from "@/app/components/auth/LoginForm";
import { useLogin } from "@/hooks/useLogin";

export default function LoginPage() {
  const login = useLogin();

  return (
    <LoginCard>
      <LoginForm
        email={login.email}
        password={login.password}
        loading={login.loading}
        error={login.error}
        onEmailChange={login.setEmail}
        onPasswordChange={login.setPassword}
        onSubmit={login.submit}
      />
    </LoginCard>
  );
}
