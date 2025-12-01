import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, type TouchableOpacityProps } from 'react-native';

export type ThemedButtonProps = TouchableOpacityProps & {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
};

export function ThemedButton({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className = '',
  children,
  ...rest
}: ThemedButtonProps) {
  const variantClasses = {
    primary: 'bg-primary active:bg-primary/90',
    secondary: 'bg-secondary dark:bg-secondary-dark active:bg-secondary/90',
    outline: 'border border-border dark:border-border-dark bg-transparent active:bg-accent',
    ghost: 'bg-transparent active:bg-accent',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 rounded-md',
    md: 'px-4 py-3 rounded-lg',
    lg: 'px-6 py-4 rounded-xl',
  };

  const textVariantClasses = {
    primary: 'text-white font-semibold',
    secondary: 'text-secondary-foreground font-semibold',
    outline: 'text-foreground dark:text-foreground-dark font-medium',
    ghost: 'text-foreground dark:text-foreground-dark font-medium',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const buttonClasses = `${variantClasses[variant]} ${sizeClasses[size]} items-center justify-center ${
    disabled || isLoading ? 'opacity-50' : ''
  } ${className}`;

  const textClasses = `${textVariantClasses[variant]} ${textSizeClasses[size]}`;

  return (
    <TouchableOpacity
      className={buttonClasses}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'primary' ? '#ffffff' : '#4f46e5'} />
      ) : typeof children === 'string' ? (
        <Text className={textClasses}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}
