'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { GraduationHat02, Lightbulb05, ShieldPlus, Scales02 } from '@untitledui/icons';
import { cn } from '@/lib/utils';
import { newCheckInSchema, NewCheckInSchemaType } from '@/schema/check-in-schema';
import { useCreateNewCheckIn } from '@/mutations/check-in/new-check-in';
import { PhoneNumberInput } from '@/components/molecules/phone-number-input';
import { COUNTRIES } from '@/data';
import FileGlobeIcon from '@/assets/icons/file-globe-icon';
import { LOADING_LABEL } from '@/constants/messages';

const SERVICE_OPTIONS: { label: string; Icon: React.ElementType }[] = [
  { label: 'Education', Icon: GraduationHat02 },
  { label: 'Visa', Icon: FileGlobeIcon },
  { label: 'Skill Assessment', Icon: Lightbulb05 },
  { label: 'Health Insurance', Icon: ShieldPlus },
  { label: 'Tribunal', Icon: Scales02 },
];

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: 'Inter, sans-serif',
  fontWeight: 400,
  fontSize: 14,
  color: '#1C1C1C',
  marginBottom: 6,
  display: 'block',
};

const OPTIONAL_STYLE: React.CSSProperties = {
  color: '#9CA3AF',
  fontWeight: 400,
};

const INPUT_STYLE: React.CSSProperties = {
  height: 48,
  border: '1px solid #E3E3E3',
  borderRadius: 8,
  fontFamily: 'Inter, sans-serif',
  fontSize: 14,
  color: '#1C1C1C',
  backgroundColor: '#FFFFFF',
};

interface Props {
  onBack: () => void;
  onSuccess: () => void;
}

const NewClientForm = ({ onBack, onSuccess }: Props) => {
  const form = useForm<NewCheckInSchemaType>({
    resolver: zodResolver(newCheckInSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      country: '',
      note: '',
      serviceType: [],
    },
  });

  const { mutate: createNewCheckIn, isPending } = useCreateNewCheckIn();

  const onSubmit = (data: NewCheckInSchemaType) => {
    createNewCheckIn(
      { ...data, serviceType: JSON.stringify(data.serviceType), status: 'New', isConsent: true },
      {
        onSuccess: () => onSuccess(),
        onError: (error: any) => {
          const message: string = error?.response?.data?.message || '';
          if (message === 'Phone number already used') {
            form.setError('phone', { type: 'manual', message });
          } else {
            form.setError('email', { type: 'manual', message: message || 'Failed to check in. Please try again.' });
          }
        },
      },
    );
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0F4F7' }}>
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        {/* Card: matches 800px card from check-in screen */}
        <div className="bg-white w-full" style={{ maxWidth: 800, borderRadius: 16, padding: '40px 48px 48px' }}>
          {/* Header: ← New Client */}
          <div className="flex items-center gap-3" style={{ marginBottom: 32 }}>
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
              New Client
            </h1>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* Row 1: First name | Last name */}
              <div className="grid grid-cols-2" style={{ gap: 20, marginBottom: 20 }}>
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <label style={LABEL_STYLE}>First name</label>
                      <FormControl>
                        <Input
                          placeholder="e.g. John"
                          {...field}
                          style={INPUT_STYLE}
                          className="placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-blue-300"
                        />
                      </FormControl>
                      <FormMessage className="text-xs mt-1" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <label style={LABEL_STYLE}>Last name</label>
                      <FormControl>
                        <Input
                          placeholder="e.g. White"
                          {...field}
                          style={INPUT_STYLE}
                          className="placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-blue-300"
                        />
                      </FormControl>
                      <FormMessage className="text-xs mt-1" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Row 2: Phone number | Email */}
              <div className="grid grid-cols-2" style={{ gap: 20, marginBottom: 20 }}>
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <label style={LABEL_STYLE}>Phone number</label>
                      <FormControl>
                        <PhoneNumberInput
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="+00 000 000 000"
                          style={INPUT_STYLE}
                        />
                      </FormControl>
                      <FormMessage className="text-xs mt-1" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <label style={LABEL_STYLE}>Email</label>
                      <FormControl>
                        <Input
                          placeholder="name@gmail.com"
                          type="email"
                          {...field}
                          style={INPUT_STYLE}
                          className="placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-blue-300"
                        />
                      </FormControl>
                      <FormMessage className="text-xs mt-1" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Row 3: Country of origin | Personal message */}
              <div className="grid grid-cols-2" style={{ gap: 20, marginBottom: 28 }}>
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <label style={LABEL_STYLE}>
                        Country of origin <span style={OPTIONAL_STYLE}>(optional)</span>
                      </label>
                      <Select onValueChange={field.onChange} value={field.value ?? ''}>
                        <FormControl>
                          <SelectTrigger
                            style={{ ...INPUT_STYLE, paddingLeft: 12, paddingRight: 12 }}
                            className="focus:ring-1 focus:ring-blue-300"
                          >
                            <SelectValue placeholder="Select your origin country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-64">
                          {COUNTRIES.map((c) => (
                            <SelectItem key={c.country_code} value={c.country_name}>
                              {c.country_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs mt-1" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <label style={LABEL_STYLE}>
                        Personal message <span style={OPTIONAL_STYLE}>(optional)</span>
                      </label>
                      <FormControl>
                        <Input
                          placeholder="Type your message, if any"
                          {...field}
                          value={field.value ?? ''}
                          style={INPUT_STYLE}
                          className="placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-blue-300"
                        />
                      </FormControl>
                      <FormMessage className="text-xs mt-1" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Divider */}
              <div style={{ height: 1, backgroundColor: '#E3E3E3', marginBottom: 24 }} />

              {/* Select service */}
              <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem style={{ marginBottom: 32 }}>
                    <label style={{ ...LABEL_STYLE, marginBottom: 12 }}>Select service</label>
                    <div className="flex flex-wrap" style={{ gap: 10 }}>
                      {SERVICE_OPTIONS.map(({ label, Icon }) => {
                        const isSelected = field.value?.includes(label);
                        return (
                          <button
                            key={label}
                            type="button"
                            onClick={() => {
                              const current = field.value || [];
                              field.onChange(isSelected ? current.filter((v) => v !== label) : [...current, label]);
                            }}
                            className="flex items-center transition-all"
                            style={{
                              gap: 8,
                              padding: '8px 16px',
                              borderRadius: 8,
                              border: `1px solid ${isSelected ? '#3B82F6' : '#E3E3E3'}`,
                              backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                              color: isSelected ? '#1D4ED8' : '#1C1C1C',
                              fontFamily: 'Inter, sans-serif',
                              fontSize: 14,
                              fontWeight: 400,
                              cursor: 'pointer',
                            }}
                          >
                            <Icon
                              className="shrink-0"
                              style={{ width: 16, height: 16, color: isSelected ? '#3B82F6' : '#484848' }}
                              strokeWidth={1.5}
                            />
                            {label}
                          </button>
                        );
                      })}
                    </div>
                    <FormMessage className="text-xs mt-1" />
                  </FormItem>
                )}
              />

              {/* Submit / Cancel — full width side by side */}
              <div className="grid grid-cols-2" style={{ gap: 20 }}>
                <button
                  type="submit"
                  disabled={isPending}
                  style={{
                    height: 48,
                    borderRadius: 8,
                    border: 'none',
                    backgroundColor: '#4A90C4',
                    color: '#FFFFFF',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: 15,
                    cursor: isPending ? 'not-allowed' : 'pointer',
                    opacity: isPending ? 0.7 : 1,
                    transition: 'opacity 0.15s',
                  }}
                >
                  {isPending ? LOADING_LABEL.submit : 'Submit'}
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
            </form>
          </Form>
        </div>
      </div>

      <footer className="text-center py-4" style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#484848' }}>
        ©2026 Success Education and Visa Services
      </footer>
    </div>
  );
};

export default NewClientForm;
