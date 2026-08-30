/**
 * Format numeric value as Myanmar Kyats (MMK) string.
 */
export function formatMMK(value: number): string {
  const safeValue = Number.isFinite(value) ? Math.round(value) : 0;
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(safeValue)} MMK`;
}

/**
 * Format number with thousand separators.
 */
export function formatNumber(value: number): string {
  const safeValue = Number.isFinite(value) ? Math.round(value) : 0;
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(safeValue);
}

/**
 * Format abbreviation like 1,000K or 550K.
 */
export function formatK(value: number): string {
  if (!Number.isFinite(value)) return "0K";
  if (value >= 1_000_000) {
    return `${(value / 1_000).toLocaleString("en-US")}K`;
  }
  return `${Math.round(value / 1_000)}K`;
}
