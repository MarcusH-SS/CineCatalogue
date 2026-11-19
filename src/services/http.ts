/** GET que devolve status + JSON (sem lançar erro em HTTP != 200; quem chama decide). */
export async function getJson<T>(url: string): Promise<{ status: number; data: T | null }> {
  const res = await fetch(url);
  let data: T | null = null;
  try { data = (await res.json()) as T; } catch { /* corpo vazio ou inválido */ }
  return { status: res.status, data };
}
