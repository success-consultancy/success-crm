'use client';

import { useState } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PhoneNumberInput } from '@/components/molecules/phone-number-input';
import { useVerifyAndCheckIn } from '@/mutations/check-in/returning-check-in';

interface Props {
  onBack: () => void;
  onNewClient: () => void;
}

type FieldError = { phone?: string; email?: string; general?: string };

const ReturningClientForm = ({ onBack, onNewClient }: Props) => {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<FieldError>({});
  const [checkedIn, setCheckedIn] = useState(false);

  const { mutate: verifyAndCheckIn, isPending } = useVerifyAndCheckIn();

  const validate = (): boolean => {
    const newErrors: FieldError = {};
    const hasPhone = phone.trim().length >= 10;
    const hasEmail = email.trim().length > 0;

    if (!hasPhone && !hasEmail) {
      newErrors.phone = 'Enter a valid phone number or email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    verifyAndCheckIn(
      { phone: phone || undefined, email: email || undefined },
      {
        onSuccess: () => {
          setCheckedIn(true);
        },
        onError: (error: any) => {
          const status = error?.response?.status;
          const message = error?.response?.data?.message;

          if (status === 404) {
            if (email) {
              setErrors({ email: 'No accounts match this email' });
            } else {
              setErrors({ phone: 'No accounts match this phone number' });
            }
          } else {
            setErrors({ general: message || 'Something went wrong. Please try again.' });
          }
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md relative">
          {/* Success overlay */}
          {checkedIn && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl z-10">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mx-4 text-center max-w-xs w-full">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Checked-in</h2>
                <p className="text-sm text-gray-500 mb-6">
                  Please be seated. Someone will be with you shortly.
                </p>
                <Button onClick={onBack} className="w-full">
                  Okay
                </Button>
              </div>
            </div>
          )}

          {/* Back button */}
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Returning Client
          </button>

          <p className="text-sm text-gray-500 mb-5">
            Please enter your contact details to verify your identity and check in.
          </p>

          <div className="space-y-4">
            {/* Phone */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Phone number</label>
              <PhoneNumberInput
                value={phone}
                onChange={(val) => {
                  setPhone(val || '');
                  if (errors.phone) setErrors((e) => ({ ...e, phone: undefined }));
                }}
                placeholder="+61 000 000 000"
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>

            {/* Or separator */}
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <div className="flex-1 border-t border-gray-200" />
              Or
              <div className="flex-1 border-t border-gray-200" />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((er) => ({ ...er, email: undefined }));
                }}
                placeholder="name@gmail.com"
                className={errors.email ? 'border-red-400 focus-visible:ring-red-300' : ''}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {errors.general && (
              <p className="text-xs text-red-500">{errors.general}</p>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                className="flex-1"
                onClick={handleSubmit}
                disabled={isPending}
              >
                {isPending ? 'Verifying...' : 'Verify & check-in'}
              </Button>
              <Button variant="outline" onClick={onBack}>
                Cancel
              </Button>
            </div>

            {/* New client link */}
            <p className="text-center text-xs text-gray-500">
              First time visiting us?{' '}
              <button
                onClick={onNewClient}
                className="text-blue-600 hover:underline font-medium"
              >
                New client
              </button>
            </p>
          </div>
        </div>
      </div>

      <footer className="text-center py-4 text-xs text-gray-400">
        © 2025 Success Education and Visa Services
      </footer>
    </div>
  );
};

export default ReturningClientForm;
