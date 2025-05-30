/**
 * Repräsentiert das Ergebnis einer Operation, die entweder erfolgreich oder fehlgeschlagen sein kann.
 * Implementiert das Result Pattern für besseres Error Handling.
 */
export interface Result<T> {
  /** Gibt an, ob die Operation erfolgreich war */
  isSuccess: boolean;
  /** Der Wert bei erfolgreicher Operation */
  value?: T;
  /** Der Fehler bei fehlgeschlagener Operation */
  error?: string;
}

/**
 * Factory-Klasse für die Erstellung von Result-Objekten
 */
export class ResultFactory {
  /**
   * Erstellt ein erfolgreiches Result-Objekt
   * @param value - Der Wert des erfolgreichen Ergebnisses
   */
  static success<T>(value: T): Result<T> {
    return {
      isSuccess: true,
      value,
    };
  }

  /**
   * Erstellt ein fehlgeschlagenes Result-Objekt
   * @param error - Der Fehler, der aufgetreten ist
   */
  static failure<T>(error: Error): Result<T> {
    return {
      isSuccess: false,
      error: error.message,
    };
  }
}
