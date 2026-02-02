import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type FilePreviewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileUrl: string;
  fileName: string;
  fileType: 'image' | 'pdf' | 'other';
};

export function FilePreviewDialog({ open, onOpenChange, fileUrl, fileName, fileType }: FilePreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="truncate">{fileName}</DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6">
          {fileType === 'image' && (
            <img src={fileUrl} alt={fileName} className="w-full max-h-[70vh] object-contain rounded-md" />
          )}

          {fileType === 'pdf' && (
            <iframe src={fileUrl} title={fileName} className="w-full h-[70vh] rounded-md border" />
          )}

          {fileType === 'other' && (
            <div className="text-center space-y-4 py-10">
              <p className="text-muted-foreground">Preview not supported for this file type.</p>
              <Button asChild>
                <a href={fileUrl} target="_blank">
                  Download File
                </a>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
