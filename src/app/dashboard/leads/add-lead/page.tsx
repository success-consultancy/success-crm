import Container from '@/components/atoms/container';
import AddLeadForm from './_components/add-lead-form';

const page = () => {
  return (
    <Container className="flex flex-col flex-1 min-h-0 overflow-hidden py-5 gap-4">
      <AddLeadForm mode="add" />
    </Container>
  );
};

export default page;
