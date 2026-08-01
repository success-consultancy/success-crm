'use client';

import React from 'react';
import MyStatCards from './my-stat-cards';
import ServicePipelineTable from './service-pipeline-table';
import PerformanceReportChart from './performance-report-chart';

const UserDashboard = () => {
  return (
    <div className="space-y-6">
      <MyStatCards />

      <ServicePipelineTable />

      <PerformanceReportChart />
    </div>
  );
};

export default UserDashboard;
