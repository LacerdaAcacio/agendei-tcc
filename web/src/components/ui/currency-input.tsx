import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { DollarSign } from 'lucide-react';

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number;
  onChange: (value: number) => void;
}

export function CurrencyInput({ value, onChange, className, ...props }: CurrencyInputProps) {
  const [internalValue, setInternalValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Use internal value while focused,otherwise format the prop value
  const displayValue = isFocused
    ? internalValue
    : new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value || 0);

  const handleFocus = () => {
    setIsFocused(true);
    setInternalValue(
      new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value || 0),
    );
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');

    if (!rawValue) {
      setInternalValue('');
      onChange(0);
      return;
    }

    const numericValue = parseFloat(rawValue) / 100;

    // Update display
    const formatted = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericValue);

    setInternalValue(formatted);
    onChange(numericValue);
  };

  return (
    <div className="relative">
      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
      <Input
        {...props}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`pl-9 ${className || ''}`}
        placeholder="0,00"
      />
    </div>
  );
}
