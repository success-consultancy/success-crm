'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Label } from '../ui/label';
import FormErrorMessage from '../atoms/form-error-message';

const Editor = dynamic(() => import('@tinymce/tinymce-react').then((mod) => mod.Editor), {
  ssr: false, // Disable server-side rendering for this component
});

interface TinyEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
}

export default function TinyEditor({ value, onChange, label, error }: TinyEditorProps) {
  return (
    <div>
      {label && <Label htmlFor="feeNote">{label}</Label>}
      <Editor
        licenseKey={'gpl'}
        tinymceScriptSrc={'https://cdnjs.cloudflare.com/ajax/libs/tinymce/7.1.2/tinymce.min.js'}
        // apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_KEY}
        value={value}
        onEditorChange={(content) => onChange?.(content)}
        init={{
          plugins: [
            // Core editing features
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
            'visualblocks',
            'accordion',
            'autoresize',
            'autosave',
            'code',
            'directionality',
            'fullscreen',
            'insertdatetime',
            'preview',
            'quickbars',
            'searchreplace',
            'table',
            'wordcount',
            'autoresize',
          ],
          toolbar:
            'removeformat | charmap emoticons | outdent indent bullist numlist checklist | lineheight align | typography a11ycheck spellcheckdialog | showcomments addcomment | mergetags table media image link | strikethrough underline italic bold | fontsize fontfamily blocks | redo undo | accordion | restoredraft | code | rtl ltr | emoticons | fullscreen | insertdatetime | preview | searchreplace | tabledeletecol tableinsertcolafter tableinsertcolbefore | tabledeleterow tableinsertrowafter tableinsertrowbefore | tablecellprops tablerowprops tableprops | tabledelete | wordcount',
          menubar: '',
          tinycomments_mode: 'embedded',
          tinycomments_author: 'Author name',
          mergetags_list: [
            { value: 'First.Name', title: 'First Name' },
            { value: 'Email', title: 'Email' },
          ],
          min_height: 250,
          resize: true,
        }}
      />

      <FormErrorMessage message={error} />
    </div>
  );
}
