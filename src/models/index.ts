/**
 * @file index.ts
 * @description Barrel file that re-exports the Decorator pattern interface
 *              and classes, so other modules can import from "../models".
 * @author Samika Perera
 * @date 3 November 2026
 */

export type { IStationery } from './IStationery';
export { BaseCart } from './BaseCart';
export { StationeryDecorator } from './StationeryDecorator';
export { ExerciseBooks } from './ExerciseBooks';
export { Pens } from './Pens';
export { Pencils } from './Pencils';
export { Sharpener } from './Sharpener';
export { GlueSticks } from './GlueSticks';
