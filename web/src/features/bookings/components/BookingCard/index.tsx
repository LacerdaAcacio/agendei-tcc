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
} from "@/components/ui/alert-dialog";
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
    handleCancelBooking
  } = useBookingCard(booking);

  return (
    <>
      <Card className="flex flex-col overflow-hidden hover:shadow-md transition-shadow bg-white dark:bg-slate-900 border dark:border-slate-800">
        <div className="flex flex-col md:flex-row p-4 gap-4">
          {/* Left: Image */}
          <Link to={`/services/${service.id}`} className="shrink-0">
            <img 
              src={service.images?.[0] || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80'} 
              alt={service.title}
              className="w-32 h-32 object-cover rounded-lg bg-gray-100 dark:bg-slate-800"
            />
          </Link>

          {/* Middle: Info */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <Link to={`/services/${service.id}`} className="hover:underline">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{service.title}</h3>
                </Link>
                <Badge className={`${statusColors[status]} border-none`}>
                  {statusLabels[status]}
                </Badge>
              </div>

              <div className="space-y-1 mt-2">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                  <CalendarIcon className="w-4 h-4 text-gray-400" />
                  <span>{dateRange}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{timeRange}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-4">
              <Avatar className="w-6 h-6">
                <AvatarImage src={service.provider?.profileImage || service.provider?.avatarUrl} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {(service.provider?.name || 'A').substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-700 dark:text-slate-300">
                {service.provider?.name || 'Anfitrião'}
              </span>
            </div>
          </div>

          {/* Right: Price & Actions (Desktop) */}
          <div className="flex flex-col justify-between items-end min-w-[140px]">
            <div className="text-right">
              <span className="text-xs text-gray-500 dark:text-slate-400 block">Total pago</span>
              <span className="font-bold text-lg">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-gray-50 dark:bg-slate-800/50 px-4 py-3 border-t dark:border-slate-800 flex justify-end gap-3">
          {status === 'CANCELLED' ? (
            <span className="text-sm text-gray-500 italic">Reserva cancelada</span>
          ) : status === 'COMPLETED' ? (
            <Button 
              variant="default" 
              className="bg-gray-900 hover:bg-gray-800 text-white"
              onClick={() => setIsReviewModalOpen(true)}
            >
              Avaliar Serviço
            </Button>
          ) : (status === 'CONFIRMED' || status === 'PENDING') ? (
            <>
              <Button 
                variant="outline" 
                className="border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800"
                onClick={() => onEdit?.(booking)}
              >
                Editar Reserva
              </Button>
              <Button 
                variant="outline" 
                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
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
              Tem certeza que deseja cancelar esta reserva? Esta ação não pode ser desfeita e o reembolso seguirá a política de cancelamento do serviço.
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
              {isCancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sim, cancelar reserva'}
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
