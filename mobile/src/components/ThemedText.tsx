import { Text, type TextProps } from 'react-native';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'subtitle' | 'link' | 'muted';
};

export function ThemedText({ type = 'default', className = '', ...rest }: ThemedTextProps) {
  const baseClasses = 'text-foreground dark:text-foreground-dark';
  
  const typeClasses = {
    default: 'text-base',
    title: 'text-3xl font-bold',
    subtitle: 'text-xl font-semibold',
    link: 'text-primary underline',
    muted: 'text-muted-foreground dark:text-muted-foreground',
  };

  const combinedClassName = `${baseClasses} ${typeClasses[type]} ${className}`;

  return <Text className={combinedClassName} {...rest} />;
}
