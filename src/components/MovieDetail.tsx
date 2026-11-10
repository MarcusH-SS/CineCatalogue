import React from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme';
import { Language, Movie, TranslationState } from '../types/movie';

interface Props {
  movie: Movie;
  lang: Language;
  translation: TranslationState;
}

export function MovieDetail({ movie, lang, translation }: Props) {
  return (
    <View style={styles.card}>
      {movie.posterUrl ? (
        <Image source={{ uri: movie.posterUrl }} style={styles.poster} resizeMode="cover" />
      ) : (
        <View style={[styles.poster, styles.empty]}>
          <Text style={styles.emptyText}>Sem pôster</Text>
        </View>
      )}

      <Text style={styles.title}>{movie.title}</Text>

      <Text style={styles.label}>Sinopse original</Text>
      <Text style={styles.body}>{movie.overview || 'Sem sinopse cadastrada.'}</Text>

      <View style={styles.translationBox}>
        <Text style={styles.translationLabel}>Tradução ({lang.label})</Text>
        {translation.loading && <ActivityIndicator color={colors.successAccent} />}
        {translation.text && <Text style={styles.translationBody}>{translation.text}</Text>}
        {translation.notice && <Text style={styles.body}>{translation.notice}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md + 4 },
  poster: { width: '60%', aspectRatio: 2 / 3, alignSelf: 'center', borderRadius: radius.md, backgroundColor: colors.background },
  empty: { alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: colors.textMuted, fontSize: 15 },
  title: { color: colors.text, fontSize: 22, fontWeight: '700', textAlign: 'center', marginVertical: 16 },
  label: { color: colors.accent, fontSize: 14, fontWeight: '600', marginBottom: spacing.sm },
  body: { color: colors.textSoft, fontSize: 15, lineHeight: 23 },
  translationBox: { backgroundColor: colors.successBg, borderRadius: radius.md, padding: 14, marginTop: 18, gap: spacing.xs },
  translationLabel: { color: colors.successAccent, fontSize: 14, fontWeight: '600' },
  translationBody: { color: colors.successText, fontSize: 16, lineHeight: 24 },
});
