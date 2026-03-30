'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { Globe01, Award01, ShieldPlus, Scales01, GraduationHat02, Lightbulb05, Scales02 } from '@untitledui/icons';
import { cn } from '@/lib/utils';

const SERVICE_ICONS: Record<string, React.ElementType> = {
  Education: GraduationHat02,
  Visa: FileGlobeIcon,
  'Skill Assessment': Lightbulb05,
  'Health Insurance': ShieldPlus,
  Tribunal: Scales02,
};
import { newCheckInSchema, NewCheckInSchemaType } from '@/schema/check-in-schema';
import { useCreateNewCheckIn } from '@/mutations/check-in/new-check-in';
import { PhoneNumberInput } from '@/components/molecules/phone-number-input';
import { COUNTRIES } from '@/data';
import FileGlobeIcon from '@/assets/icons/file-globe-icon';

const SERVICE_OPTIONS = ['Education', 'Visa', 'Skill Assessment', 'Health Insurance', 'Tribunal'];

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
      {
        ...data,
        serviceType: JSON.stringify(data.serviceType),
        status: 'New',
        isConsent: true,
      },
      {
        onSuccess: () => {
          onSuccess();
        },
        onError: (error: any) => {
          const message = error?.response?.data?.message;
          form.setError('email', {
            type: 'manual',
            message: message || 'Failed to check in. Please try again.',
          });
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-2xl">
          {/* Back button */}
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            New Client
          </button>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Name row */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        First name <span className="text-gray-400 font-normal">(required)</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Last name <span className="text-gray-400 font-normal">(required)</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Ryan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Phone & Email row */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Phone number <span className="text-gray-400 font-normal">(required)</span>
                      </FormLabel>
                      <FormControl>
                        <PhoneNumberInput value={field.value} onChange={field.onChange} placeholder="+61 000 000 000" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Email <span className="text-gray-400 font-normal">(required)</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="name@gmail.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Country & Note row */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Country of origin <span className="text-gray-400 font-normal">(optional)</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value ?? ''}>
                        <FormControl>
                          <SelectTrigger>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Personal message <span className="text-gray-400 font-normal">(optional)</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Type a message, if any" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Services */}
              <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select service</FormLabel>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {SERVICE_OPTIONS.map((service) => {
                        const Icon = SERVICE_ICONS[service];
                        const isSelected = field.value?.includes(service);
                        return (
                          <button
                            key={service}
                            type="button"
                            onClick={() => {
                              const current = field.value || [];
                              field.onChange(isSelected ? current.filter((v) => v !== service) : [...current, service]);
                            }}
                            className={cn(
                              'flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all',
                              isSelected
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50',
                            )}
                          >
                            <Icon className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                            {service}
                          </button>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" disabled={isPending} className="min-w-[120px]">
                  {isPending ? 'Submitting...' : 'Submit'}
                </Button>
                <Button type="button" variant="outline" onClick={onBack}>
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>

      <footer className="text-center py-4 text-xs text-gray-400">© 2025 Success Education and Visa Services</footer>
    </div>
  );
};

export default NewClientForm;
