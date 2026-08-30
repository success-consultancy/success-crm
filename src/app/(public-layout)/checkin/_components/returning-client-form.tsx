'use client';

import { useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { PhoneNumberInput } from '@/components/molecules/phone-number-input';
import { useVerifyAndCheckIn } from '@/mutations/check-in/returning-check-in';
import { LOADING_LABEL } from '@/constants/messages';

interface Props {
  onBack: () => void;
  onNewClient: () => void;
  onSuccess: () => void;
}

type FieldError = { phone?: string; email?: string; general?: string };

const INPUT_STYLE: React.CSSProperties = {
  height: 48,
  border: '1px solid #E3E3E3',
  borderRadius: 8,
  fontFamily: 'Inter, sans-serif',
  fontSize: 14,
  color: '#1C1C1C',
  backgroundColor: '#FFFFFF',
  width: '100%',
};

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: 'Inter, sans-serif',
  fontWeight: 400,
  fontSize: 14,
  color: '#1C1C1C',
  marginBottom: 6,
  display: 'block',
};

const ReturningClientForm = ({ onBack, onNewClient, onSuccess }: Props) => {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<FieldError>({});

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
        onSuccess: () => onSuccess(),
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
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0F4F7' }}>
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        {/* Card: 800px wide, matching other check-in screens */}
        <div className="bg-white w-full" style={{ maxWidth: 800, borderRadius: 16, padding: '40px 48px 48px' }}>
          {/* Header: ← Returning Client */}
          <div className="flex items-center gap-3" style={{ marginBottom: 10 }}>
            <button
              onClick={onBack}
              className="flex items-center justify-center hover:opacity-70 transition-opacity"
              style={{ color: '#1C1C1C' }}
              aria-label="Back"
            >
              <ArrowLeft style={{ width: 22, height: 22 }} strokeWidth={2} />
            </button>
            <h1
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: 24,
                color: '#1C1C1C',
                margin: 0,
                lineHeight: '1.25em',
              }}
            >
              Returning Client
            </h1>
          </div>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              fontSize: 14,
              color: '#484848',
              margin: '0 0 28px 0',
              lineHeight: '1.57em',
            }}
          >
            Please enter your contact details to verify your identity and check in.
          </p>

          {/* Phone number */}
          <div style={{ marginBottom: 12 }}>
            <label style={LABEL_STYLE}>Phone number</label>
            <PhoneNumberInput
              value={phone}
              onChange={(val) => {
                setPhone(val || '');
                if (errors.phone) setErrors((e) => ({ ...e, phone: undefined }));
              }}
              placeholder="+00 000 000 000"
              style={INPUT_STYLE}
            />
            {errors.phone && (
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#EF4444', marginTop: 4 }}>
                {errors.phone}
              </p>
            )}
          </div>

          {/* Or */}
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              fontSize: 14,
              color: '#9CA3AF',
              margin: '0 0 12px 0',
            }}
          >
            Or
          </p>

          {/* Email */}
          <div style={{ marginBottom: 40 }}>
            <label style={LABEL_STYLE}>Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((er) => ({ ...er, email: undefined }));
              }}
              placeholder="name@gmail.com"
              style={{
                ...INPUT_STYLE,
                borderColor: errors.email ? '#EF4444' : '#E3E3E3',
              }}
              className="placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-blue-300"
            />
            {errors.email && (
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#EF4444', marginTop: 4 }}>
                {errors.email}
              </p>
            )}
          </div>

          {errors.general && (
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#EF4444', marginBottom: 16 }}>
              {errors.general}
            </p>
          )}

          {/* Buttons: full-width side by side */}
          <div className="grid grid-cols-2" style={{ gap: 20, marginBottom: 20 }}>
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="flex items-center justify-center gap-2"
              style={{
                height: 48,
                borderRadius: 8,
                border: 'none',
                backgroundColor: '#1B7FD4',
                color: '#FFFFFF',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: 15,
                cursor: isPending ? 'not-allowed' : 'pointer',
                opacity: isPending ? 0.9 : 1,
              }}
            >
              {isPending && <Loader2 style={{ width: 16, height: 16 }} className="animate-spin" />}
              {isPending ? LOADING_LABEL.verify : 'Verify & check-in'}
            </button>
            <button
              type="button"
              onClick={onBack}
              style={{
                height: 48,
                borderRadius: 8,
                border: '1px solid #E3E3E3',
                backgroundColor: '#FFFFFF',
                color: '#1C1C1C',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: 15,
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#F9FAFB';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#FFFFFF';
              }}
            >
              Cancel
            </button>
          </div>

          {/* First time visiting us? */}
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              fontSize: 14,
              color: '#484848',
              textAlign: 'center',
              margin: 0,
            }}
          >
            First time visiting us?{' '}
            <button
              onClick={onNewClient}
              style={{
                color: '#1B7FD4',
                fontWeight: 400,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                fontSize: 14,
                padding: 0,
              }}
            >
              New client
            </button>
          </p>
        </div>
      </div>

      <footer className="text-center py-4" style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#484848' }}>
        ©2026 Success Education and Visa Services
      </footer>
    </div>
  );
};

export default ReturningClientForm;
