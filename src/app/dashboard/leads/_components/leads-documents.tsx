import Button from '@/components/common/button';
import SectionWrapper from '@/components/common/section-wrapper';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/cn';

type DocumentItem = {
  name: string;
  size: string;
  type: string;
  dateAdded: string;
};

const documents: DocumentItem[] = [
  {
    name: 'Visadocument_Draft.pdf',
    size: '4.89 KB',
    type: 'PDF',
    dateAdded: '11/08/2016',
  },
  {
    name: 'Document related to skill-assessment.tiff',
    size: '12.45 MB',
    type: 'TIFF',
    dateAdded: '24/12/2017',
  },
];

const columnHeaderStyle =
  'text-muted-foreground text-sm font-medium text-left p-3 bg-component-hoveredLight border-b border-borderLight';
const cellStyle = 'text-sm p-3 border-b border-borderLight';

const LeadsDocumentsTable = () => {
  return (
    <SectionWrapper
      title="Documents"
      rightSection={
        <Button variant={'ghost'} className="text-primary-blue">
          Add Documents
        </Button>
      }
    >
      <ScrollArea className="max-h-[300px]">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className={columnHeaderStyle}>Document name</th>
              <th className={columnHeaderStyle}>Size</th>
              <th className={columnHeaderStyle}>Type</th>
              <th className={columnHeaderStyle}>Date added</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc, index) => (
              <tr key={index} className={cn(index % 2 === 0 && 'bg-background')}>
                <td className={cellStyle}>{doc.name}</td>
                <td className={cellStyle}>{doc.size}</td>
                <td className={cellStyle}>{doc.type}</td>
                <td className={cellStyle}>{doc.dateAdded}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollArea>
    </SectionWrapper>
  );
};

export default LeadsDocumentsTable;
