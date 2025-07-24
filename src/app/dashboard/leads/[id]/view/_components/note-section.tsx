'use client';

import React, { useState } from 'react';
import TitleBox from './title-box';
import { ILead } from '@/types/response-types/leads-response';

type Props = {
  lead: ILead;
};

const NoteSection = ({ lead }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState(
    `Follow-up notes for ${lead.firstName} ${lead.lastName}. ` +
      `Source ID: ${lead.sourceId || 'Not specified'}. ` +
      `Service type: ${lead.serviceType || 'Immigration services'}. ` +
      `Current status: ${lead.status}. ` +
      `Contact: ${lead.email}${lead.phone ? ` | ${lead.phone}` : ''}.`,
  );

  return (
    <TitleBox title="Note">
      <div className="flex flex-col">
        {isEditing ? (
          <textarea
            className="text-gray-900 text-base font-medium resize-none bg-transparent outline-none border-none p-0"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onBlur={() => setIsEditing(false)}
            autoFocus
            rows={3}
          />
        ) : (
          <span onClick={() => setIsEditing(true)} className="text-gray-900 text-base font-medium cursor-text">
            {note}
          </span>
        )}
      </div>
    </TitleBox>
  );
};

export default NoteSection;
