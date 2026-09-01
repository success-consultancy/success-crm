'use client';

import React from 'react';
import AdminStatCards from './stat-cards';
import ConversionRates from './conversion-rates';
import CustomerFlowChart from './customer-flow-chart';
import OutcomeDonuts from './outcome-donuts';
import EmployeeRankingTable from './employee-ranking-table';
import AnnouncementsSection from './announcements-section';

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <AdminStatCards />

      <CustomerFlowChart />

      <ConversionRates />

      <OutcomeDonuts />

      <EmployeeRankingTable />

      <AnnouncementsSection />
    </div>
  );
};

export default AdminDashboard;
