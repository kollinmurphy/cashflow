/* @jsxImportSource solid-js */

import { arrayUnion } from "firebase/firestore";
import { createSignal } from "solid-js";
import { updateSheet } from "../../../data/firestore";
import { sheetSignal } from "../../../data/signals";
import type { StockAsset } from "../../../data/types";
import ConditionalErrorAlert from "../../ConditionalErrorAlert";

export default function Stock(props: { stock: StockAsset }) {
  const [sheet] = sheetSignal;
  const [error, setError] = createSignal<string | null>(null);

  let sharesRef!: HTMLInputElement;
  let priceRef!: HTMLInputElement;
  let closeRef!: HTMLLabelElement;

  let sellPriceRef!: HTMLInputElement;
  let sellSharesRef!: HTMLInputElement;
  let sellCloseRef!: HTMLLabelElement;

  const buyModalId = () => `buy-stock-modal-${props.stock.name}`;
  const sellModalId = () => `sell-stock-modal-${props.stock.name}`;
  const splitModalId = () => `split-stock-modal-${props.stock.name}`;

  const handleSplit = (factor: number) => {
    const previous = sheet()!.current.stocks[props.stock.name];
    const previousShares = previous?.shares || 0;
    const totalShares = Math.floor(previousShares * factor);
    const avgPrice = (previous?.avgPrice || 0) / factor;

    updateSheet(sheet()!.id, {
      ["current.stocks." + props.stock.name]: {
        name: props.stock.name,
        shares: totalShares,
        avgPrice,
      } as StockAsset,
      history: arrayUnion(
        `${new Date().toISOString()}: Split ${props.stock} by ${factor}x`
      ),
    });
  };

  return (
    <div class="flex flex-col md:flex-row justify-between items-center p-3 bg-white rounded-lg shadow-lg">
      <div class="flex flex-col">
        <span class="font-bold">{props.stock.name}</span>
        <span class="text-gray-400">
          {props.stock.shares} shares (avg. cost $
          {props.stock.avgPrice.toLocaleString("en-us", {
            currency: "USD",
          })}
          )
        </span>
      </div>
      <div class="grid grid-cols-2 w-full md:w-auto md:flex md:flex-row md:justify-between gap-2">
        <label for={splitModalId()} class="btn btn-secondary btn-outline">
          Split
        </label>
        <label class="btn btn-secondary" for={sellModalId()}>
          Sell
        </label>
        <label for={buyModalId()} class="btn btn-primary">
          Buy
        </label>
      </div>

      <input type="checkbox" id={buyModalId()} class="modal-toggle" />
      <div class="modal">
        <div class="modal-box">
          <h3 class="font-bold text-lg mb-4">Add {props.stock.name}</h3>
          <div class="flex flex-col gap-2">
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
              for={buyModalId()}
              class="btn btn-primary btn-outline"
              ref={closeRef}
            >
              Cancel
            </label>
            <button
              class="btn btn-primary"
              onClick={() => {
                const previous = sheet()!.current.stocks[props.stock.name];
                const previousShares = previous?.shares || 0;
                const purchasingShares = parseInt(sharesRef.value);
                const totalShares = purchasingShares + previousShares;
                const price = parseInt(priceRef.value);

                if (!purchasingShares || !price)
                  return setError("Invalid input");

                const totalPrice = purchasingShares * price;
                if (totalPrice > sheet()!.current.cash)
                  return setError("Not enough cash");

                setError(null);

                const avgPrice =
                  (previousShares * (previous?.avgPrice || 0) +
                    purchasingShares * price) /
                  totalShares;
                updateSheet(sheet()!.id, {
                  "current.cash":
                    sheet()!.current.cash - purchasingShares * price,
                  ["current.stocks." + props.stock.name]: {
                    name: props.stock.name,
                    shares: totalShares,
                    avgPrice,
                  } as StockAsset,
                  history: arrayUnion(
                    `${new Date().toISOString()}: Added ${purchasingShares} shares of ${
                      props.stock.name
                    } at $${price} each`
                  ),
                });
                closeRef.click();
              }}
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <input type="checkbox" id={sellModalId()} class="modal-toggle" />
      <div class="modal">
        <div class="modal-box">
          <h3 class="font-bold text-lg mb-4">Sell {props.stock.name}</h3>
          <div class="flex flex-col gap-2">
            <span>Shares</span>
            <input
              type="number"
              class="input input-bordered"
              ref={sellSharesRef}
            />
            <span>Price</span>
            <input
              type="number"
              class="input input-bordered"
              ref={sellPriceRef}
              value={1}
            />
          </div>
          <ConditionalErrorAlert error={error()} />
          <div class="modal-action">
            <label
              for={sellModalId()}
              class="btn btn-primary btn-outline"
              ref={sellCloseRef}
            >
              Cancel
            </label>
            <button
              class="btn btn-primary"
              onClick={() => {
                const previous = sheet()!.current.stocks[props.stock.name];
                const previousShares = previous?.shares || 0;
                const sellingShares = parseInt(sellSharesRef.value);
                const totalShares = previousShares - sellingShares;
                const price = parseInt(sellPriceRef.value);

                if (!sellingShares || !price) return setError("Invalid input");

                if (totalShares < 0) return setError("Not enough shares");

                const moneyReceived = sellingShares * price;

                setError(null);
                const avgPrice = previous?.avgPrice || 0;
                updateSheet(sheet()!.id, {
                  "current.cash": sheet()!.current.cash + moneyReceived,
                  ["current.stocks." + props.stock.name]: {
                    name: props.stock.name,
                    shares: totalShares,
                    avgPrice,
                  } as StockAsset,
                  history: arrayUnion(
                    `${new Date().toISOString()}: Sold ${sellingShares} shares of ${
                      props.stock.name
                    } at $${price} each`
                  ),
                });
                sellCloseRef.click();
              }}
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <input type="checkbox" id={splitModalId()} class="modal-toggle" />
      <div class="modal">
        <div class="modal-box">
          <h3 class="font-bold text-lg mb-4">Split {props.stock.name}</h3>
          <div class="modal-action">
            <label for={splitModalId()} class="btn btn-primary btn-outline">
              Cancel
            </label>
            <label
              for={splitModalId()}
              class="btn btn-error"
              onClick={() => handleSplit(0.5)}
            >
              Reverse Split
            </label>
            <label
              for={splitModalId()}
              class="btn btn-primary"
              onClick={() => handleSplit(2)}
            >
              Split
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
