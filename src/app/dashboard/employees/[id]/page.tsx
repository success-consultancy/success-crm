import EmployeeTimesheetPage from './_components/employee-timesheet-page';

interface Props {
  params: Promise<{ id: string }>;
}

const EmployeeDetailPage = async ({ params }: Props) => {
  const { id } = await params;
  return <EmployeeTimesheetPage userId={Number(id)} />;
};

export default EmployeeDetailPage;
