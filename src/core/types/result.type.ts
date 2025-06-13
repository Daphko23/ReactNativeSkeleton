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

/**
 * Result-Klasse mit statischen Methoden (Use Case Pattern)
 * Kompatibel mit Enterprise Use Cases
 */
export class Result {
  public success: boolean;
  public data?: any;
  public error?: string;

  constructor(success: boolean, data?: any, error?: string) {
    this.success = success;
    this.data = data;
    this.error = error;
  }

  /**
   * Erstellt ein erfolgreiches Result
   */
  static success<T>(data: T): Result {
    return new Result(true, data);
  }

  /**
   * Erstellt ein fehlgeschlagenes Result
   */
  static error(error: string): Result {
    return new Result(false, undefined, error);
  }

  /**
   * Prüft ob das Result erfolgreich ist
   */
  isSuccess(): boolean {
    return this.success;
  }

  /**
   * Prüft ob das Result fehlgeschlagen ist
   */
  isError(): boolean {
    return !this.success;
  }
}
