'use client';

import { useGetUserById } from '@/query/get-user';
import AddUserForm from '../../../add/_components/add-user-form';
import SectionLoader from '@/components/molecules/section-loader';
import { UserFormType } from '@/schema/user-schema';

const EditUserClient = ({ userId }: { userId: string }) => {
  const { data: user, isLoading } = useGetUserById(userId);

  if (isLoading || !user) return <SectionLoader />;

  const defaultValues: Partial<UserFormType & { id: number }> = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    address: user.address ?? '',
    color: (user as any).color ?? '',
    roleId: user.roleId,
    isActive: user.isActive,
    onlineAppointment: user.onlineAppointment,
    isPaid: user.isPaid,
    dashboardManagement: user.dashboardManagement,
    agencyAgreementManagement: user.agencyAgreementManagement,
    userManagement: user.userManagement,
    universityManagement: user.universityManagement,
    courseManagement: user.courseManagement,
    sourceManagement: user.sourceManagement,
    settingManagement: user.settingManagement,
  };

  return <AddUserForm mode="edit" defaultValues={defaultValues} />;
};

export default EditUserClient;
