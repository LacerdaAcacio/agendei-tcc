import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { DollarSign } from 'lucide-react';

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number;
  onChange: (value: number) => void;
}

export function CurrencyInput({ value, onChange, className, ...props }: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    if (value !== undefined) {
      // Format initial value
      const formatted = new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
      setDisplayValue(formatted);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    
    if (!rawValue) {
      setDisplayValue('');
      onChange(0);
      return;
    }

    const numericValue = parseFloat(rawValue) / 100;
    
    // Update display
    const formatted = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericValue);
    
    setDisplayValue(formatted);
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
        className={`pl-9 ${className}`}
        placeholder="0,00"
      />
    </div>
  );
}
