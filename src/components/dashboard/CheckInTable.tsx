import React from 'react';
import { CheckCircle, Flag } from 'lucide-react';
import { Officer } from '../../types';

interface CheckInTableProps {
  checkIns: Officer[];
  onVerify: (id: string) => void;
  onFlag: (id: string) => void;
}

export const CheckInTable: React.FC<CheckInTableProps> = ({ checkIns, onVerify, onFlag }) => {
  if (!checkIns.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No check-ins found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Officer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Badge #</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dept #</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Defendant</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {checkIns.map((entry) => (
            <tr key={entry.id} className="text-gray-900">
              <td className="px-6 py-4 whitespace-nowrap">
                {entry.verified ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : entry.flagged ? (
                  <Flag className="w-5 h-5 text-red-500" />
                ) : (
                  <div className="w-5 h-5" />
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{entry.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{entry.badgeNumber}</td>
              <td className="px-6 py-4 whitespace-nowrap">{entry.title}</td>
              <td className="px-6 py-4 whitespace-nowrap">{entry.investigativeRole}</td>
              <td className="px-6 py-4 whitespace-nowrap">{entry.departmentNumber}</td>
              <td className="px-6 py-4 whitespace-nowrap">{entry.defendantName}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(entry.created_at).toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex gap-2">
                  <button
                    onClick={() => onVerify(entry.id)}
                    className="text-green-500 hover:text-green-700"
                    title="Verify check-in"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onFlag(entry.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Flag check-in"
                  >
                    <Flag className="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};