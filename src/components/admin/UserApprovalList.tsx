import React from 'react';
import { Check, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const UserApprovalList = () => {
  const { users, approveUser, rejectUser } = useAuthStore();
  const pendingUsers = users.filter(user => !user.approved);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">User Approval Management</h2>
      
      <div className="bg-zinc-900/50 rounded-lg border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70">Username</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-white/70">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.map((user) => (
                <tr key={user.username} className="border-b border-white/10 last:border-0">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => approveUser(user.username)}
                        className="p-1 hover:bg-green-500/10 rounded-full text-green-400 transition-colors"
                        title="Approve user"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => rejectUser(user.username)}
                        className="p-1 hover:bg-red-500/10 rounded-full text-red-400 transition-colors"
                        title="Reject user"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pendingUsers.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-6 py-8 text-center text-white/50">
                    No pending user approvals
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};