'use client';

import React, { useState } from 'react';
import TitleBox from './title-box';
import { ISkillAssessment } from '@/types/response-types/skill-assessment-response';

type VisaServiceNoteSectionProps = {
  skillAssessment: ISkillAssessment;
  onNoteUpdate?: (newNote: string) => void;
};

const VisaServiceNoteSection = ({ skillAssessment, onNoteUpdate }: VisaServiceNoteSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState(skillAssessment?.remarks || '');

  const handleBlur = () => {
    setIsEditing(false);
    if (onNoteUpdate && note !== skillAssessment.remarks) {
      onNoteUpdate(note);
    }
  };

  return (
    <TitleBox title="Visa & service note">
      <div className="flex flex-col">
        {isEditing ? (
          <textarea
            className="text-gray-900 text-base font-medium resize-none bg-transparent outline-none border-none p-0"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onBlur={handleBlur}
            autoFocus
            rows={3}
            placeholder="Add visa & service notes..."
          />
        ) : (
          <span
            onClick={() => setIsEditing(true)}
            className="text-gray-900 text-base font-medium cursor-text min-h-[60px] block"
          >
            {note || 'Click to add visa & service notes'}
          </span>
        )}
      </div>
    </TitleBox>
  );
};

export default VisaServiceNoteSection;
