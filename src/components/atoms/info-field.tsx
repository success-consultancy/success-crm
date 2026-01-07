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
        <span className="text-gray-800 text-sm font-semibold">{title}</span>
        <div>
          <span className={`text-gray-900 text-base px-2 py-1 rounded-[2px] inline-flex`} style={{ backgroundColor: badgeColor }}>{value}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <span className="text-gray-800 text-sm font-semibold">{title}</span>
      <span className="text-gray-900 text-base">{value}</span>
    </div>
  );
};
