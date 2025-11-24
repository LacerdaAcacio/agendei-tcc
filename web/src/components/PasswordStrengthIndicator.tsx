import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import zxcvbn from 'zxcvbn';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const { t } = useTranslation();
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    if (password) {
      const result = zxcvbn(password);
      setStrength(result.score);
    } else {
      setStrength(0);
    }
  }, [password]);

  if (!password) return null;

  const getStrengthColor = () => {
    switch (strength) {
      case 0:
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-yellow-500';
      case 3:
      case 4:
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getStrengthText = () => {
    switch (strength) {
      case 0:
      case 1:
        return t('validation.password.strength.weak');
      case 2:
        return t('validation.password.strength.medium');
      case 3:
      case 4:
        return t('validation.password.strength.strong');
      default:
        return '';
    }
  };

  const getStrengthWidth = () => {
    return `${(strength / 4) * 100}%`;
  };

  return (
    <div className="space-y-1">
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
        <div
          className={`h-full transition-all duration-300 ${getStrengthColor()}`}
          style={{ width: getStrengthWidth() }}
        />
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400">
        {getStrengthText()}
      </p>
    </div>
  );
}
