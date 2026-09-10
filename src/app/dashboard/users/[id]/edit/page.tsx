'use client';

import Container from '@/components/atoms/container';
import EditUserClient from './_components/edit-user';
import { useRouteId } from '@/hooks/use-route-id';

const EditUserPage = () => {
  const id = useRouteId();
  if (!id) return null;
  return (
    <Container className="flex flex-col py-10 gap-8">
      <EditUserClient userId={id} />
    </Container>
  );
};

export default EditUserPage;
