/* @jsxImportSource solid-js */

import { Show } from "solid-js";
import { updateSheet } from "../../../data/firestore";
import { sheetSignal } from "../../../data/signals";

export const BOAT_PRICE = 17_000;
export const BOAT_DOWN_PAYMENT = 1_000;
export const BOAT_MONTHLY_PAYMENT = 340;

export const Boat = () => {
  const [sheet] = sheetSignal;

  const purchased = () => sheet()?.current?.boat;
  const purchaseDisabled = () =>
    (sheet()?.current?.cash || 0) < BOAT_DOWN_PAYMENT;
  const payOffDisabled = () => (sheet()?.current?.cash || 0) < BOAT_PRICE;

  return (
    <div class="flex flex-row justify-between items-center p-3 bg-white rounded-lg shadow-lg">
      <div class="flex flex-col items-start">
        <span class="font-bold">Boat</span>
        <Show when={purchased()}>
          <span class="text-red-400">
            ${BOAT_PRICE.toLocaleString("en-us", { currency: "USD" })}
          </span>
        </Show>
      </div>
      <div class="flex">
        <Show
          when={purchased()}
          fallback={
            <button
              class="btn btn-secondary btn-sm"
              disabled={purchaseDisabled()}
              onClick={() => {
                updateSheet(sheet()!.id, {
                  "current.cash": sheet()!.current.cash - BOAT_DOWN_PAYMENT,
                  "current.boat": true,
                });
              }}
            >
              Buy ($1,000)
            </button>
          }
        >
          <button
            class="btn btn-secondary btn-sm"
            disabled={payOffDisabled()}
            onClick={() => {
              updateSheet(sheet()!.id, {
                "current.cash": sheet()!.current.cash - BOAT_PRICE,
                "current.boat": false,
              });
            }}
          >
            Pay Off
          </button>
        </Show>
      </div>
    </div>
  );
};
