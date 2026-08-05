import CardContainer from '@/components/atoms/card-container';
import MoveLeadDialog from '@/components/organisms/move-lead-dialog';
import { useMoveLead, MoveServiceId } from '@/hooks/use-move-lead';
import { ILead } from '@/types/response-types/leads-response';
import { FolderSymlink, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Transition = ({ lead }: { lead: ILead }) => {
  const router = useRouter();
  const { services, moveLead, pendingServiceId } = useMoveLead();

  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<MoveServiceId | null>(null);

  const getClientCount = (clientKey: keyof ILead['clientIds']) => lead?.clientIds[clientKey]?.length || 0;
  const getClient = (clientKey: keyof ILead['clientIds']) => lead?.clientIds[clientKey] || [];

  // Held open until the move resolves so the dialog can show progress; `moveLead` rejects
  // on a rejected move (missing fields, already moved) and reports it with its own toast.
  const handleConfirmMove = async () => {
    if (!selectedServiceId) return;
    try {
      await moveLead(lead, selectedServiceId);
    } catch {
      // Reported by moveLead.
    } finally {
      setSelectedServiceId(null);
      setIsConfirmationOpen(false);
    }
  };

  const handleCancelMove = () => {
    setSelectedServiceId(null);
    setIsConfirmationOpen(false);
  };

  return (
    <>
      <div className="flex gap-4 overflow-x-auto p-4">
        {services.map((service) => (
          <CardContainer key={service.id} className="w-64 p-4 bg-white border shadow-sm flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-b3-b">{service.title}</h3>
              <div className="bg-[#EFF6FB] w-8 h-8 rounded-full flex items-center justify-center">
                <p className="text-c1">{getClientCount(service.clientKey)}</p>
              </div>
            </div>
            {getClient(service.clientKey).map((client) => {
              return (
                <div key={client?.id} className="bg-[#F2F4F7] mb-4 flex flex-col gap-2 p-3 rounded-md">
                  <p
                    className="cursor-pointer text-b14-500"
                    onClick={() => router.push(`/dashboard/${service.path}/${client.id}/view`)}
                  >
                    ID:{client?.id}
                  </p>
                  <p className="text-c1 text-neutral-dark-grey">
                    Moved by {client?.UpdatedByUser?.firstName}
                    {client?.UpdatedByUser?.lastName}
                  </p>
                  <p className="text-c1 text-neutral-dark-grey">{new Date(client?.updatedAt).toLocaleString()}</p>
                </div>
              );
            })}

            {pendingServiceId === service.id ? (
              <div className="cursor-pointer flex items-center justify-center text-b1-b text-neutral-light-grey border border-dashed rounded-md p-2 text-center gap-2">
                <Loader2 size={20} />
              </div>
            ) : (
              <div
                className="cursor-pointer text-b1-b text-neutral-light-grey border border-dashed rounded-md p-2 text-center flex gap-2"
                onClick={() => {
                  setSelectedServiceId(service.id);
                  setIsConfirmationOpen(true);
                }}
              >
                <FolderSymlink size={18} />
                Move here
              </div>
            )}
          </CardContainer>
        ))}
      </div>

      <MoveLeadDialog
        isOpen={isConfirmationOpen}
        setIsOpen={setIsConfirmationOpen}
        serviceTitle={services.find((s) => s.id === selectedServiceId)?.title}
        onConfirm={handleConfirmMove}
        onCancel={handleCancelMove}
        loading={pendingServiceId !== null}
      />
    </>
  );
};

export default Transition;
