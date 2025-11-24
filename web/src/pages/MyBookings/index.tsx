import { Header } from '@/components/layout/Header';
import { BookingCard } from '@/features/bookings/components/BookingCard';
import { BookingWidget } from '@/features/bookings/components/BookingWidget';
import { Button } from '@/components/ui/button';
import { Calendar, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Container } from '@/components/ui/container';
import { Typography } from '@/components/ui/typography';
import { useMyBookings } from './useMyBookings';

export function MyBookingsPage() {
  const {
    bookings,
    isLoading,
    editingBooking, // Kept for Dialog functionality
    setEditingBooking, // Kept for Dialog functionality
    isRescheduling,
    handleReschedule, // Kept for Dialog functionality
    handleCancelBooking, // Added from instruction
    handleRescheduleBooking, // Added from instruction
    isCancelling, // Added from instruction
    selectedBookingId // Added from instruction
  } = useMyBookings();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <Header />
      
      <Container as="main" size="md" className="pt-24 pb-10">
        <Typography variant="h1" className="mb-8">Meus Agendamentos</Typography>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        ) : bookings && bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <BookingCard 
                key={booking.id} 
                booking={booking} 
                onEdit={setEditingBooking}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Calendar className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Você ainda não tem nenhum serviço agendado
            </h2>
            <p className="text-gray-500 mb-8 max-w-md">
              Explore nossos serviços e encontre o profissional ideal para o que você precisa.
            </p>
            <Link to="/">
              <Button size="lg" className="gap-2">
                <Search className="w-4 h-4" />
                Encontrar um serviço
              </Button>
            </Link>
          </div>
        )}
      </Container>

      {/* Reschedule Modal */}
      <Dialog open={!!editingBooking} onOpenChange={(open) => !open && setEditingBooking(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Reserva</DialogTitle>
          </DialogHeader>
          
          {editingBooking && (
            <BookingWidget 
              service={editingBooking.service}
              onSubmit={handleReschedule}
              submitLabel="Confirmar Nova Data"
              isSubmitting={isRescheduling}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
