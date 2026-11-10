import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { ErrorBox } from '../components/ErrorBox';
import { LanguageChips } from '../components/LanguageChips';
import { MovieCatalog } from '../components/MovieCatalog';
import { MovieDetail } from '../components/MovieDetail';
import { Screen } from '../components/Screen';
import { SearchBar } from '../components/SearchBar';
import { useMovieSearch } from '../hooks/useMovieSearch';
import { useTranslation } from '../hooks/useTranslation';
import { colors, spacing } from '../theme';

export default function HomeScreen() {
  const search = useMovieSearch();                      // estágio 1: TMDB
  const translation = useTranslation(search.selected);  // estágio 2: MyMemory

  const isIdle = !search.loading && !search.error && search.results.length === 0;

  return (
    <Screen>
      <Text style={styles.heading}>Sinopse em outro idioma</Text>
      <Text style={styles.subheading}>Busque um filme, escolha no catálogo e traduza a sinopse.</Text>

      <SearchBar
        value={search.query}
        onChange={search.setQuery}
        onSubmit={search.run}
        loading={search.loading}
      />
      <LanguageChips value={translation.lang} onChange={translation.setLang} />

      {isIdle && <Text style={styles.hint}>Digite o nome de um filme e toque em Buscar.</Text>}

      {search.loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.hint}>Buscando filmes…</Text>
        </View>
      )}

      {!!search.error && !search.loading && <ErrorBox message={search.error} />}

      {search.results.length > 0 && !search.loading && (
        <>
          <MovieCatalog
            movies={search.results}
            selectedId={search.selected?.id}
            onSelect={search.select}
          />
          {search.selected && (
            <MovieDetail
              movie={search.selected}
              lang={translation.lang}
              translation={translation}
            />
          )}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { color: colors.text, fontSize: 28, fontWeight: '700', marginTop: spacing.md },
  subheading: { color: colors.textSubtle, fontSize: 15, lineHeight: 22, marginTop: spacing.xs, marginBottom: spacing.lg },
  center: { alignItems: 'center', gap: spacing.md, marginTop: spacing.xl },
  hint: { color: colors.textMuted, fontSize: 15, textAlign: 'center' },
});
