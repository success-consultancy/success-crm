import Button from '@/components/atoms/button';
import CardContainer from '@/components/atoms/card-container';
import ConfirmationDialog from '@/components/organisms/confirmation-dialog';
import { useAddEducation } from '@/mutations/education/add-education';
import { useAddInsurance } from '@/mutations/insurance/add-insurance';
import { useAddSkillAssessment } from '@/mutations/skill-assessment/add-skill-assessment';
import { useAddTribunalReview } from '@/mutations/tribunal-review/add-tribunal-review';
import { useAddVisa } from '@/mutations/visas/add-visa';
import { ILead } from '@/types/response-types/leads-response';
import { FolderSymlink, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Transition = ({ lead }: { lead: ILead }) => {
  type Service = {
    id: string;
    title: string;
    path: string;
    clientKey: keyof ILead['clientIds'];
  };
  const router = useRouter();

  const addVisa = useAddVisa();
  const addSkillAssessment = useAddSkillAssessment();
  const addEducation = useAddEducation();
  const addInsurance = useAddInsurance();
  const addTribunalReview = useAddTribunalReview();

  const [services, setServices] = useState<Service[]>([
    {
      id: 'students',
      title: 'Education service',
      clientKey: 'students',
      path: 'education',
    },
    {
      id: 'visa',
      title: 'Visa service',
      clientKey: 'visaApplicants',
      path: 'visa',
    },
    {
      id: 'skill',
      title: 'Skill assessment service',
      clientKey: 'skillAssessments',
      path: 'skill',
    },
    {
      id: 'insurance',
      title: 'Insurance service',
      clientKey: 'insuranceApplicants',
      path: 'insurance',
    },
    {
      id: 'tribunal',
      title: 'Tribunal review service',
      clientKey: 'tribunalReviews',
      path: 'tribunal-review',
    },
  ]);

  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  // Function to get client count for a service
  const getClientCount = (clientKey: keyof ILead['clientIds']) => {
    console.log(lead.clientIds, clientKey);

    return lead?.clientIds[clientKey]?.length || 0;
  };

  const getClient = (clientKey: keyof ILead['clientIds']) => {
    return lead?.clientIds[clientKey] || [];
  };

  function createGenericPayload(client: ILead) {
    const payload: Record<string, any> = {};

    if (client.hasOwnProperty('firstName')) {
      payload.firstName = client.firstName;
    }
    if (client.hasOwnProperty('lastName')) {
      payload.lastName = client.lastName;
    }
    if (client.hasOwnProperty('email')) {
      payload.email = client.email;
    }
    if (client.hasOwnProperty('phone')) {
      payload.phone = client.phone;
    }
    if (client.hasOwnProperty('country')) {
      payload.country = client.country;
    }
    if (client.hasOwnProperty('userId')) {
      payload.userId = client.userId;
    }
    if (client.hasOwnProperty('sourceId')) {
      payload.sourceId = client.sourceId;
    }
    if (client.hasOwnProperty('remarks')) {
      payload.remarks = client.remarks;
    }
    if (client.hasOwnProperty('files')) {
      payload.files = client.files;
    }

    return payload;
  }

  const handleMove = (serviceId: string) => {
    const genericPayload = createGenericPayload(lead);

    // Ensure required fields are present
    if (!genericPayload.firstName || !genericPayload.email) {
      console.error('Missing required fields: firstName and email');
      return;
    }

    // After validation, we know these fields exist
    const validatedPayload = genericPayload as typeof genericPayload & { firstName: string; email: string };

    switch (serviceId) {
      case 'visa':
        // Add visa-specific fields
        if (lead.visa) {
          validatedPayload.currentVisa = lead.visa;
        }
        if (lead.visaExpiry) {
          validatedPayload.visaExpiry = lead.visaExpiry;
        }
        if (lead.occupation) {
          validatedPayload.occupation = lead.occupation;
        }
        if (lead.anzsco) {
          validatedPayload.anzsco = lead.anzsco;
        }

        addVisa.mutateAsync({
          payload: validatedPayload as any, // Type assertion for now
          leadId: lead.id.toString(),
        });
        break;

      case 'students':
        // Handle education service - same as old moveToStudentService
        console.log('Moving to education service:', validatedPayload);
        addEducation.mutateAsync({ payload: validatedPayload, leadId: lead.id.toString() });
        break;

      case 'skill':
        // Handle skill assessment service - same as old moveToSkillAssessmentService
        if (lead.visa) {
          validatedPayload.currentVisa = lead.visa;
        }
        if (lead.visaExpiry) {
          validatedPayload.visaExpiry = lead.visaExpiry;
        }
        if (lead.occupation) {
          validatedPayload.occupation = lead.occupation;
        }
        if (lead.anzsco) {
          validatedPayload.anzsco = lead.anzsco;
        }

        console.log('Moving to skill assessment service:', validatedPayload);
        addSkillAssessment.mutateAsync({ payload: validatedPayload as any, leadId: lead.id.toString() });
        break;

      case 'insurance':
        // Handle insurance service - same as old moveToInsuranceService
        if (lead.visa) {
          validatedPayload.currentVisa = lead.visa;
        }
        if (lead.occupation) {
          validatedPayload.occupation = lead.occupation;
        }
        if (lead.anzsco) {
          validatedPayload.anzsco = lead.anzsco;
        }

        console.log('Moving to insurance service:', validatedPayload);
        addInsurance.mutateAsync({ payload: validatedPayload, leadId: lead.id.toString() });
        break;

      case 'tribunal':
        // Handle tribunal review service - same as old moveToTribunalReview
        console.log('Moving to tribunal review service:', validatedPayload);
        addTribunalReview.mutateAsync({ payload: validatedPayload, leadId: lead.id.toString() });
        break;

      default:
        console.log('Unknown service:', serviceId);
        break;
    }
  };

  const handleConfirmMove = () => {
    if (selectedServiceId) {
      handleMove(selectedServiceId);
      setSelectedServiceId(null);
      setIsConfirmationOpen(false);
    }
  };

  const handleCancelMove = () => {
    setSelectedServiceId(null);
    setIsConfirmationOpen(false);
  };
  // TODO: Add pending state based on mutation service
  const isPending =
    addVisa.isPending ||
    addSkillAssessment.isPending ||
    addEducation.isPending ||
    addInsurance.isPending ||
    addTribunalReview.isPending;

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
                  <p className="cursor-pointer" onClick={() => router.push(`/${service.path}/${client.id}/view`)}>
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

            {isPending ? (
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

      <ConfirmationDialog
        isOpen={isConfirmationOpen}
        setIsOpen={setIsConfirmationOpen}
        title="Confirm Move"
        message={`Are you sure you want to move this lead to ${
          services.find((s) => s.id === selectedServiceId)?.title
        }?`}
        confirmText="Move"
        cancelText="Cancel"
        onConfirm={handleConfirmMove}
        onCancel={handleCancelMove}
        loading={isPending}
      />
    </>
  );
};

export default Transition;
