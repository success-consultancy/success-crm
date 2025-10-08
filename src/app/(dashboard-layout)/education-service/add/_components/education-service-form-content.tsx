import PersonalDetails from './personal-details';
import { useStepper } from './stepper-form-context';

import Misc from './misc';
import Accounts from './accounts';
import CourseInfo from './course-info';
import FeeStructure from './fee-structure';

type Props = {};

const EducationServiceFormContent = (props: Props) => {
  const { activeStep } = useStepper();
  return (
    <div className="mt-10">
      {activeStep === 0 && <PersonalDetails />}
      {activeStep === 1 && <CourseInfo />}
      {activeStep === 2 && <FeeStructure />}
      {activeStep === 3 && <Accounts />}
      {activeStep === 4 && <Misc />}
    </div>
  );
};

export default EducationServiceFormContent;
