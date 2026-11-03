/**
 * @file items.ts
 * @description The single list of stationery items for sale. The UI builds
 *              its rows from this list instead of repeating JSX for each
 *              item, and each entry names the decorator class to use for it.
 *              Prices are read from each decorator's public UNIT_PRICE, so
 *              the decorator class is the single source of truth.
 * @author Samika Perera
 * @date 3 November 2026
 */

import {
  ExerciseBooks,
  GlueSticks,
  Pencils,
  Pens,
  Sharpener,
} from '../models';
import type { IStationery } from '../models';

/** Unique identifier for each stationery item. */
export type ItemId = 'exerciseBooks' | 'pens' | 'pencils' | 'sharpener' | 'glueSticks';

/**
 * Constructor signature shared by every concrete stationery decorator.
 * @param item - The IStationery to wrap.
 * @param quantity - Number of units to add.
 */
export type StationeryDecoratorClass = new (
  item: IStationery,
  quantity: number,
) => IStationery;

/** Describes one product offered by the shop. */
export interface StationeryItem {
  /** Unique key used in component state. */
  readonly id: ItemId;
  /** Display name shown to the customer. */
  readonly name: string;
  /** Unit price in NZD, read from the decorator's UNIT_PRICE (never hard-coded here). */
  readonly price: number;
  /** Decorator class used to add this item to the cart. */
  readonly decorator: StationeryDecoratorClass;
}

/** Lowest quantity the customer can choose. */
export const MIN_QUANTITY = 1;

/** Highest quantity the customer can choose. */
export const MAX_QUANTITY = 10;

/** Every item for sale, in display order. */
export const STATIONERY_ITEMS: readonly StationeryItem[] = [
  { id: 'exerciseBooks', name: 'Exercise Books', price: ExerciseBooks.UNIT_PRICE, decorator: ExerciseBooks },
  { id: 'pens', name: 'Pens', price: Pens.UNIT_PRICE, decorator: Pens },
  { id: 'pencils', name: 'Pencils', price: Pencils.UNIT_PRICE, decorator: Pencils },
  { id: 'sharpener', name: 'Sharpener', price: Sharpener.UNIT_PRICE, decorator: Sharpener },
  { id: 'glueSticks', name: 'Glue Sticks', price: GlueSticks.UNIT_PRICE, decorator: GlueSticks },
];
