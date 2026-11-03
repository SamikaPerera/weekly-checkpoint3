/**
 * @file GlueSticks.ts
 * @description Concrete decorator that adds Glue Sticks (NZD $25 each) to
 *              the cart.
 * @author Samika Perera
 * @date 3 November 2026
 */

import type { IStationery } from './IStationery';
import { StationeryDecorator } from './StationeryDecorator';

/**
 * GlueSticks (Concrete Decorator).
 *
 * Wraps an IStationery and adds the cost and description of the chosen
 * quantity of Glue Sticks.
 */
export class GlueSticks extends StationeryDecorator {
  /**
   * Price of one unit in NZD. Public so that constants/items.ts can read it,
   * which makes this class the single source of truth for the price.
   */
  public static readonly UNIT_PRICE: number = 25;

  /** Number of units the customer selected. */
  private readonly quantity: number;

  /**
   * @param item - The IStationery object to decorate.
   * @param quantity - Number of units (must be a positive integer).
   * @throws {RangeError} If quantity is not a positive integer.
   */
  public constructor(item: IStationery, quantity: number) {
    super(item);
    StationeryDecorator.validateQuantity(quantity, 'Glue Sticks');
    this.quantity = quantity;
  }

  /**
   * Adds this item's line total to the wrapped object's cost.
   * @returns Wrapped cost + (UNIT_PRICE x quantity), in NZD.
   */
  public override getCost(): number {
    return this.item.getCost() + GlueSticks.UNIT_PRICE * this.quantity;
  }

  /**
   * Appends this item to the wrapped object's description.
   * @returns For example "Cart, Glue Sticks x 3".
   */
  public override getDescription(): string {
    return `${this.item.getDescription()}, Glue Sticks x ${this.quantity}`;
  }
}
