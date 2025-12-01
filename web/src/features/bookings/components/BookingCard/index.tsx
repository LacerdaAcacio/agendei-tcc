import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ReviewModal } from '@/features/bookings/components/ReviewModal';
import { Loader2, Calendar as CalendarIcon, Clock } from 'lucide-react';
import type { BookingCardProps } from './types';
import { statusColors, statusLabels } from './constants';
import { useBookingCard } from './useBookingCard';

export function BookingCard({ booking, onEdit }: BookingCardProps) {
  const {
    id,
    service,
    status,
    totalPrice,
    dateRange,
    timeRange,
    isCancelDialogOpen,
    setIsCancelDialogOpen,
    isReviewModalOpen,
    setIsReviewModalOpen,
    isCancelling,
    handleCancelBooking,
  } = useBookingCard(booking);

  return (
    <>
      <Card className="flex flex-col overflow-hidden border bg-white transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 p-4 md:flex-row">
          {/* Left: Image */}
          <Link to={`/services/${service.id}`} className="shrink-0">
            <img
              src={
                (() => {
                  if (Array.isArray(service.images) && service.images.length > 0) return service.images[0];
                  if (typeof service.images === 'string') {
                    try {
                      const parsed = JSON.parse(service.images);
                      if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
                    } catch { /* empty */ }
                  }
                  return 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80';
                })()
              }
              alt={service.title}
              className="h-32 w-32 rounded-lg bg-gray-100 object-cover dark:bg-slate-800"
            />
          </Link>

          {/* Middle: Info */}
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <Link to={`/services/${service.id}`} className="hover:underline">
                  <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-white">
                    {service.title}
                  </h3>
                </Link>
                <Badge className={`${statusColors[status]} border-none`}>
                  {statusLabels[status]}
                </Badge>
              </div>

              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                  <span>{dateRange}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>{timeRange}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={service.provider?.profileImage || service.provider?.avatarUrl} />
                <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                  {(service.provider?.name || 'A').substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-700 dark:text-slate-300">
                {service.provider?.name || 'Anfitrião'}
              </span>
            </div>
          </div>

          {/* Right: Price & Actions (Desktop) */}
          <div className="flex min-w-[140px] flex-col items-end justify-between">
            <div className="text-right">
              <span className="block text-xs text-gray-500 dark:text-slate-400">Total pago</span>
              <span className="text-lg font-bold">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                  totalPrice,
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-end gap-3 border-t bg-gray-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/50">
          {status === 'CANCELLED' ? (
            <span className="text-sm italic text-gray-500">Reserva cancelada</span>
          ) : status === 'COMPLETED' ? (
            <Button
              variant="default"
              className="bg-gray-900 text-white hover:bg-gray-800"
              onClick={() => setIsReviewModalOpen(true)}
            >
              Avaliar Serviço
            </Button>
          ) : status === 'CONFIRMED' || status === 'PENDING' ? (
            <>
              <Button
                variant="outline"
                className="border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                onClick={() => onEdit?.(booking)}
              >
                Editar Reserva
              </Button>
              <Button
                variant="outline"
                className="border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                onClick={() => setIsCancelDialogOpen(true)}
              >
                Cancelar
              </Button>
            </>
          ) : null}
        </div>
      </Card>

      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar Reserva?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar esta reserva? Esta ação não pode ser desfeita e o
              reembolso seguirá a política de cancelamento do serviço.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>Voltar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleCancelBooking();
              }}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              disabled={isCancelling}
            >
              {isCancelling ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Sim, cancelar reserva'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ReviewModal
        open={isReviewModalOpen}
        onOpenChange={setIsReviewModalOpen}
        bookingId={id}
        serviceTitle={service.title}
      />
    </>
  );
}
