/**
 * @file StationeryDecorator.ts
 * @description Abstract decorator for the Decorator pattern. It holds a
 *              reference to the IStationery object it wraps and passes
 *              calls through to it by default.
 * @author Samika Perera
 * @date 3 November 2026
 */

import type { IStationery } from './IStationery';

/**
 * StationeryDecorator (Abstract Decorator).
 *
 * Implements IStationery and wraps another IStationery. Concrete decorators
 * extend this class and override getCost() / getDescription() to add their
 * own price and text on top of the wrapped object's result.
 */
export abstract class StationeryDecorator implements IStationery {
  /** The wrapped component (a BaseCart or another decorator). */
  protected readonly item: IStationery;

  /**
   * @param item - The IStationery object being decorated.
   */
  protected constructor(item: IStationery) {
    this.item = item;
  }

  /**
   * Checks that a quantity is a positive whole number.
   * Concrete decorators call this from their constructors.
   * @param quantity - The quantity to check.
   * @param itemName - Item name used in the error message.
   * @throws {RangeError} If quantity is not a positive integer.
   */
  protected static validateQuantity(quantity: number, itemName: string): void {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new RangeError(
        `${itemName} quantity must be a positive integer, received: ${quantity}`,
      );
    }
  }

  /**
   * Default behaviour: return the wrapped object's cost.
   * @returns The cost of the wrapped object in NZD.
   */
  public getCost(): number {
    return this.item.getCost();
  }

  /**
   * Default behaviour: return the wrapped object's description.
   * @returns The description of the wrapped object.
   */
  public getDescription(): string {
    return this.item.getDescription();
  }
}
