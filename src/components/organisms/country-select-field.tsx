import React from 'react';

import { COUNTRIES } from '@/data';
import SelectField from '@/components/organisms/select-field';
import { SelectFieldProps } from '@/components/organisms/select-field';

const OPTIONS = COUNTRIES.map((country) => ({
  label: country.country_name,
  value: country.country_code,
  name: country.country_name,
}));

const CountrySelectField: React.FC<Omit<SelectFieldProps<any>, 'options'>> = ({ ...props }) => {
  return <SelectField options={OPTIONS} {...props} />;
};

export default CountrySelectField;
