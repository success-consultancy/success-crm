import Container from '@/components/atoms/container';
import AddUserForm from './_components/add-user-form';

const AddUserPage = () => {
  return (
    <Container className="flex flex-col py-5 gap-8">
      <AddUserForm mode="add" />
    </Container>
  );
};

export default AddUserPage;
