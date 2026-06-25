'use client';

import React, { useMemo, useState } from 'react';
import CardContainer from '@/components/atoms/card-container';
import { useGetAllServiceData, ServiceDataItem } from '@/query/get-all-service-data';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const SERVICE_LABELS: Record<string, string> = {
  lead: 'Lead',
  student: 'Education',
  visa: 'Visa',
  insurance: 'Insurance',
  skill: 'Skill',
};

const SERVICE_COLORS: Record<string, string> = {
  lead: 'bg-blue-100 text-blue-800',
  student: 'bg-teal-100 text-teal-800',
  visa: 'bg-green-100 text-green-800',
  insurance: 'bg-yellow-100 text-yellow-800',
  skill: 'bg-orange-100 text-orange-800',
};

const STATUS_VARIANTS: Record<string, string> = {
  New: 'bg-blue-50 text-blue-700',
  'Collecting Docs': 'bg-amber-50 text-amber-700',
  'Ready To Submit': 'bg-purple-50 text-purple-700',
  Submitted: 'bg-indigo-50 text-indigo-700',
  Approved: 'bg-green-50 text-green-700',
  'Coe Received': 'bg-green-50 text-green-700',
  Completed: 'bg-green-50 text-green-700',
  Withdrawn: 'bg-gray-50 text-gray-600',
  Refused: 'bg-red-50 text-red-700',
  Discontinued: 'bg-gray-50 text-gray-500',
};

const PAGE_SIZE = 10;

const MyAssignedLeads = () => {
  const { data, isLoading } = useGetAllServiceData();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.toLowerCase();
    return data
      .filter((item) => {
        if (!q) return true;
        return (
          item.firstName?.toLowerCase().includes(q) ||
          item.lastName?.toLowerCase().includes(q) ||
          item.email?.toLowerCase().includes(q) ||
          item.phone?.includes(q)
        );
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [data, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <CardContainer className="p-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <h4 className="text-b14-600 text-content-heading">My Assigned Leads</h4>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-content-subtitle" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-8 pr-3 py-1.5 text-xs border rounded-md w-[240px] outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-c1 text-content-subtitle">
              <th className="pb-3 pr-4 font-medium">Name</th>
              <th className="pb-3 pr-4 font-medium">Contact</th>
              <th className="pb-3 pr-4 font-medium">Service</th>
              <th className="pb-3 pr-4 font-medium">Status</th>
              <th className="pb-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b">
                  <td colSpan={5} className="py-3">
                    <div className="animate-pulse h-4 bg-gray-100 rounded w-full" />
                  </td>
                </tr>
              ))
            ) : pageData.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-content-subtitle text-sm">
                  {search ? 'No results found' : 'No assigned leads'}
                </td>
              </tr>
            ) : (
              pageData.map((item, idx) => (
                <tr
                  key={`${item.serviceName}-${item.id}-${idx}`}
                  className="border-b last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-2.5 pr-4">
                    <p className="text-b14-500 text-content-heading">
                      {item.firstName} {item.lastName}
                    </p>
                  </td>
                  <td className="py-2.5 pr-4">
                    <p className="text-c1 text-content-subtitle">{item.email}</p>
                    {item.phone && <p className="text-c2 text-content-subtitle">{item.phone}</p>}
                  </td>
                  <td className="py-2.5 pr-4">
                    <span
                      className={cn(
                        'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium',
                        SERVICE_COLORS[item.serviceName] || 'bg-gray-100 text-gray-700',
                      )}
                    >
                      {SERVICE_LABELS[item.serviceName] || item.serviceName}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4">
                    <span
                      className={cn(
                        'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium',
                        STATUS_VARIANTS[item.status] || 'bg-gray-50 text-gray-600',
                      )}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-c1 text-content-subtitle whitespace-nowrap">
                    {new Date(item.createdAt).toLocaleDateString('en-AU', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-3 border-t">
          <p className="text-c1 text-content-subtitle">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2.5 py-1 text-xs rounded border hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-2.5 py-1 text-xs rounded border hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </CardContainer>
  );
};

export default MyAssignedLeads;
