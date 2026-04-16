'use client';

import React from 'react';
import TitleBox from './title-box';
import { IEducation } from '@/types/response-types/education-response';

type NoteSectionProps = { education: IEducation };

const NoteSection = ({ education }: NoteSectionProps) => {
  const note = education.remarks || '';

  return (
    <TitleBox title="Note">
      <div className="flex flex-col">
        <span className="text-gray-900 text-base font-medium cursor-text" dangerouslySetInnerHTML={{ __html: note }} />
      </div>
    </TitleBox>
  );
};

export default NoteSection;
