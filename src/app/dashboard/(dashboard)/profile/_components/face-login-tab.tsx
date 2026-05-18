'use client';

import { useState } from 'react';
import { ScanFace, ShieldCheck, ShieldOff } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import Button from '@/components/atoms/button';
import FaceCaptureModal from '@/components/face-capture-modal';
import { MeUser } from '@/query/get-me';
import { useUpdateClockInFace } from '@/mutations/clock-in/update-clockin-face';

interface Props {
  user: MeUser | undefined;
}

const FaceLoginTab = ({ user }: Props) => {
  const enrolled = !!user?.clockInFaceDescriptor;
  const [modalOpen, setModalOpen] = useState(false);

  const { mutateAsync: saveFace, isPending: saving } = useUpdateClockInFace();

  // Called by FaceCaptureModal after a descriptor has been captured. Throwing
  // here keeps the modal open and surfaces the error inline so the user can
  // retry without re-opening.
  const handleCapture = async (descriptor: number[]) => {
    try {
      await saveFace({ descriptor });
      toast.success('Face login enabled.');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        throw new Error(
          err.response.data?.message ?? 'This face is already registered to another user.',
        );
      }
      throw new Error('Could not save face. Please try again.');
    }
  };

  const handleRemove = async () => {
    if (!user) return;
    try {
      await saveFace({ descriptor: null });
      toast.success('Face login removed.');
    } catch {
      toast.error('Could not remove face login. Please try again.');
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-xl">
      <div>
        <h3 className="text-b3-b text-content-heading font-bold mb-[2px]">Face Login</h3>
        <p className="text-neutral-dark-grey text-b1">
          Enroll your face once, then clock in or out at the kiosk by scanning your face — no PIN required.
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-4">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            enrolled ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'
          }`}
        >
          {enrolled ? <ShieldCheck className="w-6 h-6" /> : <ScanFace className="w-6 h-6" />}
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-gray-900">
            {enrolled ? 'Face login is enabled' : 'Face login is not set up'}
          </div>
          <div className="text-xs text-gray-500">
            {enrolled
              ? 'You can clock in by scanning your face at the kiosk.'
              : 'Enroll your face to skip the PIN at the kiosk.'}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        {!enrolled ? (
          <Button
            type="button"
            onClick={() => setModalOpen(true)}
            disabled={!user || saving}
            loading={saving}
            LeftIcon={ScanFace}
          >
            Enroll My Face
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={handleRemove}
            disabled={saving}
            loading={saving}
            LeftIcon={ShieldOff}
          >
            Remove Face Login
          </Button>
        )}
      </div>

      <p className="text-xs text-gray-400">
        Face data is processed on your device. Only a numeric vector is sent to our servers.
      </p>

      <FaceCaptureModal
        mode="enroll"
        open={modalOpen}
        onOpenChange={setModalOpen}
        onCapture={handleCapture}
      />
    </div>
  );
};

export default FaceLoginTab;
