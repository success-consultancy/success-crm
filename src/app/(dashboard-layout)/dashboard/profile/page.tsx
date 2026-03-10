'use client';

import React from 'react';

import PersonalDetailsTab from './_components/personal-details-tab';
import SecurityTab from './_components/security-tab';

import useSearchParams from '@/hooks/use-search-params';

import { MeUser, useGetMe } from '@/query/get-me';
import TabSelector from '@/components/atoms/tab-selector';
import Container from '@/components/atoms/container';
import Portal from '@/components/atoms/portal';
import { PortalIds } from '@/config/portal';
import SectionLoader from '@/components/molecules/section-loader';

const TAB_CONFIG = [
  { key: 'personal_details', label: 'Personal Details' },
  { key: 'security', label: 'Security' },
];

const Account = () => {
  const { data: user, isLoading } = useGetMe();
  const { searchParams, setParams } = useSearchParams();

  const currentTab = searchParams.get('tab') || 'personal_details';

  const handleTabChange = (tabKey: string) => {
    setParams([{ name: 'tab', value: tabKey }]);
  };

  if (isLoading) return <SectionLoader />;

  return (
    <Container className="flex flex-col max-h-full overflow-hidden w-full !p-6 m-4 rounded-2xl">
      <Portal rootId={PortalIds.DashboardHeader}>
        <h3 className="text-h4 text-content-heading font-bold">Account Settings</h3>
      </Portal>

      <div className="container bg-white rounded-xl py-2 px-4">
        <TabSelector className="mb-4" tabs={TAB_CONFIG} activeTab={currentTab} onTabChange={handleTabChange} />

        {currentTab === 'personal_details' ? <PersonalDetailsTab user={user?.data as MeUser} /> : <SecurityTab />}
      </div>
    </Container>
  );
};

export default Account;
