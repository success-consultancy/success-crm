'use client';

import React, { useState } from 'react';
import TitleBox from './title-box';
import { IVisa, IVisaDetail } from '@/types/response-types/visa-response';

type VisaNoteSectionProps = {
  visa: IVisaDetail;
  onNoteUpdate?: (newNote: string) => void; // Optional callback for updates
};

const VisaNoteSection = ({ visa, onNoteUpdate }: VisaNoteSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState(visa?.visaNote);

  const handleBlur = () => {
    setIsEditing(false);
    if (onNoteUpdate && note !== visa.visaNote) {
      onNoteUpdate(note);
    }
  };

  return (
    <TitleBox title="Visa Note">
      <div className="flex flex-col">
        {isEditing ? (
          <textarea
            className="text-gray-900 text-base font-medium resize-none bg-transparent outline-none border-none p-0"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onBlur={handleBlur}
            autoFocus
            rows={3}
            placeholder="Add visa notes..."
          />
        ) : (
          <span
            onClick={() => setIsEditing(true)}
            className="text-gray-900 text-base font-medium cursor-text min-h-[60px] block"
            dangerouslySetInnerHTML={{ __html: note || 'Click to add visa notes' }}
          />
        )}
      </div>
    </TitleBox>
  );
};

export default VisaNoteSection;
