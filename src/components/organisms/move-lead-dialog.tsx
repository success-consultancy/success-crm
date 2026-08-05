'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type MoveLeadDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  /** Service the lead is being moved into, e.g. "Education service". */
  serviceTitle?: string;
  /** How many leads are being moved — above 1 the copy switches to the bulk wording. */
  count?: number;
  /** Noun for the records being moved, for tables other than leads. */
  itemLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  loading?: boolean;
};

/**
 * Confirmation shown before a lead is moved into a service application.
 *
 * Figma "Leads > Transition > Move this lead": title + close, two body paragraphs
 * (the question, then what the move actually does), Cancel / Move lead right-aligned.
 * Distinct from the generic `ConfirmationDialog`, whose destructive red confirm reads
 * wrong for a move.
 */
const MoveLeadDialog = ({
  isOpen,
  setIsOpen,
  serviceTitle = 'the selected service',
  count = 1,
  itemLabel = 'lead',
  onConfirm,
  onCancel,
  loading = false,
}: MoveLeadDialogProps) => {
  const isBulk = count > 1;
  const items = isBulk ? `${count} ${itemLabel}s` : `this ${itemLabel}`;
  const theItems = isBulk ? `the ${itemLabel}s` : `the ${itemLabel}`;

  const close = () => {
    setIsOpen(false);
    onCancel?.();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        // While the move is in flight the dialog is dismissible only by the move
        // finishing — the caller closes it once the request settles either way.
        if (!open && !loading) close();
      }}
    >
      <DialogContent
        className="sm:max-w-[496px] gap-6"
        showCloseButton={!loading}
        onInteractOutside={(e) => {
          if (loading) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (loading) e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-h4-700 text-neutral-black">
            {isBulk ? `Move ${count} ${itemLabel}s` : `Move this ${itemLabel}`}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Confirm moving {items} to {serviceTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 text-b14 text-neutral-black">
          <p>
            Are you sure you want to move {items} to {serviceTitle}?
          </p>
          <p>
            This will move {theItems} to {serviceTitle}, carry over the existing {itemLabel} information and start the{' '}
            {serviceTitle} workflow.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={close} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={onConfirm} loading={loading} loadingText="Moving">
            {isBulk ? `Move ${itemLabel}s` : `Move ${itemLabel}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MoveLeadDialog;
