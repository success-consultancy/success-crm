'use client';

import React from 'react';
import dynamic from 'next/dynamic';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import sendEmailSchema, { SendEmailSchemaType } from '@/schema/send-email-schema';
import { useToastContext } from '@/context/toast-context';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import Input from '@/components/molecules/input';
import { ENTITY, LOADING_LABEL, toastMsg } from '@/constants/messages';

const Editor = dynamic(() => import('@tinymce/tinymce-react').then((mod) => mod.Editor), { ssr: false });

type EmailDialogProps = {
  trigger: React.ReactNode;
  title?: string;
  recipients?: { email: string }[];
  recipientsCount?: number;
  onSend: (payload: SendEmailSchemaType) => void | Promise<unknown>;
  sendText?: string;
  cancelText?: string;
};

// TinyMCE returns markup, so an "empty" body can still be '<p><br></p>'.
const isBodyEmpty = (html: string) =>
  html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim().length === 0;

const EmailDialog: React.FC<EmailDialogProps> = ({
  trigger,
  title = 'Custom email',
  recipients,
  recipientsCount,
  onSend,
  sendText = 'Send email',
  cancelText = 'Cancel',
}) => {
  const { error: errorToast } = useToastContext();

  const [open, setOpen] = React.useState(false);
  const [subject, setSubject] = React.useState('');
  const [body, setBody] = React.useState('');
  const [errors, setErrors] = React.useState<{ subject?: string; body?: string }>({});
  const [isSending, setIsSending] = React.useState(false);

  const validRecipients = (recipients ?? []).filter((recipient) => Boolean(recipient?.email));
  const totalRecipients = recipients ? recipients.length : (recipientsCount ?? 0);

  const resetForm = () => {
    setSubject('');
    setBody('');
    setErrors({});
  };

  const handleOpenChange = (nextOpen: boolean) => {
    // Never let the dialog close while a send is in flight.
    if (isSending) return;
    setOpen(nextOpen);
    if (!nextOpen) resetForm();
  };

  const handleSend = async () => {
    const nextErrors: { subject?: string; body?: string } = {};
    if (!subject.trim()) nextErrors.subject = 'Subject is required';
    if (isBodyEmpty(body)) nextErrors.body = 'Email body is required';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (validRecipients.length === 0) {
      errorToast('No valid recipient email address found');
      return;
    }

    const parsed = sendEmailSchema.safeParse({
      subject: subject.trim(),
      message: body,
      users: validRecipients,
    });

    if (!parsed.success) {
      errorToast(parsed.error.issues[0]?.message ?? 'Please check the email details');
      return;
    }

    try {
      setIsSending(true);
      // The caller owns the success/error toast; we only keep the dialog open on failure.
      await onSend(parsed.data);
      setIsSending(false);
      setOpen(false);
      resetForm();
    } catch {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto bg-white-100">
        <DialogHeader>
          <DialogTitle className="text-h6 font-bold">{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <div className="text-b3-b mb-2">Recipients</div>
            <Badge variant="outline" className="rounded-sm px-2 py-1 text-b3">
              {totalRecipients} clients
            </Badge>
          </div>

          <Input
            label="Subject"
            placeholder="Subject"
            value={subject}
            error={errors.subject}
            onChange={(e) => {
              setSubject(e.target.value);
              if (errors.subject) setErrors((prev) => ({ ...prev, subject: undefined }));
            }}
          />

          <div>
            <div className="text-b3-b mb-2">Message</div>
            <Editor
              licenseKey={'gpl'}
              tinymceScriptSrc={'https://cdnjs.cloudflare.com/ajax/libs/tinymce/7.1.2/tinymce.min.js'}
              // apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_KEY}
              onEditorChange={(content) => {
                setBody(content);
                if (errors.body && !isBodyEmpty(content)) setErrors((prev) => ({ ...prev, body: undefined }));
              }}
              init={{
                height: 480,
                min_height: 420,
                max_height: 640,
                menubar: false,
                plugins: [
                  'anchor',
                  'autolink',
                  'charmap',
                  'codesample',
                  'emoticons',
                  'fullscreen',
                  'image',
                  'link',
                  'lists',
                  'media',
                  'searchreplace',
                  'table',
                  'visualblocks',
                  'autoresize',
                  'code',
                  'insertdatetime',
                  'preview',
                  'quickbars',
                  'wordcount',
                ],
                toolbar:
                  'undo redo | blocks | bold italic underline | alignleft aligncenter alignright | bullist numlist outdent indent | link image media | removeformat | fullscreen',
                branding: false,
                resize: false,
                placeholder: 'Type something..',
              }}
            />
            {errors.body && <div className="text-b14 text-utility-red mt-1">{errors.body}</div>}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isSending}>
              {cancelText}
            </Button>
          </DialogClose>
          <Button onClick={handleSend} loading={isSending} loadingText={LOADING_LABEL.send}>
            {sendText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailDialog;
