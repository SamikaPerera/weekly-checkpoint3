/**
 * @file BaseCart.ts
 * @description Concrete component for the Decorator pattern: an empty
 *              shopping cart that every stationery decorator wraps.
 * @author Samika Perera
 * @date 3 November 2026
 */

import type { IStationery } from './IStationery';

/**
 * BaseCart (Concrete Component).
 *
 * Represents an empty cart. It costs nothing and is always the innermost
 * object in the decorator chain, e.g.
 * `new Pens(new Pencils(new BaseCart(), 2), 3)`.
 */
export class BaseCart implements IStationery {
  /**
   * An empty cart has no cost.
   * @returns Always 0.
   */
  public getCost(): number {
    return 0;
  }

  /**
   * Starting text that each decorator appends to.
   * @returns The string "Cart".
   */
  public getDescription(): string {
    return 'Cart';
  }
}
