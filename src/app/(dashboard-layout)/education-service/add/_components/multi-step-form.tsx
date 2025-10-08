'use client';

import { useQueryState } from 'nuqs';
import { Button } from '@/components/ui/button';
import { EducationFormProvider, useEducationForm } from './education-form-provider';
import PersonalDetails from './personal-details';
import CourseInfo from './course-info';
import FeeStructure from './fee-structure';
import Accounts from './accounts';
import Misc from './misc';
import StepperTabs from './stepper-tabs';
import { NewStudentType } from '@/schema/education-service/new-student.schema';

const MultiStepFormContent = () => {
  const [step, setStep] = useQueryState('step', {
    defaultValue: '1',
  });
  const { form } = useEducationForm();
  const { trigger } = form;

  const currentStep = Number.parseInt(step);

  const validateCurrentStep = async () => {
    let fieldsToValidate: (keyof NewStudentType)[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = [
          'firstName',
          'lastName',
          'birthdate',
          'email',
          'passportIssueDate',
          'passportExpiryDate',
          'passportNumber',
          'phoneNumber',
          'nationality',
          'address',
          'location',
        ];
        break;
      case 2:
        fieldsToValidate = ['universityName', 'course', 'universityStartDate', 'universityEndDate', 'status'];
        break;
      case 3:
        fieldsToValidate = ['feePaymentPlan', 'feeAmount', 'dueDate', 'invoiceNumber', 'paymentStatus'];
        break;
      case 4:
        fieldsToValidate = [
          'accountPaymentPlan',
          'commission',
          'accountAmount',
          'netAmount',
          'accountDueDate',
          'accountInvoiceNumber',
          'commissionStatus',
        ];
        break;
      case 5:
        fieldsToValidate = ['assignedTo', 'source'];
        break;
      default:
        return true;
    }

    return await trigger(fieldsToValidate);
  };

  const nextStep = async () => {
    if (currentStep < 5) {
      const isValid = await validateCurrentStep();
      if (isValid) {
        setStep((currentStep + 1).toString());
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setStep((currentStep - 1).toString());
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PersonalDetails />;
      case 2:
        return <CourseInfo />;
      case 3:
        return <FeeStructure />;
      case 4:
        return <Accounts />;
      case 5:
        return <Misc />;
      default:
        return <PersonalDetails />;
    }
  };

  return (
    <>
      <div className="mb-4 md:mb-8">
        <StepperTabs currentStep={currentStep} />
      </div>
      <div className="w-full">
        <div className="max-w-[942px] mx-auto my-6 bg-white rounded-xl">
          <div className="">
            <div className="min-h-fit mb-8">{renderStepContent()}</div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-100 pb-4 px-6">
              <Button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                variant="outline"
                className="min-w-24 bg-transparent"
              >
                Previous
              </Button>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{currentStep} of 5 steps completed</span>
              </div>

              {currentStep < 5 ? (
                <Button type="button" onClick={nextStep} className="min-w-24">
                  Next
                </Button>
              ) : (
                <Button type="submit" form="education-form" className="min-w-32 bg-green-600 hover:bg-green-700">
                  Submit Registration
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const MultiStepForm = () => {
  return (
    <EducationFormProvider>
      <MultiStepFormContent />
    </EducationFormProvider>
  );
};

export default MultiStepForm;
