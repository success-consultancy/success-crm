'use client';

import { useRouteId } from '@/hooks/use-route-id';
import UserTimesheetPage from './_components/user-timesheet-page';

const UserTimesheetRoute = () => {
  const id = useRouteId();
  if (!id) return null;
  return <UserTimesheetPage userId={Number(id)} />;
};

export default UserTimesheetRoute;
