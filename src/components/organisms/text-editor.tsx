"use client";

import React from "react";
import dynamic from "next/dynamic";

const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  {
    ssr: false, // Disable server-side rendering for this component
  }
);

export default function TinyEditor() {
  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_KEY}
      init={{
        plugins: [
          // Core editing features
          "anchor",
          "autolink",
          "charmap",
          "codesample",
          "emoticons",
          "image",
          "link",
          "lists",
          "media",
          "searchreplace",
          "table",
          "visualblocks",
          "accordion",
          "autoresize",
          "autosave",
          "code",
          "directionality",
          "emoticons",
          "fullscreen",
          "insertdatetime",
          "preview",
          "quickbars",
          "searchreplace",
          "table",
          "wordcount",
        ],
        toolbar:
          "wordcount | table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol | searchreplace | preview | insertdatetime | fullscreen | emoticons | ltr rtl | code | restoredraft | accordion | undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
        menubar: "",
        tinycomments_mode: "embedded",
        tinycomments_author: "Author name",
        mergetags_list: [
          { value: "First.Name", title: "First Name" },
          { value: "Email", title: "Email" },
        ],
        resize: false,
      }}
      initialValue="Welcome to TinyMCE!"
    />
  );
}
