'use client';

import { useEffect, useState } from 'react';
import { Role } from '@/lib/types';
import { getUsers, updateUserRole, updateUserStatus } from '@/lib/api/api.users';

interface UserRow {
  id: string;
  email: string;
  role: Role;
  is_active: boolean;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserRow[]>([]);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);
  
  async function toggleActive(user: UserRow) {
    await updateUserStatus(user.id, !user.is_active);
    setUsers(await getUsers());
  }

  async function changeRole(user: UserRow, role: Role) {
    await updateUserRole(user.id, role);
    setUsers(await getUsers());
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {users.map(u => (
          <tr key={u.id}>
            <td>{u.email}</td>

            <td>
              <select
                value={u.role}
                onChange={e => changeRole(u, e.target.value as Role)}
              >
                <option value="USER">USER</option>
                <option value="MANAGER">MANAGER</option>
                <option value="RESOLVER">RESOLVER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </td>

            <td>{u.is_active ? 'Active' : 'Inactive'}</td>

            <td>
              <button onClick={() => toggleActive(u)}>
                {u.is_active ? 'Deactivate' : 'Activate'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
