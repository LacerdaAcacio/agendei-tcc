import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Star } from 'lucide-react-native';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

// Mock reviews data
const MOCK_REVIEWS: Review[] = [
  { id: '1', user: 'Maria Silva', rating: 5.0, comment: 'Excelente serviço! Muito profissional e pontual. O resultado ficou incrível, super recomendo.', date: '2023-10-15' },
  { id: '2', user: 'João Santos', rating: 4.5, comment: 'Gostei bastante, recomendo a todos. O preço é justo e o atendimento é muito bom.', date: '2023-10-10' },
  { id: '3', user: 'Ana Costa', rating: 5.0, comment: 'Superou minhas expectativas. Voltarei a contratar com certeza.', date: '2023-09-28' },
  { id: '4', user: 'Pedro Oliveira', rating: 4.0, comment: 'Bom serviço, mas chegou um pouco atrasado. No geral, valeu a pena.', date: '2023-09-20' },
  { id: '5', user: 'Carla Souza', rating: 5.0, comment: 'Perfeito! Exatamente o que eu precisava.', date: '2023-09-15' },
];

export default function ReviewsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const renderReviewItem = ({ item }: { item: Review }) => (
    <View className="mb-4 rounded-xl border border-border bg-card p-4 dark:border-border-dark dark:bg-card-dark">
      <View className="mb-2 flex-row items-center justify-between">
        <View>
          <Text className="font-bold text-foreground dark:text-foreground-dark">{item.user}</Text>
          <Text className="text-xs text-muted-foreground">
            {format(new Date(item.date), "d 'de' MMMM, yyyy", { locale: ptBR })}
          </Text>
        </View>
        <View className="flex-row items-center gap-1 rounded-lg bg-indigo-50 px-2 py-1 dark:bg-indigo-950">
          <Star size={12} color="#fbbf24" fill="#fbbf24" />
          <Text className="text-xs font-bold text-primary">{item.rating.toFixed(1)}</Text>
        </View>
      </View>
      <Text className="leading-5 text-muted-foreground">
        {item.comment}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View 
        className="border-b border-border bg-background px-6 pb-4 dark:border-border-dark dark:bg-background-dark"
        style={{ paddingTop: insets.top + 10 }}
      >
        <View className="flex-row items-center gap-4">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full bg-muted dark:bg-muted-dark"
          >
            <ArrowLeft size={24} color="#64748b" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-foreground dark:text-foreground-dark">
            Avaliações
          </Text>
        </View>
      </View>

      <FlatList
        data={MOCK_REVIEWS}
        renderItem={renderReviewItem}
        keyExtractor={item => item.id}
        contentContainerClassName="p-6"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
