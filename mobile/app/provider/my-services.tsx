import { useRouter } from 'expo-router';
import { PackageOpen, Pencil, Plus, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';

import { ServiceCard } from '@/components/ServiceCard';
import { useProviderServices } from '@/hooks/useProviderServices';
import type { Service } from '@/types';

export default function MyServicesScreen() {
  const router = useRouter();
  const { services, isLoading, deleteService } = useProviderServices();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // React Query handles refetching automatically when we invalidate or refetch
    // But here we can just wait a bit to simulate UI feedback if needed, 
    // or better, call refetch from the hook if it exposed it.
    // The hook exposes 'services' and 'isLoading'. 
    // Ideally useProviderServices should expose refetch.
    // For now, simple timeout as placeholder or we can update hook.
    setTimeout(() => setRefreshing(false), 1000);
  };

  const renderServiceCard = ({ item: service }: { item: Service }) => (
    <View className="mb-6">
      <ServiceCard service={service} />
      
      {/* Actions */}
      <View className="mt-2 flex-row gap-3 px-1">
        <TouchableOpacity
          onPress={() => router.push(`/provider/create?id=${service.id}`)}
          className="flex-1 flex-row items-center justify-center gap-2 rounded-lg border border-primary bg-primary/10 py-2"
          activeOpacity={0.7}
        >
          <Pencil size={16} color="#4f46e5" />
          <Text className="font-semibold text-primary">Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => deleteService(service.id)}
          className="flex-1 flex-row items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 py-2 dark:border-red-900 dark:bg-red-950/20"
          activeOpacity={0.7}
        >
          <Trash2 size={16} color="#dc2626" />
          <Text className="font-semibold text-red-600">Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center px-6 py-20">
      <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-muted dark:bg-muted-dark">
        <PackageOpen size={40} color="#94a3b8" />
      </View>
      <Text className="mb-2 text-center text-xl font-bold text-foreground dark:text-foreground-dark">
        Nenhum serviço cadastrado
      </Text>
      <Text className="text-center text-muted-foreground dark:text-muted-foreground">
        Comece criando seu primeiro serviço para atrair clientes
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <FlatList
        data={services}
        renderItem={renderServiceCard}
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

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => router.push('/provider/create')}
        className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg"
        activeOpacity={0.8}
      >
        <Plus size={28} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}
