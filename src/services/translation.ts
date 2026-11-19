import { env } from '../config/env';
import { truncateAtSentence } from '../utils/text';
import { getJson } from './http';

const URL = 'https://api.mymemory.translated.net/get';
const MAX_BYTES = 480; // limite da API: 500 BYTES por consulta (acentos contam 2)

/** API 2 — MyMemory: traduz a sinopse (pt-BR) para o idioma escolhido. */
export async function translateOverview(text: string, targetLang: string): Promise<string> {
  const clean = truncateAtSentence(text.replace(/\s+/g, ' ').trim(), MAX_BYTES);
  const emailParam = env.myMemoryEmail ? `&de=${encodeURIComponent(env.myMemoryEmail)}` : '';
  const url = `${URL}?q=${encodeURIComponent(clean)}&langpair=pt-BR|${targetLang}${emailParam}`;

  const { status, data } = await getJson<{
    responseStatus?: number | string;
    responseDetails?: string;
    responseData?: { translatedText?: string };
  }>(url);

  if (status !== 200) throw new Error(`Falha na API de tradução (HTTP ${status}).`);

  // A MyMemory costuma responder HTTP 200 e sinalizar o erro DENTRO do JSON.
  const apiStatus = Number(data?.responseStatus);
  const translated = data?.responseData?.translatedText?.trim();
  const quotaHit = translated?.toUpperCase().startsWith('MYMEMORY WARNING') || apiStatus === 429;

  if (quotaHit) throw new Error('Limite diário de traduções da MyMemory atingido. Tente amanhã.');
  if (apiStatus !== 200) throw new Error(data?.responseDetails || 'A API de tradução retornou um erro.');
  if (!translated) throw new Error('A API de tradução não retornou texto.');
  return translated;
}
