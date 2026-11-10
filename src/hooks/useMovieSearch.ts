import { useCallback, useState } from 'react';
import { searchMovies } from '../services/tmdb';
import { Movie } from '../types/movie';

/** Estágio 1 do pipeline: busca na TMDB e controla catálogo + filme selecionado. */
export function useMovieSearch() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Movie[]>([]);
  const [selected, setSelected] = useState<Movie | null>(null);

  const run = useCallback(async () => {
    const q = query.trim();
    if (!q) {
      setError('Digite o nome de um filme para buscar.');
      return;
    }
    setLoading(true);
    setError(null);
    setResults([]);
    setSelected(null);

    try {
      const list = await searchMovies(q);
      setResults(list);
      setSelected(list[0]); // seleciona o primeiro; useTranslation reage a essa mudança
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Algo deu errado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [query]);

  return { query, setQuery, loading, error, results, selected, select: setSelected, run };
}
