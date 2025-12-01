import { useRouter } from 'expo-router';
import {
  Briefcase,
  ChevronRight,
  Edit,
  LogOut,
  ShieldCheck,
  Star,
  User,
} from 'lucide-react-native';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { ThemedButton } from '@/components';
import { useAuthStore } from '@/stores/useAuthStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();
  const isProvider = user?.role === 'provider';

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/login');
          },
        },
      ]
    );
  };

  const handleBecomeProvider = async () => {
    Alert.alert(
      'Tornar-se Prestador',
      'Você deseja se tornar um prestador de serviços?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            // TODO: Call upgrade endpoint
            Alert.alert('Em breve', 'Funcionalidade em desenvolvimento');
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark p-6">
        <Text className="mb-4 text-xl font-semibold text-foreground dark:text-foreground-dark">
          Você não está logado
        </Text>
        <ThemedButton onPress={() => router.push('/login')}>
          Fazer Login
        </ThemedButton>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background dark:bg-background-dark">
      {/* Header com Avatar */}
      <View className="items-center bg-primary px-6 pb-8 pt-12">
        <View className="mb-4 h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-white">
          {user.avatarUrl || user.profileImage ? (
            <Image
              source={{ uri: user.avatarUrl || user.profileImage }}
              className="h-full w-full"
              resizeMode="cover"
            />
          ) : (
            <User size={40} color="#4f46e5" />
          )}
        </View>
        
        <Text className="text-2xl font-bold text-white">{user.name}</Text>
        
        <View className="mt-2 flex-row items-center gap-2 rounded-full bg-white/20 px-3 py-1">
          {isProvider ? (
            <>
              <ShieldCheck size={16} color="#ffffff" />
              <Text className="text-sm font-medium text-white">Prestador</Text>
            </>
          ) : (
            <>
              <User size={16} color="#ffffff" />
              <Text className="text-sm font-medium text-white">Cliente</Text>
            </>
          )}
        </View>
      </View>

      {/* Menu de Opções */}
      <View className="mt-6 px-6">
        {/* Editar Perfil */}
        <TouchableOpacity
          onPress={() => router.push('/modals/edit-profile')}
          className="mb-4 flex-row items-center justify-between rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark p-4"
        >
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Edit size={20} color="#4f46e5" />
            </View>
            <Text className="text-base font-medium text-foreground dark:text-foreground-dark">
              Editar Perfil
            </Text>
          </View>
          <ChevronRight size={20} color="#94a3b8" />
        </TouchableOpacity>

        {/* Meus Serviços (apenas para prestadores) */}
        {isProvider && (
          <TouchableOpacity
            onPress={() => router.push('/provider/my-services')}
            className="mb-4 flex-row items-center justify-between rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark p-4"
          >
            <View className="flex-row items-center gap-3">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Briefcase size={20} color="#4f46e5" />
              </View>
              <Text className="text-base font-medium text-foreground dark:text-foreground-dark">
                Meus Serviços
              </Text>
            </View>
            <ChevronRight size={20} color="#94a3b8" />
          </TouchableOpacity>
        )}

        {/* Sair */}
        <TouchableOpacity
          onPress={handleLogout}
          className="mb-4 flex-row items-center justify-between rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark p-4"
        >
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
              <LogOut size={20} color="#dc2626" />
            </View>
            <Text className="text-base font-medium text-red-600">Sair</Text>
          </View>
          <ChevronRight size={20} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      {/* Card Torne-se Prestador */}
      {!isProvider && (
        <View className="mx-6 mt-8 rounded-xl border border-border dark:border-border-dark bg-gradient-to-br from-indigo-50 to-purple-50 p-6 dark:from-indigo-950 dark:to-purple-950">
          <View className="mb-4 h-12 w-12 items-center justify-center rounded-full bg-primary">
            <Star size={24} color="#ffffff" />
          </View>
          
          <Text className="mb-2 text-xl font-bold text-foreground dark:text-foreground-dark">
            Torne-se um Prestador
          </Text>
          
          <Text className="mb-4 text-muted-foreground dark:text-muted-foreground">
            Ofereça seus serviços e comece a ganhar dinheiro na plataforma
          </Text>
          
          <ThemedButton
            onPress={handleBecomeProvider}
            variant="primary"
            size="md"
          >
            Quero ser Prestador
          </ThemedButton>
        </View>
      )}
    </ScrollView>
  );
}
