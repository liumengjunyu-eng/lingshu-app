/** @v4 - Safe UI reader: prevents undefined crashes at render boundary */
export function safeGet<T>(value: T | undefined | null, fallback: T): T {
  return value === undefined || value === null ? fallback : value;
}
