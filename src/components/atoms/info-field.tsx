interface InfoFieldProps {
  title: string;
  value: string | number;
  type?: 'badge';
  badgeColor?: string;
}

export const InfoField = ({ title, value, type, badgeColor }: InfoFieldProps) => {
  if (type === 'badge' && value != "-") {
    return (
      <div className="flex flex-col">
        <span className="text-neutral-black text-b14-600">{title}</span>
        <div>
          <span className={`text-neutral-dark-grey text-b14 px-2 py-1 rounded-[2px] inline-flex`} style={{ backgroundColor: badgeColor }}>{value}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <span className="text-neutral-black text-b14-600">{title}</span>
      <span className="text-neutral-dark-grey text-b14">{value}</span>
    </div>
  );
};
