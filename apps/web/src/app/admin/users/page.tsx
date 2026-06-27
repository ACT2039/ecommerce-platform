'use client';

import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { Shield, Trash2, ShieldAlert } from 'lucide-react';

export default function AdminUsersPage() {
  const { get, put, delete: deleteApi, loading } = useApi();
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await get('/admin/users?limit=50');
    if (res?.data?.users) {
      setUsers(res.data.users);
    }
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    const confirmMsg = newRole === 'ADMIN' 
      ? 'Are you sure you want to promote this user to Admin? They will have full access to the dashboard.' 
      : 'Are you sure you want to demote this user to a standard user?';
      
    if (confirm(confirmMsg)) {
      const res = await put(`/admin/users/${id}/role`, { role: newRole });
      if (res) fetchUsers();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you absolutely sure you want to delete this user? This cannot be undone.')) {
      const res = await deleteApi(`/admin/users/${id}`);
      if (res) fetchUsers();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
                          ${user.role === 'ADMIN' ? 'bg-gradient-to-tr from-purple-600 to-blue-600' : 'bg-gray-300'}`}
                        >
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border
                        ${user.role === 'ADMIN' 
                          ? 'bg-purple-50 text-purple-700 border-purple-200' 
                          : 'bg-gray-50 text-gray-600 border-gray-200'}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3 items-center">
                        {user.role === 'USER' ? (
                          <button 
                            onClick={() => handleRoleChange(user.id, 'ADMIN')}
                            className="text-gray-400 hover:text-purple-600 transition-colors"
                            title="Promote to Admin"
                          >
                            <Shield className="w-5 h-5" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleRoleChange(user.id, 'USER')}
                            className="text-gray-400 hover:text-orange-600 transition-colors"
                            title="Demote to User"
                          >
                            <ShieldAlert className="w-5 h-5" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
