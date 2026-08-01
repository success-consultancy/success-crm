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
    <Container className="flex flex-col flex-1 min-h-0 overflow-hidden py-5">
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1">
        <AddEducationService userId={me?.data?.id} />
      </div>
    </Container>
  );
};

export default Page;
