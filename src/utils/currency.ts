/**
 * @file currency.ts
 * @description Helper for formatting amounts as New Zealand dollars.
 * @author Samika Perera
 * @date 3 November 2026
 */

/** Shared NZD formatter (en-NZ locale, always two decimal places). */
const nzdFormatter = new Intl.NumberFormat('en-NZ', {
  style: 'currency',
  currency: 'NZD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Formats a number as an NZD amount.
 * @param amount - The amount in NZD.
 * @returns For example "$66.00 NZD".
 */
export function formatNZD(amount: number): string {
  return `${nzdFormatter.format(amount)} NZD`;
}
