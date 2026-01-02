'use client';

import Container from '@/components/atoms/container';
import { AddSkillAssessment } from './_components/add-skill-assessment';
import { useGetMe } from '@/query/get-me';
import PageLoader from '@/components/molecules/page-loader';

const Page = () => {
  const { data: me, isLoading: meLoading } = useGetMe();

  if (meLoading) {
    return <PageLoader />;
  }

  return (
    <Container>
      <AddSkillAssessment userId={me?.data?.id} />
    </Container>
  );
};

export default Page;
