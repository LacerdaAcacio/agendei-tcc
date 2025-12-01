import { Text, TextInput, type TextInputProps, View } from 'react-native';

export type ThemedInputProps = TextInputProps & {
  label?: string;
  error?: string;
  containerClassName?: string;
};

export function ThemedInput({
  label,
  error,
  className = '',
  containerClassName = '',
  ...rest
}: ThemedInputProps) {
  const inputClasses = `px-4 py-3 rounded-lg border ${
    error 
      ? 'border-destructive' 
      : 'border-input dark:border-input-dark'
  } bg-white dark:bg-card-dark text-foreground dark:text-foreground-dark ${className}`;

  return (
    <View className={`${containerClassName}`}>
      {label && (
        <Text className="mb-2 text-sm font-medium text-foreground dark:text-foreground-dark">
          {label}
        </Text>
      )}
      <TextInput
        className={inputClasses}
        placeholderTextColor="#94a3b8"
        {...rest}
      />
      {error && (
        <Text className="mt-1 text-sm text-destructive">{error}</Text>
      )}
    </View>
  );
}
