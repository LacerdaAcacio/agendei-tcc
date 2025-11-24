import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { BookingWidgetProps } from './types';
import { useBookingWidget } from './useBookingWidget';

export function BookingWidget({ service, onSubmit, submitLabel = 'Reservar', isSubmitting = false }: BookingWidgetProps) {
  const {
    selectedDate,
    selectedTime,
    isCalendarOpen,
    setIsCalendarOpen,
    availableSlots,
    isLoadingSlots,
    isDateDisabled,
    handleDateSelect,
    handleSubmit,
    setSelectedTime
  } = useBookingWidget(service, onSubmit);

  return (
    <div className="space-y-4">
      {/* Date Picker Container */}
      <div className="border border-gray-300 dark:border-slate-700 rounded-lg relative z-50 bg-white dark:bg-slate-800">
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <button 
              type="button"
              className="w-full p-4 text-center hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer focus:outline-none"
            >
              <span className="block text-xs font-bold text-gray-500 dark:text-slate-400 tracking-wider mb-1 uppercase">
                Data e Horário
              </span>
              <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                {selectedDate ? (
                  <span>{format(selectedDate, "d 'de' MMMM", { locale: ptBR })}</span>
                ) : (
                  <span className="text-gray-400">Adicionar data</span>
                )}
                <CalendarIcon className="w-4 h-4 text-gray-500" />
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-auto p-0 z-[60] bg-white dark:bg-slate-900 shadow-xl rounded-xl border-none" 
            align="end" 
          >
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={isDateDisabled}
              initialFocus
              locale={ptBR}
              className="p-4"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className="animate-in fade-in slide-in-from-top-2">
          <div className="text-center w-full block mb-2 text-xs font-bold text-gray-500 tracking-wider uppercase">
            Horário
          </div>
          {isLoadingSlots ? (
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : availableSlots.length > 0 ? (
            <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto pr-1">
              {availableSlots.map((slot: string) => (
                <Button
                  key={slot}
                  variant={selectedTime === slot ? "default" : "outline"}
                  className={cn(
                    "h-9 text-xs",
                    selectedTime === slot && "bg-black text-white hover:bg-gray-800"
                  )}
                  onClick={() => setSelectedTime(slot)}
                >
                  {slot}
                </Button>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-sm text-gray-500 bg-gray-50 rounded-lg border border-dashed">
              Nenhum horário disponível
            </div>
          )}
        </div>
      )}
      
      <Button 
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white dark:text-white font-semibold h-12 text-lg"
        onClick={handleSubmit}
        disabled={isSubmitting || !selectedDate || !selectedTime}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : submitLabel}
      </Button>
      
      <p className="text-center text-xs text-gray-500 dark:text-slate-400">Você ainda não será cobrado</p>
      
      {selectedDate && selectedTime && (
        <div className="space-y-3 pt-2">
          <div className="flex justify-between text-gray-600 dark:text-slate-400">
            <span className="underline">{service.title}</span>
            <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.price)}</span>
          </div>
          <div className="flex justify-between text-gray-600 dark:text-slate-400">
            <span className="underline">Taxa de serviço</span>
            <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.price * 0.12)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white">
            <span>Total</span>
            <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.price * 1.12)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
