/* @jsxImportSource solid-js */

import { arrayRemove, arrayUnion } from "firebase/firestore";
import { Show } from "solid-js";
import { updateSheet } from "../../../data/firestore";
import { sheetSignal } from "../../../data/signals";
import type { Asset, RealEstateAsset } from "../../../data/types";

export default function Asset(props: { asset: Asset }) {
  const [sheet] = sheetSignal;

  const modalId = () => `sell-asset-modal-${props.asset.id}`;

  let amountRef!: HTMLInputElement;
  let closeRef!: HTMLLabelElement;

  const resetForm = () => {
    setTimeout(() => {
      amountRef.value = "0";
    }, 150);
  };

  const handleSell = () => {
    const amount = parseInt(amountRef.value);
    const cash = sheet()!.current.cash;

    const income = (() => {
      switch (props.asset.type) {
        case "other":
          return amount;
        case "realEstate":
          return amount - props.asset.mortgage;
        default:
          return 0;
      }
    })();

    updateSheet(sheet()!.id, {
      "current.cash": cash + income,
      "current.assets": arrayRemove(props.asset),
      history: arrayUnion(
        `${new Date().toISOString()}: Sold asset ${props.asset.name} for $${
          amountRef.value
        }`
      ),
    });
    closeRef.click();
  };

  return (
    <div class="flex flex-row justify-between items-center p-4 bg-white shadow-lg rounded-lg">
      <div class="flex flex-col gap-1">
        <span class="font-bold">{props.asset.name}</span>
        <span
          class="text-green-600"
          classList={{
            "text-red-400": props.asset.cashflow <= 0,
          }}
        >
          Cashflow: $
          {props.asset.cashflow.toLocaleString("en-us", { currency: "USD" })}
        </span>
        <Show when={props.asset.type === "realEstate"}>
          <span class="text-red-400">
            Mortgage: $
            {(props.asset as RealEstateAsset).mortgage.toLocaleString("en-us", {
              currency: "USD",
            })}
          </span>
        </Show>
      </div>
      <div class="flex flex-col md:flex-row gap-2">
        <label class="btn btn-success btn-outline btn-sm" for={modalId()}>
          Sell
        </label>
      </div>
      <input type="checkbox" id={modalId()} class="modal-toggle" />
      <div class="modal">
        <div class="modal-box">
          <h3 class="font-bold text-lg mb-4">Add New Asset</h3>
          <div class="flex flex-col gap-2">
            <span>Amount</span>
            <input
              type="number"
              class="input input-bordered"
              ref={amountRef}
              value={0}
            />
          </div>
          <div class="modal-action">
            <label
              for={modalId()}
              class="btn btn-primary btn-outline"
              ref={closeRef}
              onClick={resetForm}
            >
              Cancel
            </label>
            <div class="btn btn-primary" onClick={handleSell}>
              Sell
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
