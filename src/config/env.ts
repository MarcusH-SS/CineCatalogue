// Único ponto de leitura das variáveis de ambiente (.env, prefixo EXPO_PUBLIC_).
export const env = {
  tmdbApiKey: process.env.EXPO_PUBLIC_TMDB_API_KEY ?? '',
  // Opcional: sobe o limite da MyMemory de 5 mil para 50 mil caracteres/dia
  myMemoryEmail: process.env.EXPO_PUBLIC_MYMEMORY_EMAIL ?? '',
};
