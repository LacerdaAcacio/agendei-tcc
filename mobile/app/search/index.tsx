import DateTimePicker from '@react-native-community/datetimepicker';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Check, ChevronDown, MapPin, Search, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedButton } from '@/components';
import { useCategories } from '@/hooks/useCategories';
import { useServices } from '@/hooks/useServices';
import { NominatimResult, searchAddress } from '@/lib/address';
import type { Category } from '@/types';

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { categories } = useCategories();
  
  // Search State
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState<{ lat: string; lon: string } | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  // UI State
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<NominatimResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const [isSearching, setIsSearching] = useState(false);

  // Debounce logic for address search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (location.length > 2 && showSuggestions) {
        setIsSearchingAddress(true);
        const results = await searchAddress(location);
        setAddressSuggestions(results);
        setIsSearchingAddress(false);
      } else if (location.length === 0) {
        setAddressSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [location, showSuggestions]);

  // Results Query
  const { services, isLoading } = useServices({
    search: isSearching ? keyword : undefined,
    location: isSearching ? location : undefined,
    date: isSearching && date ? date.toISOString() : undefined,
    category: isSearching && selectedCategory ? selectedCategory.slug : undefined,
  });

  const handleSearch = () => {
    setIsSearching(true);
    setShowSuggestions(false);
    
    const params = new URLSearchParams();
    if (keyword) params.append('search', keyword);
    if (location) params.append('location', location);
    if (coordinates) {
      params.append('lat', coordinates.lat);
      params.append('lon', coordinates.lon);
    }
    if (date) params.append('date', date.toISOString());
    if (selectedCategory) params.append('category', selectedCategory.slug);
    
    router.push(`/(tabs)?${params.toString()}`);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleLocationSelect = (item: NominatimResult) => {
    setLocation(item.display_name.split(',')[0]); // Use shorter name
    setCoordinates({ lat: item.lat, lon: item.lon });
    setShowSuggestions(false);
  };

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View 
        className="bg-primary px-6 pb-6 rounded-b-3xl shadow-lg z-10"
        style={{ paddingTop: insets.top + 10 }}
      >
        <View className="flex-row items-center gap-4 mb-6">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full bg-white/20"
          >
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">Buscar Serviços</Text>
        </View>

        <View className="gap-4 z-20">
          {/* Keyword Input */}
          <View className="flex-row items-center gap-3 rounded-xl bg-white p-3">
            <Search size={20} color="#64748b" />
            <TextInput
              className="flex-1 text-base text-foreground"
              placeholder="O que você procura?"
              placeholderTextColor="#94a3b8"
              value={keyword}
              onChangeText={setKeyword}
            />
            {keyword.length > 0 && (
              <TouchableOpacity onPress={() => setKeyword('')}>
                <X size={16} color="#94a3b8" />
              </TouchableOpacity>
            )}
          </View>

          {/* Location Input (Autocomplete) */}
          <View className="relative z-30">
            <View className="flex-row items-center gap-3 rounded-xl bg-white p-3">
              <MapPin size={20} color="#64748b" />
              <TextInput
                className="flex-1 text-base text-foreground"
                placeholder="Onde? (Rua, Bairro, Cidade)"
                placeholderTextColor="#94a3b8"
                value={location}
                onChangeText={(text) => {
                  setLocation(text);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />
              {isSearchingAddress ? (
                <ActivityIndicator size="small" color="#4f46e5" />
              ) : location.length > 0 ? (
                <TouchableOpacity onPress={() => {
                  setLocation('');
                  setCoordinates(null);
                  setAddressSuggestions([]);
                }}>
                  <X size={16} color="#94a3b8" />
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Suggestions List */}
            {showSuggestions && addressSuggestions.length > 0 && (
              <View className="absolute top-full mt-2 w-full overflow-hidden rounded-xl bg-white shadow-xl dark:bg-card-dark">
                {addressSuggestions.map((item: NominatimResult) => (
                  <TouchableOpacity
                    key={item.place_id}
                    onPress={() => handleLocationSelect(item)}
                    className="border-b border-border p-3 last:border-0 dark:border-border-dark"
                  >
                    <Text className="font-medium text-foreground dark:text-foreground-dark">
                      {item.display_name.split(',')[0]}
                    </Text>
                    <Text className="text-xs text-muted-foreground" numberOfLines={1}>
                      {item.display_name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View className="flex-row gap-4 -z-10">
            {/* Date Input */}
            <TouchableOpacity 
              className="flex-1 flex-row items-center gap-3 rounded-xl bg-white p-3"
              onPress={() => setShowDatePicker(true)}
            >
              <Calendar size={20} color="#64748b" />
              <Text className={`text-base ${date ? 'text-foreground' : 'text-slate-400'}`}>
                {date ? date.toLocaleDateString('pt-BR') : 'Quando?'}
              </Text>
            </TouchableOpacity>

            {/* Category Picker Trigger */}
            <TouchableOpacity 
              className="flex-1 flex-row items-center justify-between rounded-xl bg-white p-3"
              onPress={() => setShowCategoryModal(true)}
            >
              <Text className={`text-base ${selectedCategory ? 'text-foreground' : 'text-slate-400'}`} numberOfLines={1}>
                {selectedCategory ? selectedCategory.name : 'Categoria'}
              </Text>
              <ChevronDown size={16} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ThemedButton 
            title="Buscar Serviços" 
            onPress={handleSearch}
            isLoading={isLoading}
          />
        </View>
      </View>

      {/* Results (Optional Preview) */}
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }} className="-z-20">
        {/* We can show recent searches or popular categories here if not searching */}
        {!isSearching && (
          <View>
            <Text className="mb-4 text-lg font-bold text-foreground dark:text-foreground-dark">
              Categorias Populares
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {categories.slice(0, 6).map((cat: Category) => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => {
                    setSelectedCategory(cat);
                    // Optionally trigger search immediately
                  }}
                  className="rounded-full border border-border bg-card px-4 py-2 dark:border-border-dark dark:bg-card-dark"
                >
                  <Text className="text-sm font-medium text-foreground dark:text-foreground-dark">
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={date || new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}

      {/* Category Modal */}
      <Modal
        visible={showCategoryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="h-[70%] rounded-t-3xl bg-background dark:bg-background-dark">
            <View className="flex-row items-center justify-between border-b border-border px-6 py-4 dark:border-border-dark">
              <Text className="text-lg font-bold text-foreground dark:text-foreground-dark">
                Selecione uma Categoria
              </Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)} className="p-2">
                <X size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            
            <ScrollView contentContainerStyle={{ padding: 24 }}>
              <TouchableOpacity
                onPress={() => {
                  setSelectedCategory(null);
                  setShowCategoryModal(false);
                }}
                className={`mb-3 flex-row items-center justify-between rounded-xl border p-4 ${
                  !selectedCategory
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card dark:border-border-dark dark:bg-card-dark'
                }`}
              >
                <Text className={`font-medium ${!selectedCategory ? 'text-primary' : 'text-foreground dark:text-foreground-dark'}`}>
                  Todas as Categorias
                </Text>
                {!selectedCategory && <Check size={20} color="#4f46e5" />}
              </TouchableOpacity>

              {categories.map((cat: Category) => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => {
                    setSelectedCategory(cat);
                    setShowCategoryModal(false);
                  }}
                  className={`mb-3 flex-row items-center justify-between rounded-xl border p-4 ${
                    selectedCategory?.id === cat.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-card dark:border-border-dark dark:bg-card-dark'
                  }`}
                >
                  <Text className={`font-medium ${selectedCategory?.id === cat.id ? 'text-primary' : 'text-foreground dark:text-foreground-dark'}`}>
                    {cat.name}
                  </Text>
                  {selectedCategory?.id === cat.id && <Check size={20} color="#4f46e5" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
