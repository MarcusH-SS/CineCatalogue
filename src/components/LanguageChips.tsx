import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LANGUAGES } from '../constants/languages';
import { colors, radius, spacing } from '../theme';
import { Language } from '../types/movie';

interface Props {
  value: Language;
  onChange: (lang: Language) => void;
}

export function LanguageChips({ value, onChange }: Props) {
  return (
    <>
      <Text style={styles.label}>Traduzir para</Text>
      <View style={styles.chips}>
        {LANGUAGES.map((lang) => {
          const active = lang.code === value.code;
          return (
            <TouchableOpacity
              key={lang.code}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onChange(lang)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{lang.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  label: { color: colors.accent, fontSize: 14, fontWeight: '600', marginBottom: spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl },
  chip: { backgroundColor: colors.surface, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: spacing.sm },
  chipActive: { backgroundColor: colors.accent },
  chipText: { color: colors.textSoft, fontSize: 14 },
  chipTextActive: { color: colors.background, fontWeight: '700' },
});
