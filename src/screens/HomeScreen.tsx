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
import { useFavorites } from '../hooks/useFavorites';
import { auth } from '../services/firebase';
import { Ionicons } from '@expo/vector-icons';

interface HomeScreenProps {
  onOpenFavorites: () => void;
}

export default function HomeScreen({ onOpenFavorites }: HomeScreenProps) {
  const [loggingOut, setLoggingOut] = useState(false);

  const search = useMovieSearch();
  const translation = useTranslation(search.selected);
  const userId = auth.currentUser?.uid;
  const { toggleFavorite, isFavorite } = useFavorites(userId);

  const isIdle =
    !search.loading &&
    !search.error &&
    search.results.length === 0;

  async function handleLogout() {
    try {
      setLoggingOut(true);
      await logoutUser();
    } catch {
      Alert.alert('Erro', 'Não foi possível sair da conta.');
      setLoggingOut(false);
    }
  }

  return (
    <Screen>
      <View style={styles.topBar}>
        <Text style={styles.heading}>Sinopse em outro idioma</Text>

        <View style={styles.topActions}>
          <Pressable
            style={styles.favoritesButton}
            onPress={onOpenFavorites}
          >
            <Ionicons name="heart" size={16} color="#ff4757" />
            <Text style={styles.favoritesText}>Favoritos</Text>
          </Pressable>

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
            <View>
              <MovieDetail
                movie={search.selected}
                lang={translation.lang}
                translation={translation}
              />

              <Pressable
                onPress={() =>
                  userId && search.selected
                    ? toggleFavorite(search.selected)
                    : Alert.alert('Atenção', 'Faça login para favoritar!')
                }
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#222',
                  padding: 12,
                  borderRadius: 8,
                  justifyContent: 'center',
                  marginTop: 10,
                }}
              >
                <Ionicons
                  name={isFavorite(search.selected.id) ? 'heart' : 'heart-outline'}
                  size={24}
                  color={isFavorite(search.selected.id) ? '#ff4757' : '#fff'}
                />
                <Text style={{ color: '#fff', marginLeft: 8, fontWeight: '700' }}>
                  {isFavorite(search.selected.id) ? 'Favorito' : 'Favoritar'}
                </Text>
              </Pressable>
            </View>
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
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  favoritesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: spacing.xs,
  },
  favoritesText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 5,
  },
  logoutButton: {
    backgroundColor: colors.accent,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 8,
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