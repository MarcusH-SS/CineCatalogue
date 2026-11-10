import { env } from '../config/env';
import { Movie } from '../types/movie';
import { getJson } from './http';

const BASE = 'https://api.themoviedb.org/3';
const IMG = 'https://image.tmdb.org/t/p';

interface TmdbMovie {
  id: number;
  title: string;
  release_date?: string;
  poster_path: string | null;
  overview: string;
}

/** API 1 — TMDB: devolve TODOS os resultados da busca (1ª página, até 20 filmes). */
export async function searchMovies(query: string): Promise<Movie[]> {
  if (!env.tmdbApiKey) {
    throw new Error('Chave da TMDB ausente. Defina EXPO_PUBLIC_TMDB_API_KEY no arquivo .env.');
  }
  const url =
    `${BASE}/search/movie?api_key=${env.tmdbApiKey}` +
    `&query=${encodeURIComponent(query)}&language=pt-BR`;

  const { status, data } = await getJson<{ results?: TmdbMovie[] }>(url);
  if (status === 401) throw new Error('Chave da TMDB inválida.');
  if (status !== 200) throw new Error(`Falha ao consultar a TMDB (HTTP ${status}).`);

  const results = data?.results ?? [];
  if (results.length === 0) throw new Error(`Nenhum filme encontrado para "${query}".`);

  return results.map((m) => ({
    id: m.id,
    title: m.title,
    year: m.release_date ? m.release_date.slice(0, 4) : null,
    thumbUrl: m.poster_path ? `${IMG}/w185${m.poster_path}` : null,
    posterUrl: m.poster_path ? `${IMG}/w500${m.poster_path}` : null,
    overview: m.overview?.trim() ?? '',
  }));
}
