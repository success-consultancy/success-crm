'use client';

import Container from '@/components/atoms/container';
import { AddEducationService } from './_components/add-education-service';
import { useGetMe } from '@/query/get-me';
import PageLoader from '@/components/molecules/page-loader';

const Page = () => {
  const { data: me, isLoading: meLoading } = useGetMe();

  if (meLoading) {
    return <PageLoader />;
  }

  return (
    <Container>
      <AddEducationService userId={me?.data?.id} />
    </Container>
  );
};

export default Page;
