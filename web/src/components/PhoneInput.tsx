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
        //tá apresentando assim: (32) 1-31231231, teria que ser: (32) 13213-1233
        val = `${val.slice(0, 10)}-${val.slice(10)}`;
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
  },
);

PhoneInput.displayName = 'PhoneInput';
