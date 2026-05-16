'use client';

import { useState } from 'react';
import { ScanFace, ShieldCheck, ShieldOff } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import Button from '@/components/atoms/button';
import { MeUser } from '@/query/get-me';
import { useUpdateClockInFace } from '@/mutations/clock-in/update-clockin-face';
import { enrollFace, describeFaceIOError, isFaceIOConfigured } from '@/lib/faceio';

interface Props {
  user: MeUser | undefined;
}

const FaceLoginTab = ({ user }: Props) => {
  const enrolled = !!user?.clockInFaceId;
  const configured = isFaceIOConfigured();
  const [busy, setBusy] = useState(false);

  const { mutateAsync: saveFaceId, isPending: saving } = useUpdateClockInFace();

  const handleEnroll = async () => {
    if (!user) return;
    setBusy(true);
    try {
      const result = await enrollFace({
        userId: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`.trim(),
      });
      await saveFaceId({ faceId: result.facialId });
      toast.success('Face login enabled.');
    } catch (err) {
      console.error('[faceio] enroll error:', err);
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        toast.error(err.response.data?.message || 'This face is already registered to another user.');
      } else {
        toast.error(describeFaceIOError(err));
      }
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async () => {
    if (!user) return;
    try {
      await saveFaceId({ faceId: null });
      toast.success('Face login removed.');
    } catch {
      toast.error('Could not remove face login. Please try again.');
    }
  };

  const pending = busy || saving;

  return (
    <div className="flex flex-col gap-4 max-w-xl">
      <div>
        <h3 className="text-b3-b text-content-heading font-bold mb-[2px]">Face Login</h3>
        <p className="text-neutral-dark-grey text-b1">
          Enroll your face once, then clock in or out at the kiosk by scanning your face — no PIN required.
        </p>
      </div>

      {!configured && (
        <div className="rounded-md border border-amber-200 bg-amber-50 text-amber-900 text-sm px-3 py-2">
          Face login is not configured for this environment. Ask an administrator to set
          <code className="mx-1 px-1 rounded bg-amber-100">NEXT_PUBLIC_FACEIO_PUBLIC_ID</code>.
        </div>
      )}

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
            onClick={handleEnroll}
            disabled={!configured || !user || pending}
            loading={pending}
            LeftIcon={ScanFace}
          >
            Enroll My Face
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={handleRemove}
            disabled={pending}
            loading={pending}
            LeftIcon={ShieldOff}
          >
            Remove Face Login
          </Button>
        )}
      </div>

      <p className="text-xs text-gray-400">
        Face data is processed by FaceIO. Only the resulting opaque ID is stored on our servers.
      </p>
    </div>
  );
};

export default FaceLoginTab;
