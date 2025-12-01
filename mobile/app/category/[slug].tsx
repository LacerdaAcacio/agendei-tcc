import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ServiceCard } from '@/components';
import { useCategories } from '@/hooks/useCategories';
import { useServices } from '@/hooks/useServices';
import { getCategoryIcon } from '@/lib/utils';

export default function CategoryScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const { categories, isLoading: isLoadingCategories } = useCategories();
  
  const category = categories.find(c => c.slug === slug);

  console.log('categories', categories);
  
  const { services, isLoading: isLoadingServices } = useServices({
    category: slug,
  });

  const isLoading = isLoadingCategories || isLoadingServices;

  if (isLoadingCategories) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  if (!category) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
        <Text className="text-foreground dark:text-foreground-dark">Categoria não encontrada.</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-primary">Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const Icon = getCategoryIcon(category.slug);

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View 
        className="bg-primary px-6 pb-6 rounded-b-3xl shadow-lg z-10"
        style={{ paddingTop: insets.top + 10 }}
      >
        <View className="flex-row items-center gap-4 mb-4">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full bg-white/20"
          >
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white capitalize">{category.name}</Text>
        </View>

        <View className="flex-row items-center gap-3">
          <View className="h-12 w-12 items-center justify-center rounded-xl bg-white/20">
            <Icon size={24} color="#ffffff" />
          </View>
          <Text className="flex-1 text-indigo-100 text-sm">
            Encontre os melhores profissionais de {category.name} aqui.
          </Text>
        </View>
      </View>

      {/* Results */}
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        {isLoadingServices ? (
          <ActivityIndicator size="large" color="#4f46e5" />
        ) : services.length === 0 ? (
          <View className="items-center justify-center py-10">
            <Text className="text-center text-muted-foreground">
              Nenhum serviço encontrado nesta categoria.
            </Text>
          </View>
        ) : (
          <View className="gap-4">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
