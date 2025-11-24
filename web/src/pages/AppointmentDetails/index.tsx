import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Clock, FileText, User } from 'lucide-react';
import { useAppointmentDetails } from './useAppointmentDetails';

export function AppointmentDetailsPage() {
  const { 
    t, 
    i18n, 
    appointment, 
    isLoading, 
    error, 
    navigate, 
    getStatusVariant, 
    handleCancel, 
    canCancel 
  } = useAppointmentDetails();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-8 w-48 mb-6" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-6">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 dark:bg-gray-900">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600">{t('errors.generic')}</CardTitle>
            <CardDescription>{t('errors.loadFailed')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} className="w-full">
              {t('appointments.details.backButton')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto">
        <Button variant="outline" onClick={() => navigate('/')} className="mb-6">
          ← {t('appointments.details.backButton')}
        </Button>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{appointment.serviceName}</CardTitle>
                <CardDescription className="mt-2">ID: {appointment.id}</CardDescription>
              </div>
              <Badge variant={getStatusVariant(appointment.status)}>
                {t(`appointments.status.${appointment.status}`)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 mt-0.5 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{t('appointments.details.date')}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(appointment.date).toLocaleDateString(i18n.language, {
                      dateStyle: 'full',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 mt-0.5 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{t('appointments.details.date')}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(appointment.date).toLocaleTimeString(i18n.language, {
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 mt-0.5 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{t('appointments.details.duration')}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{appointment.duration} {t('appointments.details.minutes')}</p>
                </div>
              </div>

              {appointment.description && (
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 mt-0.5 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{t('appointments.details.description')}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{appointment.description}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <User className="w-5 h-5 mt-0.5 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">ID</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{appointment.userId}</p>
                </div>
              </div>
            </div>

            {canCancel && appointment.status === 'pending' && (
              <div className="pt-4 border-t dark:border-gray-800">
                <Button variant="destructive" onClick={handleCancel} className="w-full">
                  {t('appointments.new.cancelButton')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
