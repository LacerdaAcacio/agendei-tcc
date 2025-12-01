import { X } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

import { useSlots } from '@/hooks/useSlots';
import { formatPrice } from '@/lib/utils';
import { ThemedButton } from './ThemedButton';

// Configure Calendar Locale
LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

interface BookingModalProps {
  visible: boolean;
  onClose: () => void;
  serviceId: string;
  serviceTitle: string;
  price: number;
  onConfirm: (date: string, time: string) => void;
  isRescheduling?: boolean;
  isLoading?: boolean;
}

export function BookingModal({ 
  visible, 
  onClose, 
  serviceId, 
  serviceTitle, 
  price, 
  onConfirm,
  isRescheduling = false,
  isLoading = false
}: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  const { data: slots = [], isLoading: isLoadingSlots } = useSlots(serviceId, selectedDate);

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      onConfirm(selectedDate, selectedTime);
      // Don't close immediately if loading, let parent handle it or close on success
      // But for now we keep behavior consistent
      if (!isLoading) onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="h-[85%] rounded-t-3xl bg-background dark:bg-background-dark">
          {/* Header */}
          <View className="flex-row items-center justify-between border-b border-border px-6 py-4 dark:border-border-dark">
            <View>
              <Text className="text-lg font-bold text-foreground dark:text-foreground-dark">
                {isRescheduling ? 'Reagendar Serviço' : 'Agendar Serviço'}
              </Text>
              <Text className="text-sm text-muted-foreground">
                {serviceTitle}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} className="p-2">
              <X size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
            {/* Calendar */}
            <View className="p-4">
              <Text className="mb-3 text-base font-semibold text-foreground dark:text-foreground-dark">
                {isRescheduling ? 'Selecione a Nova Data' : 'Selecione a Data'}
              </Text>
              <Calendar
                onDayPress={(day: any) => setSelectedDate(day.dateString)}
                markedDates={{
                  [selectedDate]: { selected: true, selectedColor: '#4f46e5' }
                }}
                theme={{
                  backgroundColor: 'transparent',
                  calendarBackground: 'transparent',
                  textSectionTitleColor: '#64748b',
                  selectedDayBackgroundColor: '#4f46e5',
                  selectedDayTextColor: '#ffffff',
                  todayTextColor: '#4f46e5',
                  dayTextColor: '#0f172a',
                  textDisabledColor: '#cbd5e1',
                  arrowColor: '#4f46e5',
                  monthTextColor: '#0f172a',
                  textDayFontWeight: '500',
                  textMonthFontWeight: 'bold',
                  textDayHeaderFontWeight: 'normal',
                }}
                minDate={new Date().toISOString().split('T')[0]}
              />
            </View>

            {/* Time Slots */}
            {selectedDate && (
              <View className="px-6 pb-6">
                <Text className="mb-3 text-base font-semibold text-foreground dark:text-foreground-dark">
                  Horários Disponíveis
                </Text>
                
                {isLoadingSlots ? (
                  <View className="py-8">
                    <ActivityIndicator size="small" color="#4f46e5" />
                  </View>
                ) : (
                  <View className="flex-row flex-wrap gap-3">
                    {slots.map((slot: string) => (
                      <TouchableOpacity
                        key={slot}
                        onPress={() => setSelectedTime(slot)}
                        className={`min-w-[80px] items-center rounded-xl border p-3 ${
                          selectedTime === slot
                            ? 'border-primary bg-primary'
                            : 'border-border bg-card dark:border-border-dark dark:bg-card-dark'
                        }`}
                      >
                        <Text
                          className={`font-medium ${
                            selectedTime === slot
                              ? 'text-white'
                              : 'text-foreground dark:text-foreground-dark'
                          }`}
                        >
                          {slot}
                        </Text>
                      </TouchableOpacity>
                    ))}
                    {slots.length === 0 && (
                      <Text className="text-muted-foreground">Nenhum horário disponível para esta data.</Text>
                    )}
                  </View>
                )}
              </View>
            )}
          </ScrollView>

          {/* Footer */}
          <View className="absolute bottom-0 left-0 right-0 border-t border-border bg-background px-6 py-4 dark:border-border-dark dark:bg-background-dark">
            {!isRescheduling && (
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="text-sm text-muted-foreground">Total Estimado</Text>
                <Text className="text-xl font-bold text-primary">
                  {formatPrice(price)}
                </Text>
              </View>
            )}
            
            <ThemedButton 
              onPress={handleConfirm} 
              disabled={!selectedDate || !selectedTime || isLoading}
              isLoading={isLoading}
            >
              {isRescheduling ? 'Confirmar Reagendamento' : 'Confirmar Agendamento'}
            </ThemedButton>
          </View>
        </View>
      </View>
    </Modal>
  );
}
