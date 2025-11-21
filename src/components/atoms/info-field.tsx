interface InfoFieldProps {
  title: string;
  value: string | number;
}

export const InfoField = ({ title, value }: InfoFieldProps) => {
  return (
    <div className="flex flex-col">
      <span className="text-gray-800 text-sm font-semibold">{title}</span>
      <span className="text-gray-900 text-base">{value}</span>
    </div>
  );
};
