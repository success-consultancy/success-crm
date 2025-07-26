'use client';

import React, { useState } from 'react';
import TitleBox from './title-box';

type Props = {};

const noteData = {
  note: 'Had a follow-up call with John regarding his study plans for the UK. He is interested in the January intake for a Master\'s in Business Administration. Currently preparing for IELTS and plans to take the test next month. Needs guidance on university options and scholarship opportunities. Scheduled another call for next week to discuss shortlisted universities.',
};

const NoteSection = (props: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState(noteData.note);

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
