import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useCategories } from '@/hooks/useCategories';
import { getCategoryIcon } from '@/lib/utils';

export default function CategoriesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { categories, isLoading } = useCategories();

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View 
        className="bg-primary px-6 pb-6 rounded-b-3xl shadow-lg z-10"
        style={{ paddingTop: insets.top + 10 }}
      >
        <View className="flex-row items-center gap-4">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full bg-white/20"
          >
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">Todas as Categorias</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        <View className="flex-row flex-wrap gap-4">
          {categories.map((category) => {
            const Icon = getCategoryIcon(category.slug);
            return (
              <TouchableOpacity
                key={category.id}
                className="w-[47%] items-center gap-3 rounded-2xl bg-card dark:bg-card-dark p-4 shadow-sm border border-border dark:border-border-dark"
                onPress={() => router.push(`/category/${category.slug}`)}
              >
                <View className="h-14 w-14 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950/50">
                  <Icon size={24} color="#4f46e5" />
                </View>
                <Text className="text-center text-sm font-medium text-foreground dark:text-foreground-dark">
                  {category.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
