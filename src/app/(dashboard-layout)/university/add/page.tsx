'use client';

import { FORM_STATE } from '@/types/common';
import { UniversityForm } from './_components/add-university-form';

const AddUniversityPage = () => {
  return <UniversityForm formState={FORM_STATE.ADD} />;
};

export default AddUniversityPage;
