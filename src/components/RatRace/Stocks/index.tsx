/* @jsxImportSource solid-js */

import { arrayUnion } from "firebase/firestore";
import { createSignal, For } from "solid-js";
import { updateSheet } from "../../../data/firestore";
import { sheetSignal } from "../../../data/signals";
import { StockAsset, StockName } from "../../../data/types";
import ConditionalErrorAlert from "../../ConditionalErrorAlert";
import Stock from "./Stock";

export default function Stocks() {
  const [sheet] = sheetSignal;
  const [error, setError] = createSignal<string | null>(null);

  let nameRef!: HTMLSelectElement;
  let priceRef!: HTMLInputElement;
  let sharesRef!: HTMLInputElement;
  let closeRef!: HTMLLabelElement;

  const stocks = () =>
    Object.keys(sheet()?.current?.stocks || {}).filter(
      (stock) => (sheet()?.current?.stocks[stock as StockName]!.shares || 0) > 0
    );

  return (
    <div class="border-2 border-black flex flex-col p-4 rounded-lg">
      <div class="flex flex-row justify-between items-center">
        <h3 class="text-2xl font-bold">Stocks</h3>
        <label class="btn btn-primary" for="add-stock-modal">
          Add Stock
        </label>
      </div>
      <div class="divider" />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <For
          each={stocks()}
          fallback={<span class="font-bold">No stocks</span>}
        >
          {(stock, i) => (
            <Stock stock={sheet()?.current?.stocks[stock as StockName]!} />
          )}
        </For>
      </div>
      <input type="checkbox" id="add-stock-modal" class="modal-toggle" />
      <div class="modal">
        <div class="modal-box">
          <h3 class="font-bold text-lg mb-4">Add New Stock</h3>
          <div class="flex flex-col gap-2">
            <span>Name</span>
            <select class="select select-bordered" ref={nameRef}>
              <For each={Object.keys(StockName)}>
                {(name) => <option value={name}>{name}</option>}
              </For>
            </select>
            <span>Shares</span>
            <input type="number" class="input input-bordered" ref={sharesRef} />
            <span>Price</span>
            <input
              type="number"
              class="input input-bordered"
              ref={priceRef}
              value={1}
            />
          </div>
          <ConditionalErrorAlert error={error()} />
          <div class="modal-action">
            <label
              for="add-stock-modal"
              class="btn btn-primary btn-outline"
              ref={closeRef}
            >
              Cancel
            </label>
            <div
              class="btn btn-primary"
              onClick={() => {
                const previous =
                  sheet()!.current.stocks[nameRef.value as StockName];
                const previousShares = previous?.shares || 0;
                const purchasingShares = parseInt(sharesRef.value);
                if (!purchasingShares) return setError("Invalid shares");
                const totalShares = purchasingShares + previousShares;
                const price = parseInt(priceRef.value);
                if (!price) return setError("Invalid price");
                const totalPrice = price * purchasingShares;
                if (totalPrice > sheet()!.current.cash)
                  return setError("Not enough cash");
                const avgPrice =
                  (previousShares * (previous?.avgPrice || 0) +
                    purchasingShares * price) /
                  totalShares;
                updateSheet(sheet()!.id, {
                  "current.cash":
                    sheet()!.current.cash - price * purchasingShares,
                  ["current.stocks." + nameRef.value]: {
                    name: nameRef.value,
                    shares: totalShares,
                    avgPrice,
                  } as StockAsset,
                  history: arrayUnion(
                    `${new Date().toISOString()}: Added ${purchasingShares} shares of ${
                      nameRef.value
                    } at $${price} each`
                  ),
                });
                closeRef.click();
              }}
            >
              Add
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
