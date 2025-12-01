import { useRouter } from 'expo-router';
import { Heart, MapPin, PackageOpen, Star } from 'lucide-react-native';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import { useWishlist } from '@/hooks/useWishlist';
import { formatPrice } from '@/lib/utils';
import type { Service } from '@/types';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const router = useRouter();
  const { isFavorited, toggleWishlist } = useWishlist();
  const favorited = isFavorited(service.id);

  const handleFavorite = (e: any) => {
    e.stopPropagation();
    toggleWishlist(service.id);
  };

  return (
    <TouchableOpacity
      onPress={() => router.push(`/service/${service.id}`)}
      className="mb-4 overflow-hidden rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark"
      activeOpacity={0.7}
    >
      {/* Image */}
      <View className="relative h-40 bg-muted dark:bg-muted-dark">
        {service.images?.[0] ? (
          <Image
            source={{ uri: service.images[0] }}
            className="h-full w-full"
            resizeMode="cover"
          />
        ) : (
          <View className="h-full w-full items-center justify-center">
            <PackageOpen size={40} color="#94a3b8" />
          </View>
        )}

        {/* Favorite Button */}
        <TouchableOpacity
          onPress={handleFavorite}
          className="absolute right-2 top-2 h-10 w-10 items-center justify-center rounded-full bg-white/90 dark:bg-slate-900/90"
        >
          <Heart
            size={20}
            color={favorited ? '#dc2626' : '#64748b'}
            fill={favorited ? '#dc2626' : 'transparent'}
          />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="p-3">
        <Text
          className="text-base font-bold text-foreground dark:text-foreground-dark"
          numberOfLines={2}
        >
          {service.title}
        </Text>

        <View className="mt-1 flex-row items-center gap-1">
          <MapPin size={14} color="#64748b" />
          <Text
            className="text-xs text-muted-foreground dark:text-muted-foreground"
            numberOfLines={1}
          >
            {service.location}
          </Text>
        </View>

        <View className="mt-2 flex-col items-start gap-1">
          <View className="flex-row items-center gap-1">
            <Star size={14} color="#fbbf24" fill="#fbbf24" />
            <Text className="text-sm font-semibold text-foreground dark:text-foreground-dark">
              {service.rating.toFixed(1)}
            </Text>
            <Text className="text-xs text-muted-foreground dark:text-muted-foreground">
              ({service.reviewCount})
            </Text>
          </View>

          <Text className="mt-2 text-base font-bold text-primary">
            {formatPrice(service.price, service.priceUnit)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
