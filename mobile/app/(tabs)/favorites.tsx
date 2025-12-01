import { Heart } from 'lucide-react-native';
import { useState } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';

import { ServiceCard } from '@/components';
import { useWishlist } from '@/hooks/useWishlist';
import type { Service } from '@/types';

export default function FavoritesScreen() {
  const { wishlistServices, isLoading } = useWishlist();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // React Query will automatically refetch
    setTimeout(() => setRefreshing(false), 1000);
  };

  const renderServiceCard = ({ item }: { item: Service }) => (
    <View className="w-1/2 p-2">
      <ServiceCard service={item} />
    </View>
  );

  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center px-6 py-20">
      <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-muted dark:bg-muted-dark">
        <Heart size={40} color="#94a3b8" />
      </View>
      <Text className="mb-2 text-center text-xl font-bold text-foreground dark:text-foreground-dark">
        Nenhum favorito
      </Text>
      <Text className="text-center text-muted-foreground dark:text-muted-foreground">
        Seus serviços favoritos aparecerão aqui
      </Text>
      <Text className="mt-4 text-center text-sm text-muted-foreground dark:text-muted-foreground">
        Toque no ícone de coração em um serviço para adicioná-lo aos favoritos
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <FlatList
        data={wishlistServices}
        renderItem={renderServiceCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerClassName="p-2"
        columnWrapperClassName="flex-row"
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4f46e5"
          />
        }
      />
    </View>
  );
}
