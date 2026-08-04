/**
 * Formato de texto multilíngue guardado em um único campo, sem precisar
 * de colunas separadas no banco:
 *
 *   [[lang:pt]]
 *   Texto em português aqui.
 *   [[/lang]]
 *   [[lang:en]]
 *   English text here.
 *   [[/lang]]
 *
 * Se o campo não tiver nenhuma tag (conteúdo antigo, criado antes desse
 * sistema), ele é tratado como texto simples e devolvido igual pra
 * qualquer idioma.
 */

export type Lang = 'pt' | 'en';

function extractBlock(raw: string, lang: Lang): string | null {
  const re = new RegExp(`\\[\\[lang:${lang}\\]\\]([\\s\\S]*?)\\[\\[\\/lang\\]\\]`, 'i');
  const match = raw.match(re);
  return match ? match[1].trim() : null;
}

/** Extrai o texto no idioma pedido. Cai para PT, depois pro texto cru. */
export function extractLang(raw: string | null | undefined, lang: Lang): string {
  if (!raw) return '';
  if (!raw.includes('[[lang:')) return raw;

  const wanted = extractBlock(raw, lang);
  if (wanted !== null) return wanted;

  const fallback = extractBlock(raw, 'pt');
  return fallback !== null ? fallback : raw;
}

/** Junta os dois textos no formato salvo no banco. Se EN estiver vazio, salva só o PT puro. */
export function combineLang(pt: string, en: string): string {
  const ptTrim = (pt || '').trim();
  const enTrim = (en || '').trim();

  if (!enTrim) return ptTrim;

  return `[[lang:pt]]\n${ptTrim}\n[[/lang]]\n[[lang:en]]\n${enTrim}\n[[/lang]]`;
}

/** Separa um campo salvo em { pt, en } pra edição no painel. */
export function splitLang(raw: string | null | undefined): { pt: string; en: string } {
  if (!raw) return { pt: '', en: '' };
  if (!raw.includes('[[lang:')) return { pt: raw, en: '' };

  const pt = extractBlock(raw, 'pt') ?? '';
  const en = extractBlock(raw, 'en') ?? '';
  return { pt, en };
}
