/**
 * @file IStationery.ts
 * @description Component interface for the Decorator pattern. Both the
 *              concrete component (BaseCart) and every decorator implement
 *              this interface, so a decorated cart can be used anywhere a
 *              plain cart is expected.
 * @author Samika Perera
 * @date 3 November 2026
 */

/**
 * Common contract shared by the base cart and all stationery decorators.
 */
export interface IStationery {
  /**
   * Calculates the total cost (NZD) of this object, including every
   * object it wraps.
   * @returns The total cost in New Zealand dollars.
   */
  getCost(): number;

  /**
   * Builds a human-readable description of the cart contents.
   * @returns A description such as "Cart, Pens x 3, Pencils x 2".
   */
  getDescription(): string;
}
