import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { useCheckInStore } from '../store/checkInStore';
import { CheckInTable } from './dashboard/CheckInTable';
import { SearchBar } from './dashboard/SearchBar';

export const Dashboard = () => {
  const { checkIns, fetchCheckIns, verifyCheckIn, flagCheckIn } = useCheckInStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchCheckIns();
      } catch (error) {
        console.error('Error loading check-ins:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [fetchCheckIns]);

  const handleExport = () => {
    const headers = [
      'Name',
      'Badge Number',
      'Title',
      'Investigative Role',
      'Department Number',
      'Defendant Name',
      'Phone Number',
      'Agency',
      'Additional Comments',
      'Time',
      'Status',
    ].join(',');

    const rows = checkIns.map(entry => [
      entry.name,
      entry.badgeNumber,
      entry.title,
      entry.investigativeRole,
      entry.departmentNumber,
      entry.defendantName,
      entry.phoneNumber || '',
      entry.agency || '',
      (entry.additionalComments || '').replace(/\n/g, ' '),
      new Date(entry.created_at).toLocaleString(),
      entry.verified ? 'Verified' : entry.flagged ? 'Flagged' : 'Pending'
    ].map(field => `"${String(field || '').replace(/"/g, '""')}"`).join(','));

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `check-ins-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredCheckIns = checkIns.filter((entry) => {
    const matchesSearch =
      !searchTerm ||
      entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.badgeNumber.includes(searchTerm);

    const matchesDate =
      !dateFilter ||
      new Date(entry.created_at).toISOString().split('T')[0] === dateFilter;

    return matchesSearch && matchesDate;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">Loading Check-ins...</h2>
          <p className="text-gray-600">Please wait while we fetch the data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-primary">Officer Check-ins</h2>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-secondary hover:bg-secondary-light text-white px-4 py-2 rounded-md transition duration-200"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            dateFilter={dateFilter}
            onDateChange={setDateFilter}
          />

          <CheckInTable
            checkIns={filteredCheckIns}
            onVerify={verifyCheckIn}
            onFlag={flagCheckIn}
          />
        </div>
      </div>
    </div>
  );
};