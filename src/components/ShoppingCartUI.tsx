/**
 * @file ShoppingCartUI.tsx
 * @description React class component for the stationery shopping cart.
 *              The user ticks items, picks quantities and clicks
 *              "Display Total Cost". The total comes from wrapping a
 *              BaseCart in one decorator per selected item. Once the total
 *              is showing, any change to the selections updates it straight
 *              away (handled in componentDidUpdate).
 * @author Samika Perera
 * @date 3 November 2026
 */

import React from 'react';
import { BaseCart } from '../models';
import type { IStationery } from '../models';
import {
  MAX_QUANTITY,
  MIN_QUANTITY,
  STATIONERY_ITEMS,
} from '../constants/items';
import type { ItemId } from '../constants/items';
import { formatNZD } from '../utils/currency';

/** Props accepted by ShoppingCartUI. */
export interface ShoppingCartUIProps {
  /** Heading and browser tab title. Defaults to "Stationery Shop". */
  readonly title?: string;
}

/** Selection state for one stationery item. */
export interface ItemSelection {
  /** True when the item's checkbox is ticked. */
  readonly selected: boolean;
  /** Quantity chosen in the dropdown (1 to 10). */
  readonly quantity: number;
}

/** Selection state for every item, keyed by item id. */
export type SelectionMap = Readonly<Record<ItemId, ItemSelection>>;

/** State held by ShoppingCartUI. */
export interface ShoppingCartUIState {
  /** Current checkbox and quantity choice for each item. */
  readonly selections: SelectionMap;
  /** True after "Display Total Cost" has been clicked at least once. */
  readonly showTotal: boolean;
  /** Last calculated total cost in NZD. */
  readonly totalCost: number;
  /** Last calculated cart description (from the decorators). */
  readonly summary: string;
}

/** Result of running the decorator chain over the current selections. */
interface CartCalculation {
  /** Total cost in NZD, from cart.getCost(). */
  readonly totalCost: number;
  /** Cart description from cart.getDescription(), or "" when empty. */
  readonly summary: string;
}

/** Fallback title used when no title prop is passed. */
const DEFAULT_TITLE = 'Stationery Shop';

/** Quantity options for the dropdown: [1, 2, ..., 10]. */
const QUANTITY_OPTIONS: readonly number[] = Array.from(
  { length: MAX_QUANTITY - MIN_QUANTITY + 1 },
  (_, index) => MIN_QUANTITY + index,
);

/** Prefix BaseCart puts at the start of every description ("Cart, "). */
const CART_PREFIX = `${new BaseCart().getDescription()}, `;

/**
 * Formats a cart description for display by removing BaseCart's leading
 * "Cart, " (e.g. "Cart, Pens x 3" becomes "Pens x 3").
 * @param description - Description from cart.getDescription().
 * @returns The description without the "Cart, " prefix.
 */
function formatSummary(description: string): string {
  return description.startsWith(CART_PREFIX)
    ? description.slice(CART_PREFIX.length)
    : description;
}

/**
 * Builds the starting selections: nothing ticked, every quantity set to 1.
 * @returns A SelectionMap with one entry per item.
 */
function createInitialSelections(): SelectionMap {
  const selections = {} as Record<ItemId, ItemSelection>;
  for (const item of STATIONERY_ITEMS) {
    selections[item.id] = { selected: false, quantity: MIN_QUANTITY };
  }
  return selections;
}

/**
 * ShoppingCartUI (React class component).
 *
 * Shows the product table and the total. The cost is never added up here
 * directly: it is always the result of the decorator chain.
 */
class ShoppingCartUI extends React.Component<ShoppingCartUIProps, ShoppingCartUIState> {
  /** Tab title before this component mounted, put back on unmount. */
  private previousDocumentTitle = '';

  /**
   * Lifecycle: constructor.
   * Runs once before the first render and sets the initial state:
   * no items ticked, quantity 1 for each, and the total hidden.
   * @param props - Component props.
   */
  public constructor(props: ShoppingCartUIProps) {
    super(props);
    this.state = {
      selections: createInitialSelections(),
      showTotal: false,
      totalCost: 0,
      summary: '',
    };
  }

  /**
   * Lifecycle: componentDidMount.
   * Runs once after the component is first added to the page. Sets the
   * browser tab title and logs that the cart is ready.
   */
  public componentDidMount(): void {
    this.previousDocumentTitle = document.title;
    document.title = this.getTitle();
    console.info('[ShoppingCartUI] Cart ready with', STATIONERY_ITEMS.length, 'items.');
  }

  /**
   * Lifecycle: componentDidUpdate.
   * Runs after every re-render. If the total is already showing and the
   * selections have changed (an item ticked or unticked, or a quantity
   * changed), the total is calculated again so it stays up to date. Only
   * totalCost and summary are changed here, not selections, so this
   * cannot trigger itself in a loop.
   * @param _prevProps - Props before the update (not used).
   * @param prevState - State before the update.
   */
  public componentDidUpdate(
    _prevProps: Readonly<ShoppingCartUIProps>,
    prevState: Readonly<ShoppingCartUIState>,
  ): void {
    const selectionsChanged = prevState.selections !== this.state.selections;
    if (this.state.showTotal && selectionsChanged) {
      this.setState(this.calculateCart(this.state.selections));
    }
  }

  /**
   * Lifecycle: componentWillUnmount.
   * Runs just before the component is removed. Puts the original tab title
   * back and logs the removal.
   */
  public componentWillUnmount(): void {
    document.title = this.previousDocumentTitle;
    console.info('[ShoppingCartUI] Cart unmounted, cleanup complete.');
  }

  /**
   * Gets the title to display.
   * @returns The title prop, or the default title.
   */
  private getTitle(): string {
    return this.props.title ?? DEFAULT_TITLE;
  }

  /**
   * Runs the Decorator pattern over the given selections.
   * Starts with an empty BaseCart and wraps it in the decorator for each
   * ticked item (e.g. cart = new Pens(cart, 3)). Then asks the outermost
   * object for its cost and description.
   * @param selections - The selections to calculate.
   * @returns The total cost and cart description.
   */
  private calculateCart(selections: SelectionMap): CartCalculation {
    let cart: IStationery = new BaseCart();
    let selectedCount = 0;

    for (const item of STATIONERY_ITEMS) {
      const { selected, quantity } = selections[item.id];
      if (selected) {
        // item.decorator is the item's decorator class (ExerciseBooks, Pens,
        // Pencils, Sharpener or GlueSticks), so this is e.g. new Pens(cart, quantity).
        const Decorator = item.decorator;
        cart = new Decorator(cart, quantity);
        selectedCount += 1;
      }
    }

    return {
      totalCost: cart.getCost(),
      summary: selectedCount > 0 ? cart.getDescription() : '',
    };
  }

  /**
   * Updates one item's selection, keeping the others unchanged. A new
   * selections object is created so componentDidUpdate can see the change.
   * @param id - Item to update.
   * @param changes - Fields to change.
   */
  private updateSelection(id: ItemId, changes: Partial<ItemSelection>): void {
    this.setState((prev) => ({
      selections: {
        ...prev.selections,
        [id]: { ...prev.selections[id], ...changes },
      },
    }));
  }

  /**
   * Handles a checkbox change.
   * @param id - Item whose checkbox changed.
   * @param event - The change event.
   */
  private readonly handleToggle = (
    id: ItemId,
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    this.updateSelection(id, { selected: event.target.checked });
  };

  /**
   * Handles a quantity dropdown change.
   * @param id - Item whose quantity changed.
   * @param event - The change event.
   */
  private readonly handleQuantityChange = (
    id: ItemId,
    event: React.ChangeEvent<HTMLSelectElement>,
  ): void => {
    this.updateSelection(id, { quantity: Number(event.target.value) });
  };

  /**
   * Handles the "Display Total Cost" button: calculates the total and turns
   * on live updates.
   */
  private readonly handleDisplayTotal = (): void => {
    this.setState((prev) => ({
      showTotal: true,
      ...this.calculateCart(prev.selections),
    }));
  };

  /**
   * Renders the total section (only after the button has been clicked).
   * @returns The total panel, or null if the button hasn't been clicked.
   */
  private renderTotal(): React.ReactNode {
    const { showTotal, totalCost, summary } = this.state;
    if (!showTotal) {
      return null;
    }

    if (summary === '') {
      return (
        <section className="cart-result cart-result--empty" aria-live="polite">
          <p>Your cart is empty. Tick at least one item to see the total cost.</p>
        </section>
      );
    }

    return (
      <section className="cart-result" aria-live="polite">
        <p className="cart-result__total">Total Cost: {formatNZD(totalCost)}</p>
        <p className="cart-result__summary">
          <strong>Cart contents:</strong> {formatSummary(summary)}
        </p>
      </section>
    );
  }

  /**
   * Renders the item table, the button and the total.
   * @returns The component's JSX.
   */
  public render(): React.ReactNode {
    const { selections } = this.state;

    return (
      <main className="cart">
        <h1 className="cart__title">{this.getTitle()}</h1>
        <p className="cart__intro">
          Tick the items you want, choose a quantity, then click
          &quot;Display Total Cost&quot;.
        </p>

        <table className="cart__table">
          <thead>
            <tr>
              <th scope="col">Select</th>
              <th scope="col">Item</th>
              <th scope="col">Unit Price</th>
              <th scope="col">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {STATIONERY_ITEMS.map((item) => {
              const { selected, quantity } = selections[item.id];
              const checkboxId = `select-${item.id}`;
              return (
                <tr key={item.id} className={selected ? 'is-selected' : undefined}>
                  <td>
                    <input
                      id={checkboxId}
                      type="checkbox"
                      checked={selected}
                      onChange={(event) => this.handleToggle(item.id, event)}
                    />
                  </td>
                  <td>
                    <label htmlFor={checkboxId}>{item.name}</label>
                  </td>
                  <td>{formatNZD(item.price)}</td>
                  <td>
                    <select
                      aria-label={`${item.name} quantity`}
                      value={quantity}
                      disabled={!selected}
                      onChange={(event) => this.handleQuantityChange(item.id, event)}
                    >
                      {QUANTITY_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <button type="button" className="cart__button" onClick={this.handleDisplayTotal}>
          Display Total Cost
        </button>

        {this.renderTotal()}
      </main>
    );
  }
}

export default ShoppingCartUI;
