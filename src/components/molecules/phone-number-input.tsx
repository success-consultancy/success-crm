'use client';

import React, { useState } from 'react';

import {
  FlagImage,
  CountryData,
  CountryIso2,
  parseCountry,
  usePhoneInput,
  defaultCountries,
} from 'react-international-phone';

import { cn } from '@/lib/utils';
// import Icons from '@/components/atoms/icons';
import Input, { InputProps } from '@/components/molecules/input';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

import { ScrollArea } from '@/components/ui/scroll-area';
import Icons from '@/assets/icons';

interface PhoneNumberInputProps extends Omit<InputProps, 'type' | 'onChange'> {
  value?: string;
  classNames?: any;
  onValueChange?: (phoneNumber?: string) => void;
  onChange?: (phoneNumber?: string) => void;
  error?: string;
  label?: string;
  optionalText?: boolean;
}

const PhoneNumberInput = React.forwardRef<HTMLInputElement, PhoneNumberInputProps>(
  ({ value, onValueChange, className, classNames, optionalText, onChange, ...inputProps }, ref) => {
    const { inputValue, handlePhoneValueChange, country, setCountry } = usePhoneInput({
      defaultCountry: 'us',
      disableDialCodeAndPrefix: true,
      disableDialCodePrefill: true,
      value: value || '',
      countries: defaultCountries,
      onChange: (data: any) => {
        const newValue = data?.phone?.trim() === `+${data?.country?.dialCode}`.trim() ? '' : data.phone;
        onValueChange?.(newValue);
        onChange?.(newValue);
      },
    });

    const handleCustomCountryChange = (newCountryIso2: CountryIso2) => {
      setCountry(newCountryIso2);
    };

    return (
      <div>
        <Input
          value={inputValue || ''}
          onChange={handlePhoneValueChange}
          type="tel"
          className={cn(['', className])}
          classNames={{
            className,
            ...classNames,
            input: classNames?.input,
            wrapper: 'relative ' + classNames?.wrapper,
            container: 'relative',
          }}
          leftSection={
            <CountrySelector
              value={country.iso2}
              onCountryChange={handleCustomCountryChange}
              selectedDialCode={country.dialCode}
              countries={defaultCountries}
            />
          }
          {...inputProps}
          optionalText={optionalText}
        />
      </div>
    );
  },
);

// country selector component
interface CountrySelectorProps {
  className?: string;
  countries: Array<CountryData>;
  value?: CountryIso2;
  selectedDialCode?: string;
  onCountryChange?: (countryIso2: CountryIso2) => void;
}

const CountrySelector: React.FC<CountrySelectorProps> = (props) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center gap-2.5 px-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="flex items-center gap-1 min-w-fit cursor-pointer">
            <FlagImage iso2={props.value} className="size-5" />
            <span>+{props.selectedDialCode}</span>
            {/* <Icons.ChevronDown className="h-full w-[11px] shrink-0" /> */}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[385px] p-2" align="start" sideOffset={8}>
          <Command
            filter={(value, search) => {
              if (value.toLowerCase().includes(search.toLowerCase())) return 1;
              if (value.toLowerCase() === search.toLowerCase()) return 100; // boost exact match score
              return 0;
            }}
          >
            <CommandInput />
            <CommandEmpty>No country found.</CommandEmpty>
            <ScrollArea className="max-h-[280px] overflow-auto">
              <CommandGroup>
                {props.countries.map((country) => {
                  const parsedCountry = parseCountry(country);
                  return (
                    <CommandItem
                      key={parsedCountry.iso2}
                      value={`${parsedCountry.name} +${parsedCountry.dialCode} ${parsedCountry.iso2}`}
                      onSelect={() => {
                        props.onCountryChange?.(parsedCountry.iso2);
                        setOpen(false);
                      }}
                      className="flex items-center gap-2 p-2"
                    >
                      <FlagImage iso2={parsedCountry.iso2} className="h-5 w-5" />
                      <span className="font-mono text-sm">+{parsedCountry.dialCode}</span>
                      <span className="truncate">{parsedCountry.name}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </ScrollArea>
          </Command>
        </PopoverContent>
      </Popover>
      <Separator orientation="vertical" />
    </div>
  );
};

PhoneNumberInput.displayName = 'PhoneNumberInput';

export type { PhoneNumberInputProps };
export { PhoneNumberInput };
