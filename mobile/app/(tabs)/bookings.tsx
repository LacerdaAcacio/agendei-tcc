import { addMinutes } from 'date-fns';
import { useRouter } from 'expo-router';
import { Calendar, Edit, PackageOpen, X } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from 'react-native';

import { BookingModal, ThemedButton } from '@/components';
import { useBookings } from '@/hooks/useBookings';
import { formatDateTime, formatPrice, getStatusColor, translateStatus } from '@/lib/utils';
import type { Booking } from '@/types';

export default function BookingsScreen() {
  const router = useRouter();
  const { bookings, isLoading, cancelBooking, rescheduleBooking, isRescheduling } = useBookings();
  const [refreshing, setRefreshing] = useState(false);
  
  // Edit State
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // React Query will automatically refetch
    setTimeout(() => setRefreshing(false), 1000);
  };

  const canModifyBooking = (booking: Booking): boolean => {
    const bookingDate = new Date(booking.startDate);
    const now = new Date();
    return bookingDate > now && booking.status !== 'COMPLETED' && booking.status !== 'CANCELLED';
  };

  const handleCancelPress = (bookingId: string) => {
    Alert.alert(
      "Cancelar Reserva",
      "Tem certeza? Essa ação não pode ser desfeita.",
      [
        { text: "Voltar", style: "cancel" },
        { 
          text: "Sim, cancelar", 
          style: "destructive", 
          onPress: () => cancelBooking(bookingId) 
        }
      ]
    );
  };

  const handleEditPress = (booking: Booking) => {
    setEditingBooking(booking);
    setShowRescheduleModal(true);
    console.log('Editing booking:', booking);
    console.log('Editing booking image:', booking.service.images);
  };

  const handleRescheduleConfirm = async (date: string, time: string) => {
    if (!editingBooking) return;

    const start = new Date(`${date}T${time}:00`);
    const duration = editingBooking.service?.duration || 60;
    const end = addMinutes(start, duration);

    // Call PUT request (rescheduleBooking from hook uses api.put)
    await rescheduleBooking({
      bookingId: editingBooking.id,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    });
    
    setShowRescheduleModal(false);
    setEditingBooking(null);
  };

  const renderBookingCard = ({ item: booking }: { item: Booking }) => {
    const statusColors = getStatusColor(booking.status);
    const isModifiable = canModifyBooking(booking);

    return (
      <TouchableOpacity
        onPress={() => router.push(`/service/${booking.serviceId}`)}
        className="mb-4 overflow-hidden rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark"
        activeOpacity={0.9}
      >
        {/* Service Image */}
        <View className="relative h-32 bg-muted dark:bg-muted-dark">
          {booking.service?.images?.[0] ? (
            <Image
              source={{ 
                uri: Array.isArray(booking.service.images) 
                  ? booking.service.images[0] 
                  : typeof booking.service.images === 'string'
                    ? JSON.parse(booking.service.images)[0]
                    : undefined
              }}
              className="h-full w-full"
              resizeMode="cover"
            />
          ) : (
            <View className="h-full w-full items-center justify-center">
              <PackageOpen size={40} color="#94a3b8" />
            </View>
          )}
          
          {/* Status Badge */}
          <View
            className="absolute right-2 top-2 rounded-full px-3 py-1"
            style={{ backgroundColor: statusColors.bg }}
          >
            <Text className="text-xs font-semibold" style={{ color: statusColors.text }}>
              {translateStatus(booking.status)}
            </Text>
          </View>
        </View>

        {/* Booking Info */}
        <View className="p-4">
          <Text className="text-lg font-bold text-foreground dark:text-foreground-dark">
            {booking.service?.title || 'Serviço'}
          </Text>

          <View className="mt-2 flex-row items-center gap-2">
            <Calendar size={16} color="#64748b" />
            <Text className="text-sm text-muted-foreground dark:text-muted-foreground">
              {formatDateTime(booking.startDate)}
            </Text>
          </View>

          <View className="mt-3 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-primary">
              {formatPrice(booking.totalPrice)}
            </Text>
          </View>

          {/* Actions Footer */}
          {isModifiable && (
            <View className="mt-4 flex-row gap-3 border-t border-border dark:border-border-dark pt-3">
              <ThemedButton
                onPress={() => handleCancelPress(booking.id)}
                variant="outline"
                size="sm"
                className="flex-1 border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900"
              >
                <View className="flex-row items-center justify-center gap-2">
                  <X size={16} color="#dc2626" />
                  <Text className="text-sm font-medium text-red-600">Cancelar</Text>
                </View>
              </ThemedButton>

              <ThemedButton
                onPress={() => handleEditPress(booking)}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <View className="flex-row items-center justify-center gap-2">
                  <Edit size={16} color="#4f46e5" />
                  <Text className="text-sm font-medium text-primary">Editar</Text>
                </View>
              </ThemedButton>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center px-6 py-20">
      <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-muted dark:bg-muted-dark">
        <Calendar size={40} color="#94a3b8" />
      </View>
      <Text className="mb-2 text-center text-xl font-bold text-foreground dark:text-foreground-dark">
        Nenhum agendamento
      </Text>
      <Text className="text-center text-muted-foreground dark:text-muted-foreground">
        Seus agendamentos aparecerão aqui quando você reservar um serviço
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <FlatList
        data={bookings}
        renderItem={renderBookingCard}
        keyExtractor={(item) => item.id}
        contentContainerClassName="p-6 pb-24"
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4f46e5"
          />
        }
      />

      {editingBooking && (
        <BookingModal
          visible={showRescheduleModal}
          onClose={() => {
            setShowRescheduleModal(false);
            setEditingBooking(null);
          }}
          serviceId={editingBooking.serviceId}
          serviceTitle={editingBooking.service?.title || 'Serviço'}
          price={editingBooking.totalPrice}
          onConfirm={handleRescheduleConfirm}
          isRescheduling={true}
          isLoading={isRescheduling}
        />
      )}
    </View>
  );
}
