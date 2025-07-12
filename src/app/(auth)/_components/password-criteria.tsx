import { cn } from '@/lib/cn';
// import Icons from '@/components/icons';
import { passwordRequirements } from '@/constants';
import { CloseCircle, TickCircle } from 'iconsax-react';

interface PasswordCriteriaProps {
  password: string;
}

const PasswordCriteria: React.FC<PasswordCriteriaProps> = ({ password }) => {
  return (
    <ul className="text-b1 text-content-body">
      {passwordRequirements.map((row, index) => {
        const passwordEmpty = !password;
        const regexMatch = password && row.regex.test(password);

        let passwordStyle = '';

        if (!passwordEmpty) passwordStyle = regexMatch ? 'text-state-success-dark' : 'text-state-error-dark';

        return (
          <li key={`pass-${index}`} className={cn('flex items-center gap-2', 'text-b1', passwordStyle)}>
            {passwordEmpty ? (
              <div className="aspect-square h-1 w-1 rounded-full bg-black-100" />
            ) : regexMatch ? (
              <TickCircle variant="Linear" className="h-5 w-5" />
            ) : (
              <CloseCircle variant="Linear" className="h-5 w-5" />
            )}
            {row.label}
          </li>
        );
      })}
    </ul>
  );
};

export default PasswordCriteria;
