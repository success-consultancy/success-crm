'use client';

import React, { useState } from 'react';
import TitleBox from './title-box';

type NoteSectionProps = {
  title?: string;
  initialNote?: string;
  onNoteUpdate?: (newNote: string) => void;
  placeholder?: string;
};

const NoteSection = ({
  title = 'Notes',
  initialNote = '',
  onNoteUpdate,
  placeholder = 'Add notes...',
}: NoteSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState(initialNote);

  const handleBlur = () => {
    setIsEditing(false);
    if (onNoteUpdate && note !== initialNote) {
      onNoteUpdate(note);
    }
  };

  return (
    <TitleBox title={title}>
      <div className="flex flex-col">
        {isEditing ? (
          <textarea
            className="text-gray-900 text-base font-medium resize-none bg-transparent outline-none border-none p-0"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onBlur={handleBlur}
            autoFocus
            rows={3}
            placeholder={placeholder}
          />
        ) : (
          <span
            onClick={() => setIsEditing(true)}
            className="text-gray-900 text-base font-medium cursor-text min-h-[60px] block"
          >
            {note || `Click to add ${title.toLowerCase()}`}
          </span>
        )}
      </div>
    </TitleBox>
  );
};

export default NoteSection;
