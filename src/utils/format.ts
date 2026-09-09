
//FORMATO DE LA MONEDA 
export function formatPrice(value: number): string {
  const digits = value < 1 ? 4 : 2;
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

//FORMATO VOLUMEN
export function formatCompact(value: number): string {
  return new Intl.NumberFormat("es-ES", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

//FORMATO DEL PORCENTAJE
export function formatPercent(value: number | null): string {
  if (value === null || Number.isNaN(value)) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

//FORMATO DE LA HORA
export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}
