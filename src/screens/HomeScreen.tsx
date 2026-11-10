
import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
} from 'react-native';

import { ErrorBox } from '../components/ErrorBox';
import { LanguageChips } from '../components/LanguageChips';
import { MovieCatalog } from '../components/MovieCatalog';
import { MovieDetail } from '../components/MovieDetail';
import { Screen } from '../components/Screen';
import { SearchBar } from '../components/SearchBar';
import { useMovieSearch } from '../hooks/useMovieSearch';
import { useTranslation } from '../hooks/useTranslation';
import { colors, spacing } from '../theme';
import { logoutUser } from '../services/auth';

export default function HomeScreen() {
  const [loggingOut, setLoggingOut] = useState(false);

  const search = useMovieSearch();
  const translation = useTranslation(search.selected);

  const isIdle =
    !search.loading &&
    !search.error &&
    search.results.length === 0;

  async function handleLogout() {
    try {
      setLoggingOut(true);
      await logoutUser();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível sair da conta.');
      setLoggingOut(false);
    }
  }

  return (
    <Screen>
      <View style={styles.topBar}>
        <Text style={styles.heading}>Sinopse em outro idioma</Text>

        <Pressable
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={loggingOut}
        >
          <Text style={styles.logoutText}>
            {loggingOut ? 'Saindo...' : 'Sair'}
          </Text>
        </Pressable>
      </View>

      <Text style={styles.subheading}>
        Busque um filme, escolha no catálogo e traduza a sinopse.
      </Text>

      <SearchBar
        value={search.query}
        onChange={search.setQuery}
        onSubmit={search.run}
        loading={search.loading}
      />

      <LanguageChips
        value={translation.lang}
        onChange={translation.setLang}
      />

      {isIdle && (
        <Text style={styles.hint}>
          Digite o nome de um filme e toque em Buscar.
        </Text>
      )}

      {search.loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.hint}>Buscando filmes…</Text>
        </View>
      )}

      {!!search.error && !search.loading && (
        <ErrorBox message={search.error} />
      )}

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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  heading: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
    flex: 1,
  },
  logoutButton: {
    backgroundColor: colors.accent,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginLeft: spacing.sm,
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  subheading: {
    color: colors.textSubtle,
    fontSize: 15,
    lineHeight: 22,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  center: {
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  hint: {
    color: colors.textMuted,
    fontSize: 15,
    textAlign: 'center',
  },
});
