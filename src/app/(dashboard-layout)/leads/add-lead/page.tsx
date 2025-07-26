import Container from "@/components/atoms/container";
import AddLeadForm from "./_components/add-lead-form";

const page = () => {
  return (
    <Container className="flex flex-col py-10 gap-8">
      <AddLeadForm mode="add" />
    </Container>
  );
};

export default page;
