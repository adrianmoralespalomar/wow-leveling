// El almacenamiento puede no estar disponible (modo privado, datos bloqueados): la app funciona igual sin él.
export function readStoredValue<T>(key: string, fallback: T): T {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue === null ? fallback : (JSON.parse(storedValue) as T);
  } catch {
    return fallback;
  }
}

/** Lee y borra una marca de sessionStorage (sobrevive a una recarga, no a cerrar la pestaña). */
export function takeSessionFlag(key: string): boolean {
  try {
    const isSet = sessionStorage.getItem(key) !== null;
    sessionStorage.removeItem(key);
    return isSet;
  } catch {
    return false;
  }
}

export function setSessionFlag(key: string): void {
  try {
    sessionStorage.setItem(key, '1');
  } catch {
    // Sin almacenamiento de sesión solo se pierde el aviso tras la recarga.
  }
}

export function writeStoredValue(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Sin almacenamiento solo se pierde la preferencia al recargar.
  }
}
