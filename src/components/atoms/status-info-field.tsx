import { InfoField } from '@/components/atoms/info-field';
import { SERVICE_STATUS_COLORS } from '@/constants/status-colors';

/** Read-only status field, tinted with the shared service status colors. */
export const StatusInfoField = ({ title, status }: { title: string; status: string | null }) => {
  const colors = status ? SERVICE_STATUS_COLORS[status] : undefined;
  return (
    <InfoField
      title={title}
      value={status || '-'}
      type={colors ? 'badge' : undefined}
      badgeColor={colors?.background}
      badgeTextColor={colors?.text}
    />
  );
};
