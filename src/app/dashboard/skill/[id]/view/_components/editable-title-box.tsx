'use client';

import React from 'react';
import { Pencil, X } from 'lucide-react';
import Button from '@/components/atoms/button';

type Props = {
  title: string;
  isEditing: boolean;
  isSaving?: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  children: React.ReactNode;
  disableEdit?: boolean;
};

const EditableTitleBox = ({
  title,
  isEditing,
  isSaving,
  onEdit,
  onCancel,
  onSave,
  children,
  disableEdit,
}: Props) => {
  return (
    <div className="border border-[#EBEBEB] rounded-lg">
      <div className="border-b border-[#EBEBEB] px-6 py-3 flex items-center justify-between gap-3">
        <p className="text-xl font-bold">{title}</p>

        {!disableEdit && (
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isSaving}
                  className="inline-flex items-center gap-1 text-b14-600 text-neutral-dark-grey hover:text-neutral-black px-3 py-1.5 rounded-md transition disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
                <Button size="sm" loading={isSaving} onClick={onSave}>
                  Save changes
                </Button>
              </>
            ) : (
              <button
                type="button"
                onClick={onEdit}
                className="inline-flex items-center gap-1 text-b14-600 text-neutral-dark-grey hover:text-neutral-black hover:bg-accent-50 px-3 py-1.5 rounded-md transition"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>
            )}
          </div>
        )}
      </div>

      <div className="p-6">{children}</div>
    </div>
  );
};

export default EditableTitleBox;
