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
      {label && <Label className='mb-2 text-b3-b font-semibold' htmlFor="feeNote">{label}</Label>}
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
            'table',
            'visualblocks',
            'accordion',
            'autoresize',
            'autosave',
            'code',
            'directionality',
            'emoticons',
            'fullscreen',
            'insertdatetime',
            'preview',
            'quickbars',
            'searchreplace',
            'table',
            'wordcount',
          ],
          toolbar:
            'wordcount | table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol | searchreplace | preview | insertdatetime | fullscreen | emoticons | ltr rtl | code | restoredraft | accordion | undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
          menubar: '',
          tinycomments_mode: 'embedded',
          tinycomments_author: 'Author name',
          mergetags_list: [
            { value: 'First.Name', title: 'First Name' },
            { value: 'Email', title: 'Email' },
          ],
          resize: false,
        }}
      />

      <FormErrorMessage message={error} />


    </div>
  );
}
