'use client';

import Container from '@/components/atoms/container';
import { AddVisaService } from './_components/add-visa-service';
import { useGetMe } from '@/query/get-me';
import PageLoader from '@/components/molecules/page-loader';

const Page = () => {
  const { data: me, isLoading: meLoading } = useGetMe();

  if (meLoading) {
    return <PageLoader />;
  }

  return (
    <Container>
      <AddVisaService userId={me?.data?.id} />
    </Container>
  );
};

export default Page;
