'use client';

import React, { useState } from 'react';
import DialogWrapper from '@/components/organisms/dialog-wrapper';
import Input from '@/components/molecules/input';
import Button from '@/components/atoms/button';
import { useCreateFiscalReport } from '@/mutations/fiscal-report/create-fiscal-report';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function buildPayload(startYear: string) {
  const start = parseInt(startYear, 10);
  const year = `${start}-${start + 1}`;
  const name = `${start} - ${start + 1} Student Enrollment`;
  return { year, name };
}

function isValidYear(val: string) {
  const n = parseInt(val, 10);
  return /^\d{4}$/.test(val) && n > 2018 && n < 2050;
}

export default function CreateFiscalReportModal({ isOpen, onClose }: Props) {
  const [startYear, setStartYear] = useState('');
  const { mutate: create, isPending } = useCreateFiscalReport();

  const valid = isValidYear(startYear);
  const { year, name } = valid ? buildPayload(startYear) : { year: '', name: '' };

  const handleSubmit = () => {
    if (!valid) return;
    create(buildPayload(startYear), {
      onSuccess: () => {
        setStartYear('');
        onClose();
      },
    });
  };

  const handleClose = () => {
    setStartYear('');
    onClose();
  };

  return (
    <DialogWrapper title="Create fiscal report" isOpen={isOpen} setIsOpen={(open) => !open && handleClose()}>
      <div className="flex flex-col gap-5 pt-4">
        <Input
          label="Starting year"
          placeholder="e.g. 2025"
          value={startYear}
          maxLength={4}
          onChange={(e) => setStartYear(e.target.value.replace(/\D/g, ''))}
          error={startYear.length === 4 && !valid ? 'Enter a valid year between 2019 and 2049' : undefined}
        />

        <Input
          label="Report name"
          value={name}
          disabled
          placeholder="Auto-generated from year"
        />

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="outline" size="sm" onClick={handleClose} disabled={isPending} className="h-9">
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={!valid || isPending} className="h-9">
            {isPending ? 'Creating…' : 'Create'}
          </Button>
        </div>
      </div>
    </DialogWrapper>
  );
}
