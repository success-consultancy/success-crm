import Container from '@/components/atoms/container';
import EditUserClient from './_components/edit-user';

const EditUserPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <Container className="flex flex-col py-10 gap-8">
      <EditUserClient userId={id} />
    </Container>
  );
};

export default EditUserPage;
