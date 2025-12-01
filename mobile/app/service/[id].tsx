import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Calendar, ChevronRight, Flag, Heart, MapPin, Share2, Star } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, Linking, ScrollView, Share, Text, TouchableOpacity, View } from 'react-native';
import ImageViewing from 'react-native-image-viewing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BookingModal, ReportModal, ThemedButton } from '@/components';
import { useBookings } from '@/hooks/useBookings';
import { useServiceDetails } from '@/hooks/useServiceDetails';
import { useWishlist } from '@/hooks/useWishlist';
import { formatPrice, getCategoryIcon } from '@/lib/utils';

const { width } = Dimensions.get('window');

export default function ServiceDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isFavorited, toggleWishlist } = useWishlist();
  
  const { data: service, isLoading } = useServiceDetails(id);
  const { createBooking } = useBookings();
  
  const favorited = service ? isFavorited(service.id) : false;

  // Image Carousel State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);

  // Modals State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  if (!service) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
        <Text className="text-foreground dark:text-foreground-dark">Serviço não encontrado.</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-primary">Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const CategoryIcon = getCategoryIcon(service.categorySlug || 'default');
  const images = service.images && service.images.length > 0 
    ? service.images.map(uri => ({ uri })) 
    : [];

  const location = service.address ? `${service.address} - ${service.location}` : service.location;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Confira este serviço: ${service.title} no Agendei!`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleReport = () => {
    setShowReportModal(true);
    console.log('serviceReview', service)
  };

  const handleOpenMap = () => {
    // Open Google Maps or Apple Maps
    const query = encodeURIComponent(location);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
  };

  const handleBookingConfirm = async (date: string, time: string) => {
    try {
      // Safe Date Construction for React Native (Hermes)
      // date is YYYY-MM-DD, time is HH:mm
      const start = new Date(`${date}T${time}:00`);
      const end = new Date(start.getTime() + (service.duration || 60) * 60000);

      const payload = {
        serviceId: service.id,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      };

      console.log('Booking Payload:', payload);

      await createBooking(payload);

      // Alert is handled in the hook
      router.push('/(tabs)/bookings');
    } catch (error) {
      // Error is handled in the hook, but we catch here to prevent crash if needed
      // or we can remove try/catch if hook handles everything.
      // Hook handles Alert, but we might want to keep console error.
      console.error('Error creating booking:', error);
    }
  };

  const renderReviewItem = ({ item }: { item: any }) => (
    <View className="mr-4 w-64 rounded-xl border border-border bg-card p-4 dark:border-border-dark dark:bg-card-dark">
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="font-bold text-foreground dark:text-foreground-dark">{item.user?.name || 'Usuário'}</Text>
        <View className="flex-row items-center gap-1">
          <Star size={12} color="#fbbf24" fill="#fbbf24" />
          <Text className="text-xs font-medium text-foreground dark:text-foreground-dark">{item.rating.toFixed(1)}</Text>
        </View>
      </View>
      <Text className="text-sm text-muted-foreground" numberOfLines={3}>
        {item.comment}
      </Text>
    </View>
  );

  const reviews = service.reviews || [];

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Image Carousel */}
        <View className="relative h-72 w-full bg-muted">
          {images.length > 0 ? (
            <>
              <FlatList
                data={images}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(ev) => {
                  const index = Math.round(ev.nativeEvent.contentOffset.x / width);
                  setCurrentImageIndex(index);
                }}
                renderItem={({ item, index }) => (
                  <TouchableOpacity 
                    activeOpacity={0.9}
                    onPress={() => setIsImageViewVisible(true)}
                  >
                    <Image
                      source={item}
                      style={{ width, height: 288 }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                )}
                keyExtractor={(_, index) => index.toString()}
              />
              {/* Pagination Dots */}
              <View className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-2">
                {images.map((_, index) => (
                  <View
                    key={index}
                    className={`h-2 w-2 rounded-full ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </View>
              
              <ImageViewing
                images={images}
                imageIndex={currentImageIndex}
                visible={isImageViewVisible}
                onRequestClose={() => setIsImageViewVisible(false)}
              />
            </>
          ) : (
            <View className="h-full w-full items-center justify-center bg-indigo-100 dark:bg-indigo-950">
              <CategoryIcon size={64} color="#4f46e5" />
            </View>
          )}

          {/* Header Actions */}
          <View 
            className="absolute left-0 right-0 top-0 flex-row justify-between px-6"
            style={{ paddingTop: insets.top + 10 }}
          >
            <TouchableOpacity 
              onPress={() => router.back()}
              className="h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm"
            >
              <ArrowLeft size={24} color="#0f172a" />
            </TouchableOpacity>

            <View className="flex-row gap-3">
              <TouchableOpacity 
                onPress={handleShare}
                className="h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm"
              >
                <Share2 size={20} color="#0f172a" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => toggleWishlist(service.id)}
                className="h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm"
              >
                <Heart 
                  size={20} 
                  color={favorited ? '#dc2626' : '#0f172a'} 
                  fill={favorited ? '#dc2626' : 'transparent'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

          {/* Content */}
        <View className="px-6 pt-6">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-4">
              <Text className="text-2xl font-bold text-foreground dark:text-foreground-dark">
                {service.title}
              </Text>
              <TouchableOpacity 
                onPress={handleOpenMap}
                className="mt-2 flex-row items-center gap-1"
              >
                <MapPin size={16} color="#4f46e5" />
                <Text className="text-sm font-medium text-primary underline">
                  {location}
                </Text>
              </TouchableOpacity>
            </View>
            <View className="items-end">
              <Text className="text-xl font-bold text-primary">
                {formatPrice(service.price, service.priceUnit)}
              </Text>
              <View className="mt-1 flex-row items-center gap-1">
                <Star size={16} color="#fbbf24" fill="#fbbf24" />
                <Text className="font-semibold text-foreground dark:text-foreground-dark">
                  {service.rating.toFixed(1)}
                </Text>
                <Text className="text-xs text-muted-foreground">
                  ({service.reviewCount})
                </Text>
              </View>
            </View>
          </View>

          {/* Provider Info */}
          <View className="mt-8 flex-row items-center gap-4 border-y border-border dark:border-border-dark py-4">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
              <Text className="text-lg font-bold text-primary">
                {service.providerName?.charAt(0) || 'P'}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-foreground dark:text-foreground-dark">
                {service.providerName || 'Prestador'}
              </Text>
              <Text className="text-xs text-muted-foreground">
                Membro desde 2023
              </Text>
            </View>
            <TouchableOpacity onPress={handleReport} className="p-2">
              <Flag size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* Description */}
          <View className="mt-6">
            <Text className="mb-2 text-lg font-bold text-foreground dark:text-foreground-dark">
              Sobre o serviço
            </Text>
            <Text className="leading-6 text-muted-foreground">
              {service.description}
            </Text>
          </View>

          {/* Reviews */}
          <View className="mt-8">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-foreground dark:text-foreground-dark">
                Avaliações
              </Text>
              {reviews.length > 0 && (
                <TouchableOpacity 
                  className="flex-row items-center gap-1"
                  onPress={() => router.push(`/service/${id}/reviews`)}
                >
                  <Text className="text-sm font-medium text-primary">Ver todas</Text>
                  <ChevronRight size={16} color="#4f46e5" />
                </TouchableOpacity>
              )}
            </View>
            
            {reviews.length > 0 ? (
              <FlatList
                data={reviews}
                renderItem={renderReviewItem}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            ) : (
              <Text className="text-muted-foreground">Nenhuma avaliação ainda.</Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Footer Actions */}
      <View 
        className="absolute bottom-0 left-0 right-0 border-t border-border bg-background px-6 py-4 dark:border-border-dark dark:bg-background-dark"
        style={{ paddingBottom: insets.bottom + 10 }}
      >
        <ThemedButton 
          onPress={() => setShowBookingModal(true)}
        >
          <View className="flex-row items-center gap-2">
            <Calendar size={20} color="white" />
            <Text className="font-bold text-white">Agendar Agora</Text>
          </View>
        </ThemedButton>
      </View>

      {/* Booking Modal */}
      <BookingModal
        visible={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        serviceId={service.id}
        serviceTitle={service.title}
        price={service.price}
        onConfirm={handleBookingConfirm}
      />

      {/* Report Modal */}
      <ReportModal
        visible={showReportModal}
        onClose={() => setShowReportModal(false)}
        serviceId={service.id}
      />
    </View>
  );
}
