import { useRouter } from 'expo-router';
import { Bell, Search } from 'lucide-react-native';
import { useState } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ServiceCard } from '@/components';
import { useCategories } from '@/hooks/useCategories';
import { useServices } from '@/hooks/useServices';
import { getCategoryIcon } from '@/lib/utils';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Category, Service } from '@/types';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  
  const { services, isLoading: isLoadingServices } = useServices({
    category: selectedCategory,
  });
  
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // React Query will automatically refetch
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleCategoryPress = (slug: string) => {
    if (selectedCategory === slug) {
      setSelectedCategory(undefined); // Toggle off
    } else {
      setSelectedCategory(slug);
    }
  };

  const renderHeader = () => (
    <View 
      className="bg-primary px-6 pb-6"
      style={{ paddingTop: insets.top + 20 }}
    >
      <View className="mb-6 flex-row items-center justify-between">
        <View>
          <Text className="text-sm font-medium text-indigo-100">
            Bem-vindo de volta,
          </Text>
          <Text className="text-2xl font-bold text-white">
            {user?.name || 'Visitante'}
          </Text>
        </View>
        <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-white/20">
          <Bell size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        className="flex-row items-center gap-3 rounded-xl bg-white p-3"
        onPress={() => router.push('/search')}
      >
        <Search size={20} color="#64748b" />
        <Text className="flex-1 text-muted-foreground">
          Buscar serviços...
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderCategories = () => (
    <View className="mt-6">
      <View className="px-6 mb-4 flex-row items-center justify-between">
        <Text className="text-lg font-bold text-foreground dark:text-foreground-dark">
          Categorias
        </Text>
        <TouchableOpacity onPress={() => router.push('/categories')}>
          <Text className="text-sm font-medium text-primary">Ver todas</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-6 gap-4"
      >
        {categories.map((category: Category) => {
          const Icon = getCategoryIcon(category.slug);
          const isSelected = selectedCategory === category.slug;
          
          return (
            <TouchableOpacity
              key={category.id}
              className="items-center gap-2"
              onPress={() => handleCategoryPress(category.slug)}
            >
              <View 
                className={`h-16 w-16 items-center justify-center rounded-2xl ${
                  isSelected ? 'bg-primary' : 'bg-indigo-50 dark:bg-indigo-950/50'
                }`}
              >
                <Icon size={24} color={isSelected ? '#ffffff' : '#4f46e5'} />
              </View>
              <Text 
                className={`text-xs font-medium ${
                  isSelected ? 'text-primary' : 'text-foreground dark:text-foreground-dark'
                }`}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderFeaturedServices = () => (
    <View className="mt-8 px-6">
      <Text className="mb-4 text-lg font-bold text-foreground dark:text-foreground-dark">
        {selectedCategory ? 'Serviços Filtrados' : 'Destaques'}
      </Text>
      {services.length === 0 && !isLoadingServices ? (
        <Text className="text-muted-foreground">Nenhum serviço encontrado.</Text>
      ) : (
        services.slice(0, 5).map((service: Service) => (
          <ServiceCard key={service.id} service={service} />
        ))
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4f46e5"
            progressViewOffset={insets.top}
          />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {renderHeader()}
        {renderCategories()}
        {renderFeaturedServices()}
      </ScrollView>
    </View>
  );
}
