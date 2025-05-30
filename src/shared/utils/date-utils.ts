/**
 * @file src/shared/utils/date-utils.ts
 * @description Hilfsfunktionen für die Formatierung und Manipulation von Datumsangaben.
 */

/**
 * Formatiert ein Datum im deutschen Format (dd.mm.yyyy)
 * @param dateString - Das Datum als ISO-String oder anderes gültiges Datumsformat
 * @returns Das formatierte Datum im Format dd.mm.yyyy
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    // Überprüfen ob das Datum gültig ist
    if (isNaN(date.getTime())) {
      return ''; // Bei ungültigem Datum leeren String zurückgeben
    }

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  } catch (error) {
    console.error('Fehler bei der Datumsformatierung:', error);
    return '';
  }
};

/**
 * Formatiert ein Datum mit Zeit im deutschen Format (dd.mm.yyyy, HH:MM)
 * @param dateString - Das Datum als ISO-String oder anderes gültiges Datumsformat
 * @returns Das formatierte Datum mit Zeit
 */
export const formatDateWithTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    // Überprüfen ob das Datum gültig ist
    if (isNaN(date.getTime())) {
      return ''; // Bei ungültigem Datum leeren String zurückgeben
    }

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}.${month}.${year}, ${hours}:${minutes}`;
  } catch (error) {
    console.error('Fehler bei der Datumsformatierung mit Zeit:', error);
    return '';
  }
};

/**
 * Prüft, ob ein Datum in der Vergangenheit liegt
 * @param dateString - Das zu prüfende Datum
 * @returns true wenn das Datum in der Vergangenheit liegt
 */
export const isDateInPast = (dateString: string): boolean => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    return date < now;
  } catch {
    return false;
  }
};

/**
 * Konvertiert ein Datum im Format dd.mm.yyyy zurück zu einem ISO-String
 * @param formattedDate - Datum im Format dd.mm.yyyy
 * @returns Das Datum als ISO-String oder null bei ungültigem Format
 */
export const parseGermanDate = (formattedDate: string): string | null => {
  try {
    const [day, month, year] = formattedDate.split('.');
    if (!day || !month || !year) return null;

    const date = new Date(`${year}-${month}-${day}`);
    if (isNaN(date.getTime())) return null;

    return date.toISOString();
  } catch {
    return null;
  }
};
