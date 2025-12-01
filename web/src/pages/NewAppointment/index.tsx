import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useNewAppointment } from './useNewAppointment';

export function NewAppointmentPage() {
  const { t, register, handleSubmit, errors, isSubmitting, onSubmit, navigate, minDate } =
    useNewAppointment();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>{t('appointments.new.title')}</CardTitle>
          <CardDescription>{t('appointments.new.description')}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="serviceName">{t('appointments.new.serviceNameLabel')}</Label>
              <Input
                id="serviceName"
                placeholder={t('appointments.new.serviceNamePlaceholder')}
                {...register('serviceName')}
                error={!!errors.serviceName}
              />
              {errors.serviceName && (
                <span className="text-sm text-red-500">{errors.serviceName.message}</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">{t('appointments.new.dateLabel')}</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  min={minDate}
                  {...register('date')}
                  error={!!errors.date}
                />
                {errors.date && <span className="text-sm text-red-500">{errors.date.message}</span>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">{t('appointments.new.durationLabel')}</Label>
                <Input
                  id="duration"
                  type="number"
                  min="15"
                  step="15"
                  {...register('duration')}
                  error={!!errors.duration}
                />
                {errors.duration && (
                  <span className="text-sm text-red-500">{errors.duration.message}</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('appointments.new.descriptionLabelOptional')}</Label>
              <Textarea
                id="description"
                placeholder={t('appointments.new.descriptionPlaceholder')}
                {...register('description')}
                className="dark:border-gray-800 dark:bg-gray-950"
              />
              {errors.description && (
                <span className="text-sm text-red-500">{errors.description.message}</span>
              )}
            </div>

            {errors.root && (
              <div className="text-center text-sm text-red-500">{errors.root.message}</div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate('/')}>
              {t('appointments.new.cancelButton')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? t('appointments.new.submittingButton')
                : t('appointments.new.submitButton')}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
