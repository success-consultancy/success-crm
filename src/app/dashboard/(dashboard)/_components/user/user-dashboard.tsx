'use client';

import React from 'react';
import MyStatCards from './my-stat-cards';
import ServicePerformanceChart from './service-performance-chart';
import ConversionRateWidget from './conversion-rate-widget';
import MyAssignedLeads from './my-assigned-leads';
import AnnouncementsSection from '../admin/announcements-section';

const UserDashboard = () => {
  return (
    <div className="space-y-6">
      <MyStatCards />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7">
          <ServicePerformanceChart />
        </div>
        <div className="lg:col-span-5">
          <ConversionRateWidget />
        </div>
      </div>

      <MyAssignedLeads />

      <AnnouncementsSection />
    </div>
  );
};

export default UserDashboard;
