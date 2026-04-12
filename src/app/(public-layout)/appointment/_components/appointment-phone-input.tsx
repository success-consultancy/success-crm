'use client';

import { useState } from 'react';
import {
  FlagImage,
  CountryIso2,
  parseCountry,
  usePhoneInput,
  defaultCountries,
} from 'react-international-phone';
import { ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AppointmentPhoneInputProps {
  label?: string;
  value: string;
  onChange: (phone: string) => void;
  placeholder?: string;
}

const AppointmentPhoneInput = ({
  label,
  value,
  onChange,
  placeholder = '000 000 000',
}: AppointmentPhoneInputProps) => {
  const [countryOpen, setCountryOpen] = useState(false);

  const { inputValue, handlePhoneValueChange, country, setCountry } = usePhoneInput({
    defaultCountry: 'au',
    disableDialCodeAndPrefix: true,
    disableDialCodePrefill: true,
    value,
    countries: defaultCountries,
    onChange: (data) => {
      const stripped = data?.phone?.trim() === `+${data?.country?.dialCode}`.trim() ? '' : data.phone;
      onChange(stripped || '');
    },
  });

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="font-semibold text-[14px] leading-[20px] text-[#1c1c1c]">{label}</label>
      )}

      <div className="flex h-11 border border-[#b4b4b4] rounded-[6px] bg-white overflow-visible focus-within:border-[#007acc] focus-within:ring-1 focus-within:ring-[#007acc]/20 transition-colors">
        {/* Country selector */}
        <Popover open={countryOpen} onOpenChange={setCountryOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 border-r border-[#b4b4b4] shrink-0 hover:bg-gray-50 transition-colors rounded-l-[6px]"
            >
              <FlagImage iso2={country.iso2 as CountryIso2} className="w-5 h-4 object-cover rounded-sm" />
              <span className="text-[14px] font-medium text-[#484848]">+{country.dialCode}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#aaa]" strokeWidth={2} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[320px] p-0 border-[#e3e3e3] shadow-lg" align="start" sideOffset={6}>
            <Command
              filter={(value, search) =>
                value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0
              }
            >
              <CommandInput placeholder="Search country..." className="h-9" />
              <CommandEmpty>No country found.</CommandEmpty>
              <ScrollArea className="max-h-[260px] overflow-auto">
                <CommandGroup>
                  {defaultCountries.map((c) => {
                    const parsed = parseCountry(c);
                    return (
                      <CommandItem
                        key={parsed.iso2}
                        value={`${parsed.name} +${parsed.dialCode} ${parsed.iso2}`}
                        onSelect={() => {
                          setCountry(parsed.iso2 as CountryIso2);
                          setCountryOpen(false);
                        }}
                        className="flex items-center gap-2.5 px-3 py-2 cursor-pointer"
                      >
                        <FlagImage iso2={parsed.iso2} className="w-5 h-4 object-cover rounded-sm shrink-0" />
                        <span className="text-[13px] font-mono text-[#484848]">+{parsed.dialCode}</span>
                        <span className="text-[14px] text-[#1c1c1c] truncate">{parsed.name}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </ScrollArea>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Phone number input */}
        <input
          type="tel"
          value={inputValue}
          onChange={handlePhoneValueChange}
          placeholder={placeholder}
          className="flex-1 px-3 text-[16px] text-[#1c1c1c] placeholder:text-[#757575] bg-transparent focus:outline-none tracking-[-0.16px]"
        />
      </div>
    </div>
  );
};

export default AppointmentPhoneInput;
