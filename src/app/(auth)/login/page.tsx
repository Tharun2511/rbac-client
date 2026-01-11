'use client';

import { useState } from 'react';
import { login } from '@/lib/api/api.auth';
import { saveAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  async function handleLogin() {
    try {
      const { token, user } = await login(email, password);
      saveAuth(token, user);
      router.push(`/${user.role.toLowerCase()}`);
    } catch (err:any) {
      alert(err.message);
    }
  }

  return (
    <div>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
