import Container from '@/components/atoms/container';
import Portal from '@/components/atoms/portal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PortalIds } from '@/config/portal';

const page = () => {
  return (
    <Container className="py-4">
      <Portal rootId={PortalIds.DashboardHeader}>
        <h3 className="text-h5 text-content-heading font-bold">Bartholomew Macquarie-Wilkinson</h3>
      </Portal>
      <div className="bg-white px-4 py-2 rounded-lg">
        <Tabs defaultValue="overview">
          <TabsList className="w-full !justify-start gap-2 border-b border-b-neutral-borderLight py-0 rounded-none">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">{/* <LeadsOverview /> */}</TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default page;
