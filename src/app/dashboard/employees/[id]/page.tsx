'use client';

import { useRouteId } from '@/hooks/use-route-id';
import EmployeeTimesheetPage from './_components/employee-timesheet-page';

const EmployeeDetailPage = () => {
  const id = useRouteId();
  if (!id) return null;
  return <EmployeeTimesheetPage userId={Number(id)} />;
};

export default EmployeeDetailPage;
