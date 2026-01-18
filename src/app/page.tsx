"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const handleLogin = () => {
    router.push("/login");
  };
  return (
    <div>
      <h2>Welcome to Internal Workflow System</h2>
      <br />
      <p>Please click on login</p>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
