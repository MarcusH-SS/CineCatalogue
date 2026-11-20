import { useCallback, useEffect, useState } from 'react';
import {
  addFavoriteMovie,
  getFavoriteMovies,
  removeFavoriteMovie,
} from '../services/favoritesService';
import { Movie } from '../types/movie';

export function useFavorites(userId?: string) {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadFavorites = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const userFavorites = await getFavoriteMovies(userId);
      setFavorites(userFavorites);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (!userId) {
      setFavorites([]);
      setLoading(false);
      return;
    }
    /* eslint-enable react-hooks/set-state-in-effect */

    void loadFavorites();
  }, [loadFavorites, userId]);

  const toggleFavorite = async (movie: Movie) => {
    if (!userId) {
      console.warn('Usuário não autenticado.');
      return;
    }

    const isAlreadyFavorite = favorites.some((fav) => fav.id === movie.id);

    try {
      if (isAlreadyFavorite) {
        await removeFavoriteMovie(userId, movie.id);
        setFavorites((current) => current.filter((fav) => fav.id !== movie.id));
      } else {
        await addFavoriteMovie(userId, movie);
        setFavorites((current) => [...current, movie]);
      }
    } catch (error) {
      console.error('Erro ao alternar favorito:', error);
    }
  };

  const isFavorite = (movieId: number) => {
    return favorites.some((fav) => fav.id === movieId);
  };

  return {
    favorites,
    loading,
    toggleFavorite,
    isFavorite,
    refreshFavorites: loadFavorites,
  };
}