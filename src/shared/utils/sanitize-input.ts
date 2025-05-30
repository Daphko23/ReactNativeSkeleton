/**
 * @file Utility-Funktionen für Input-Sanitization
 */

/**
 * Bereinigt Benutzereingaben von gefährlichen Zeichen
 * @param input - Der zu bereinigende String
 * @returns Bereinigter String
 */
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return (
    input
      .trim() // Entferne führende/trailing Leerzeichen
      .replace(/[<>]/g, '') // Entferne HTML-Zeichen
      // eslint-disable-next-line no-control-regex
      .replace(/[\u0000-\u001F\u007F]/g, '') // Entferne Kontrolzeichen
      .slice(0, 500)
  ); // Begrenze Länge
};

/**
 * Bereinigt numerische Eingaben
 * @param input - Der zu bereinigende String
 * @returns Nur Ziffern oder leerer String
 */
export const sanitizeNumericInput = (input: string): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return input.replace(/[^\d]/g, ''); // Nur Ziffern erlauben
};

/**
 * Bereinigt Email-Eingaben
 * @param input - Der zu bereinigende String
 * @returns Bereinigter Email-String
 */
export const sanitizeEmailInput = (input: string): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    .toLowerCase()
    .replace(/[^\w@.-]/g, '') // Nur erlaubte Email-Zeichen
    .slice(0, 254); // RFC-konforme Email-Länge
};
