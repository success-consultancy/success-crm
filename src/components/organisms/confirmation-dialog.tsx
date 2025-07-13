"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import DialogWrapper from "./dialog-wrapper";

type ConfirmationDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  loading?: boolean;
};

const ConfirmationDialog = ({
  isOpen,
  setIsOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmationDialogProps) => {
  return (
    <DialogWrapper
      title={title}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      canClose={false}
    >
      <div className="text-gray-700 text-lg mb-6">{message}</div>

      <div className="flex justify-end gap-2">
        <Button
          variant="ghost"
          className="rounded-full"
          onClick={() => {
            setIsOpen(false);
            onCancel?.();
          }}
        >
          {cancelText}
        </Button>
        <Button
          className="rounded-full"
          variant="destructive"
          onClick={() => {
            onConfirm();
            setIsOpen(false);
          }}
          disabled={loading}
          loading={loading}
        >
          {confirmText}
        </Button>
      </div>
    </DialogWrapper>
  );
};

export default ConfirmationDialog;
