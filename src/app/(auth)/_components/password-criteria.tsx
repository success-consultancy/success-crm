import { cn } from '@/lib/utils';
import { passwordRequirements } from '@/constants/password-criteria';
import { X, CheckCircle } from 'lucide-react';

interface PasswordCriteriaProps {
  password: string;
}

const PasswordCriteria: React.FC<PasswordCriteriaProps> = ({ password }) => {
  return (
    <div className="mt-3">
      <ul className="space-y-2 text-sm">
        {passwordRequirements.map((row, index) => {
          const passwordEmpty = !password;
          const regexMatch = password && row.regex.test(password);

          return (
            <li
              key={`pass-${index}`}
              className={cn(
                'flex items-center gap-2 transition-colors',
                passwordEmpty ? 'text-neutral-darkGrey' : regexMatch ? 'text-green-600' : 'text-red-500',
              )}
            >
              {passwordEmpty ? (
                <div className="h-4 w-4 rounded-full border border-neutral-border bg-neutral-50" />
              ) : regexMatch ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <X className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm">{row.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PasswordCriteria;
