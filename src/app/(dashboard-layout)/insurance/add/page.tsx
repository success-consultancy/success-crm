'use client';

import Container from '@/components/atoms/container';
import { TribunalService } from './_components/insurance-service';
import { useGetMe } from '@/query/get-me';
import PageLoader from '@/components/molecules/page-loader';
import { FORM_STATE } from '@/types/common';

const Page = () => {
  const { data: me, isLoading: meLoading } = useGetMe();

  if (meLoading) {
    return <PageLoader />;
  }

  return (
    <Container>
      <TribunalService userId={me?.data?.id} formState={FORM_STATE.ADD} />
    </Container>
  );
};

export default Page;
