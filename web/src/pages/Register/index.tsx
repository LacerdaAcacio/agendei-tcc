import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PhoneInput } from '@/components/PhoneInput';
import { PasswordStrengthIndicator } from '@/components/PasswordStrengthIndicator';
import { useRegister } from './useRegister';

export function RegisterPage() {
  const { 
    t, 
    register, 
    handleSubmit, 
    errors, 
    isSubmitting, 
    onSubmit, 
    handleDocumentChange, 
    setValue, 
    password 
  } = useRegister();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('auth.register.title')}</CardTitle>
          <CardDescription>{t('auth.register.description')}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('auth.register.nameLabel')}</Label>
              <Input 
                id="name" 
                placeholder={t('auth.register.namePlaceholder')} 
                {...register('name')} 
                error={!!errors.name}
              />
              {errors.name && <span className="text-sm text-red-500">{errors.name.message}</span>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="document">{t('auth.register.documentLabel')}</Label>
              <Input 
                id="document" 
                placeholder={t('auth.register.documentPlaceholder')} 
                {...register('document')}
                onChange={handleDocumentChange}
                error={!!errors.document}
                maxLength={18}
              />
              {errors.document && <span className="text-sm text-red-500">{errors.document.message}</span>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.register.emailLabel')}</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder={t('auth.register.emailPlaceholder')} 
                {...register('email')} 
                error={!!errors.email}
              />
              {errors.email && <span className="text-sm text-red-500">{errors.email.message}</span>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t('auth.register.phoneLabel')}</Label>
              <PhoneInput
                id="phone"
                placeholder={t('auth.register.phonePlaceholder')}
                {...register('phone')}
                onChange={(e) => setValue('phone', e.target.value)}
                error={!!errors.phone}
              />
              {errors.phone && <span className="text-sm text-red-500">{errors.phone.message}</span>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.register.passwordLabel')}</Label>
              <Input 
                id="password" 
                type="password" 
                {...register('password')} 
                error={!!errors.password}
              />
              <PasswordStrengthIndicator password={password} />
              {errors.password && <span className="text-sm text-red-500">{errors.password.message}</span>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('auth.register.confirmPasswordLabel')}</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                {...register('confirmPassword')} 
                error={!!errors.confirmPassword}
              />
              {errors.confirmPassword && <span className="text-sm text-red-500">{errors.confirmPassword.message}</span>}
            </div>
            {errors.root && <div className="text-sm text-red-500 text-center">{errors.root.message}</div>}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? t('common.processing') : t('auth.register.submitButton')}
            </Button>
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              {t('auth.register.hasAccount')} <Link to="/login" className="text-blue-600 hover:underline dark:text-blue-400">{t('auth.register.loginLink')}</Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
