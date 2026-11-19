import React from 'react';
import { Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors, radius, spacing } from '../theme';

interface Props {
  value: string;
  onChange: (text: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export function SearchBar({ value, onChange, onSubmit, loading }: Props) {
  const submit = () => {
    Keyboard.dismiss();
    onSubmit();
  };

  return (
    <View style={styles.row}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder="Ex.: Star Wars"
        placeholderTextColor={colors.textMuted}
        returnKeyType="search"
        onSubmitEditing={submit}
        autoCorrect={false}
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.disabled]}
        onPress={submit}
        disabled={loading}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>Buscar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10, marginBottom: spacing.lg },
  input: {
    flex: 1, backgroundColor: colors.surface, color: colors.text, borderRadius: radius.md,
    paddingHorizontal: 16, paddingVertical: 12, fontSize: 16,
  },
  button: { backgroundColor: colors.accent, borderRadius: radius.md, paddingHorizontal: 20, justifyContent: 'center' },
  disabled: { opacity: 0.5 },
  buttonText: { color: colors.background, fontSize: 16, fontWeight: '700' },
});
