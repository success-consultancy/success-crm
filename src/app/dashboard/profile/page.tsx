'use client';

import React from 'react';
import Avatar from 'react-avatar';

import { ROUTES } from '@/app/config/routes';
import { PortalIds } from '@/app/config/portal';

import Portal from '@/components/common/portal';
import Container from '@/components/common/container';

import PersonalDetailsTab from './_components/personal-details-tab';
import SecurityTab from './_components/security-tab';

import { useGetUserProfile } from '@/query/get-user-profile';
import useSearchParams from '@/hooks/use-search-params';
import { cn } from '@/lib/cn';
import TabSelector from '@/components/common/tab-selector';

// Tab Config
const TAB_CONFIG = [
  { key: 'personal_details', label: 'Personal Details' },
  { key: 'security', label: 'Security' },
];

const Account = () => {
  const { data: user, isLoading } = useGetUserProfile();
  const { searchParams, setParams } = useSearchParams();

  const currentTab = searchParams.get('tab') || 'personal_details';

  const handleTabChange = (tabKey: string) => {
    setParams([{ name: 'tab', value: tabKey }]);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Container className="flex flex-col py-4 max-h-full overflow-hidden">
      <Portal rootId={PortalIds.DashboardHeader}>
        <h3 className="text-h4 text-content-heading font-bold">Account Settings</h3>
      </Portal>

      <div className="container bg-white py-6 rounded-xl">
        <TabSelector className='mb-4' tabs={TAB_CONFIG} activeTab={currentTab} onTabChange={handleTabChange} />

        {currentTab === 'personal_details' ? <PersonalDetailsTab user={user} /> : <SecurityTab />}
      </div>
    </Container>
  );
};

export default Account;
