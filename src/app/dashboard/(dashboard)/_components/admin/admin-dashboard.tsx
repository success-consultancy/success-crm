'use client';

import React from 'react';
import AdminStatCards from './stat-cards';
import ConversionRates from './conversion-rates';
import EmployeeRankingTable from './employee-ranking-table';
import ClientCountryChart from './client-country-chart';
import ProcessingInsightsChart from './processing-insights-chart';
import AnnouncementsSection from './announcements-section';

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <AdminStatCards />

      <ConversionRates />

      <EmployeeRankingTable />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7">
          <ClientCountryChart />
        </div>
        <div className="lg:col-span-5">
          <ProcessingInsightsChart />
        </div>
      </div>

      <AnnouncementsSection />
    </div>
  );
};

export default AdminDashboard;
