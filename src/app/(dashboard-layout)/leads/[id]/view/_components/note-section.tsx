
'use client';

import React, { useState } from 'react';
import TitleBox from './title-box';
import { ILead } from "@/types/response-types/leads-response";

type NoteSectionProps = { lead: ILead };

const NoteSection = ({ lead }: NoteSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState(
    `Lead for ${lead.firstName} ${lead.lastName}. Status: ${lead.status || "-"}. Service: ${lead.serviceType || "-"}.`
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
          <span
            onClick={() => setIsEditing(true)}
            className="text-gray-900 text-base font-medium cursor-text"
          >
            {note}
          </span>
        )}
      </div>
    </TitleBox>
  );
};

export default NoteSection;
