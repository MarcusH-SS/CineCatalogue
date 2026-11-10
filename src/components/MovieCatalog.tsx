import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius, spacing } from '../theme';
import { Movie } from '../types/movie';

interface Props {
  movies: Movie[];
  selectedId?: number;
  onSelect: (movie: Movie) => void;
}

export function MovieCatalog({ movies, selectedId, onSelect }: Props) {
  const renderItem = ({ item }: { item: Movie }) => {
    const selected = item.id === selectedId;
    return (
      <TouchableOpacity
        style={[styles.item, selected && styles.itemSelected]}
        onPress={() => onSelect(item)}
        accessibilityRole="button"
        accessibilityState={{ selected }}
      >
        {item.thumbUrl ? (
          <Image source={{ uri: item.thumbUrl }} style={styles.thumb} resizeMode="cover" />
        ) : (
          <View style={[styles.thumb, styles.empty]}>
            <Text style={styles.emptyText}>Sem pôster</Text>
          </View>
        )}
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        {item.year && <Text style={styles.year}>{item.year}</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Text style={styles.label}>
        {movies.length} {movies.length === 1 ? 'resultado' : 'resultados'} — toque para escolher
      </Text>
      <FlatList
        data={movies}
        keyExtractor={(m) => String(m.id)}
        renderItem={renderItem}
        extraData={selectedId}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.list}
      />
    </>
  );
}

const styles = StyleSheet.create({
  label: { color: colors.accent, fontSize: 14, fontWeight: '600', marginBottom: spacing.sm },
  list: { marginBottom: spacing.lg, flexGrow: 0 },
  item: { width: 112, marginRight: spacing.md, padding: spacing.xs, borderRadius: radius.md, borderWidth: 2, borderColor: 'transparent' },
  itemSelected: { borderColor: colors.accent, backgroundColor: colors.surface },
  // Proporção 2:3 fixa evita layout shift enquanto as imagens carregam
  thumb: { width: '100%', aspectRatio: 2 / 3, borderRadius: radius.sm, backgroundColor: colors.surface },
  empty: { alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: colors.textMuted, fontSize: 12, textAlign: 'center' },
  title: { color: colors.text, fontSize: 13, fontWeight: '600', marginTop: spacing.xs },
  year: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
});
