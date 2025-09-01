'use client';

import React from 'react';
import dynamic from 'next/dynamic';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SendEmailSchemaType } from '@/schema/send-email-schema';
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

const Editor = dynamic(() => import('@tinymce/tinymce-react').then((mod) => mod.Editor), { ssr: false });

type EmailDialogProps = {
  trigger: React.ReactNode;
  title?: string;
  recipients?: { email: string }[];
  recipientsCount?: number;
  onSend: (payload: SendEmailSchemaType) => void;
  sendText?: string;
  cancelText?: string;
};

const EmailDialog: React.FC<EmailDialogProps> = ({
  trigger,
  title = 'Custom email',
  recipients,
  recipientsCount,
  onSend,
  sendText = 'Send email',
  cancelText = 'Cancel',
}) => {
  const [subject, setSubject] = React.useState('');
  const [body, setBody] = React.useState('');

  const totalRecipients = recipients ? recipients.length : recipientsCount ?? 0;

  const handleSend = () => {
    console.log(subject, body, onSend);

    if (!recipients || recipients.length === 0) return;
    onSend({ subject, message: body, users: recipients as SendEmailSchemaType['users'] });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[720px] bg-white-100">
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

          <Input label="Subject" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />

          <div>
            <div className="sr-only">Email body</div>
            <Editor
              apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_KEY}
              onEditorChange={(content) => setBody(content)}
              init={{
                height: 280,
                menubar: false,
                plugins: [
                  'anchor',
                  'autolink',
                  'charmap',
                  'codesample',
                  'emoticons',
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
                  'undo redo | blocks | bold italic underline | alignleft aligncenter alignright | bullist numlist outdent indent | link image media | removeformat',
                branding: false,
                resize: false,
                placeholder: 'Type something..',
              }}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{cancelText}</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleSend}>{sendText}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailDialog;
