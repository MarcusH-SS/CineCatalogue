export interface Language {
  code: string;
  label: string;
}

/** Filme do catálogo (resultado da TMDB já tratado). */
export interface Movie {
  id: number;
  title: string;
  year: string | null;
  thumbUrl: string | null;  // miniatura para o catálogo
  posterUrl: string | null; // pôster grande para o detalhe
  overview: string;         // sinopse original em pt-BR (pode vir vazia)
}

export interface TranslationState {
  text: string | null;
  notice: string | null;
  loading: boolean;
}
