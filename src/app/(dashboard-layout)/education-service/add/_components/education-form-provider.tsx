'use client';

import type React from 'react';
import { createContext, useContext } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newStudentSchema, type NewStudentType } from '@/schema/education-service/new-student.schema';

const EducationFormContext = createContext<{
  form: ReturnType<typeof useForm<NewStudentType>>;
  submitForm: (data: NewStudentType) => Promise<void>;
} | null>(null);

export const EducationFormProvider = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm<NewStudentType>({
    resolver: zodResolver(newStudentSchema),
    mode: 'onChange',
    defaultValues: {
      // Personal Details
      firstName: '',
      middleName: '',
      lastName: '',
      birthdate: undefined,
      email: '',
      phoneNumber: '',
      nationality: '',
      address: '',
      passportNumber: '',
      passportIssueDate: undefined,
      passportExpiryDate: undefined,
      location: '',

      // Course Information
      universityName: '',
      course: '',
      universityStartDate: undefined,
      universityEndDate: undefined,
      status: '',

      // Fee Structure
      feePaymentPlan: '',
      feeAmount: 0,
      dueDate: undefined,
      invoiceNumber: '',
      paymentStatus: '',
      feeNotes: '',

      // Accounts
      accountPaymentPlan: '',
      commission: 0,
      accountAmount: 0,
      discount: 0,
      bonus: 0,
      netAmount: 0,
      accountDueDate: undefined,
      accountInvoiceNumber: '',
      commissionStatus: '',
      accountNotes: '',

      // Misc
      assignedTo: '',
      source: '',
      additionalNotes: '',
    },
  });

  const submitForm = async (data: NewStudentType) => {
    console.log('Form Submitted', data);
    //  SUBMIT FORM HERE
  };

  return (
    <EducationFormContext.Provider value={{ form: methods, submitForm }}>
      <FormProvider {...methods}>{children}</FormProvider>
    </EducationFormContext.Provider>
  );
};

export const useEducationForm = () => {
  const context = useContext(EducationFormContext);
  if (!context) throw new Error('useEducationForm must be used within EducationFormProvider');
  return context;
};
