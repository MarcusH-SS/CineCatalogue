import { useEffect, useRef, useState } from 'react';
import { LANGUAGES } from '../constants/languages';
import { translateOverview } from '../services/translation';
import { Language, Movie, TranslationState } from '../types/movie';

const IDLE: TranslationState = { text: null, notice: null, loading: false };

/**
 * Estágio 2 do pipeline: sempre que o filme selecionado ou o idioma muda,
 * a sinopse validada alimenta a MyMemory.
 */
export function useTranslation(movie: Movie | null) {
  const [lang, setLang] = useState<Language>(LANGUAGES[0]);
  const [state, setState] = useState<TranslationState>(IDLE);
  // Cache evita gastar a cota da MyMemory ao reabrir o mesmo filme/idioma
  const cache = useRef<Record<string, string>>({});

  useEffect(() => {
    if (!movie) {
      setState(IDLE);
      return;
    }
    if (!movie.overview) {
      setState({ text: null, notice: 'Este filme não tem sinopse cadastrada na TMDB.', loading: false });
      return;
    }

    const key = `${movie.id}:${lang.code}`;
    const cached = cache.current[key];
    if (cached) {
      setState({ text: cached, notice: null, loading: false });
      return;
    }

    // `cancelled` descarta respostas atrasadas se o usuário trocar de filme/idioma
    let cancelled = false;
    setState({ text: null, notice: null, loading: true });

    translateOverview(movie.overview, lang.code)
      .then((text) => {
        cache.current[key] = text;
        if (!cancelled) setState({ text, notice: null, loading: false });
      })
      .catch((e) => {
        if (cancelled) return;
        const notice = e instanceof Error ? e.message : 'Não foi possível traduzir a sinopse.';
        setState({ text: null, notice, loading: false });
      });

    return () => { cancelled = true; };
  }, [movie, lang]);

  return { lang, setLang, ...state };
}
