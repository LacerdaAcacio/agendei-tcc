import { api } from '@/lib/api';
import { Send, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedButton } from './ThemedButton';

interface ReportModalProps {
  visible: boolean;
  onClose: () => void;
  serviceId: string;
}

export function ReportModal({ visible, onClose, serviceId }: ReportModalProps) {
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (description.trim().length < 3) {
      Alert.alert('Erro', 'A descrição deve ter pelo menos 3 caracteres.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/reports', {
        serviceId,
        reason: 'OTHER',
        description,
      });
      Alert.alert('Sucesso', 'Denúncia enviada com sucesso. Obrigado por ajudar a manter a comunidade segura.');
      setDescription('');
      onClose();
    } catch (error) {
      console.error('Error submitting report:', error);
      Alert.alert('Erro', 'Não foi possível enviar a denúncia. Tente novamente mais tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-end bg-black/50"
      >
        <View className="rounded-t-3xl bg-background p-6 dark:bg-background-dark">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-foreground dark:text-foreground-dark">
              Reportar Serviço
            </Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <X size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <Text className="mb-4 text-sm text-muted-foreground">
            Descreva o motivo da denúncia. Sua identidade será mantida em sigilo.
          </Text>

          <TextInput
            className="mb-6 h-32 rounded-xl border border-border p-4 text-foreground dark:border-border-dark dark:text-foreground-dark"
            placeholder="Ex: Conteúdo inapropriado, fraude, etc."
            placeholderTextColor="#94a3b8"
            multiline
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
          />

          <ThemedButton
            onPress={handleSubmit}
            disabled={isSubmitting}
            isLoading={isSubmitting}
            variant="primary"
          >
            <View className="flex-row items-center gap-2">
              <Send size={20} color="white" />
              <Text className="font-bold text-white">Enviar Denúncia</Text>
            </View>
          </ThemedButton>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
