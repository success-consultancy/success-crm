import UserTimesheetPage from './_components/user-timesheet-page';

interface Props {
  params: Promise<{ id: string }>;
}

const UserTimesheetRoute = async ({ params }: Props) => {
  const { id } = await params;
  return <UserTimesheetPage userId={Number(id)} />;
};

export default UserTimesheetRoute;
