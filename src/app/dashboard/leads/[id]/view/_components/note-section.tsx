'use client';

import React, { useState } from 'react';
import TitleBox from './title-box';
import { ILead } from '@/types/response-types/leads-response';

type NoteSectionProps = { lead: ILead };

const NoteSection = ({ lead }: NoteSectionProps) => {
  const note = lead.remarks || '';

  return (
    <TitleBox title="Note">
      <div className="flex flex-col">
        <span className="text-gray-900 text-base font-medium cursor-text" dangerouslySetInnerHTML={{ __html: note }} />
      </div>
    </TitleBox>
  );
};

export default NoteSection;
