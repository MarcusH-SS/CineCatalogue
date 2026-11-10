/** Tamanho em bytes UTF-8 (a MyMemory mede o limite em bytes, não em caracteres). */
export function byteLength(s: string): number {
  let bytes = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c < 0x80) bytes += 1;
    else if (c < 0x800) bytes += 2;
    else if (c >= 0xd800 && c <= 0xdbff) { bytes += 4; i++; } // par substituto (emoji)
    else bytes += 3;
  }
  return bytes;
}

/** Corta o texto no fim de uma frase, sem passar do limite de bytes. */
export function truncateAtSentence(text: string, maxBytes: number): string {
  if (byteLength(text) <= maxBytes) return text;
  let end = text.length;
  while (end > 0 && byteLength(text.slice(0, end)) > maxBytes) end--;
  const slice = text.slice(0, end);
  const lastStop = Math.max(slice.lastIndexOf('. '), slice.lastIndexOf('! '), slice.lastIndexOf('? '));
  return lastStop > 80 ? slice.slice(0, lastStop + 1) : slice;
}
