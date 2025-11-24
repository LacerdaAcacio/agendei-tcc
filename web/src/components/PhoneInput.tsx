import { forwardRef } from 'react';
import { Input } from './ui/input';

interface PhoneInputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  placeholder?: string;
  id?: string;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, onChange, error, placeholder, id, ...props }, ref) => {
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length > 11) val = val.slice(0, 11);
      
      // Simple masking (99) 99999-9999
      if (val.length > 2) {
        val = `(${val.slice(0, 2)}) ${val.slice(2)}`;
      }
      if (val.length > 9) {
        val = `${val.slice(0, 9)}-${val.slice(9)}`;
      }
      
      e.target.value = val;
      if (onChange) onChange(e);
    };

    return (
      <Input
        {...props}
        ref={ref}
        value={value}
        onChange={handleChange}
        type="tel"
        id={id}
        placeholder={placeholder}
        error={error}
        maxLength={15}
      />
    );
  }
);

PhoneInput.displayName = 'PhoneInput';
