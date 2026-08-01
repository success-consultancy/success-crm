'use client';

import Container from '@/components/atoms/container';
import { VisaService } from './_components/visa-service';
import { useGetMe } from '@/query/get-me';
import PageLoader from '@/components/molecules/page-loader';
import { FORM_STATE } from '@/types/common';

const Page = () => {
  const { data: me, isLoading: meLoading } = useGetMe();

  if (meLoading) {
    return <PageLoader />;
  }

  return (
    <Container className="flex flex-col flex-1 min-h-0 overflow-hidden py-5">
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1">
        <VisaService userId={me?.data?.id} formState={FORM_STATE.ADD} />
      </div>
    </Container>
  );
};

export default Page;
