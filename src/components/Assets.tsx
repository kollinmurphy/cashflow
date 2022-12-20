/* @jsxImportSource solid-js */

import { arrayUnion } from "firebase/firestore";
import { createSignal, For } from "solid-js";
import { v4 as uuid } from "uuid";
import { updateSheet } from "../data/firestore";
import { sheetSignal } from "../data/signals";
import type { Asset } from "../data/types";
import ConditionalErrorAlert from "./ConditionalErrorAlert";

export default function Assets() {
  const [error, setError] = createSignal<string | null>(null);

  const [sheet] = sheetSignal;

  let nameRef!: HTMLInputElement;
  let amountRef!: HTMLInputElement;
  let costRef!: HTMLInputElement;
  let closeRef!: HTMLLabelElement;

  return (
    <div class="border-2 border-black flex flex-col p-4 rounded-lg">
      <div class="flex flex-row justify-between items-center">
        <h3 class="text-2xl font-bold">Assets</h3>
        <label class="btn btn-primary" for="add-asset-modal">
          Add Asset
        </label>
      </div>
      <div class="divider" />
      <div class="flex flex-col">
        <For
          each={sheet()?.current?.assets}
          fallback={
            <div class="flex flex-row justify-between items-center p-3">
              <div class="flex flex-col">
                <span class="font-bold">No assets</span>
              </div>
            </div>
          }
        >
          {(asset, i) => (
            <div
              class="flex flex-row justify-between items-center p-3"
              classList={{
                "border-t-2": i() !== 0,
              }}
            >
              <div class="flex flex-col">
                <span class="font-bold">{asset.name}</span>
                <span class="text-gray-400">${asset.amount}</span>
              </div>
              <div class="flex flex-row gap-2">
                <button
                  class="btn btn-primary btn-outline"
                  onClick={() => {
                    updateSheet(sheet()!.id, {
                      "current.assets": sheet()!.current.assets.filter(
                        (a: Asset) => a.id !== asset.id
                      ),
                      history: arrayUnion(
                        `${new Date().toISOString()}: Removed asset ${
                          asset.name
                        }`
                      ),
                    });
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </For>
      </div>
      <input type="checkbox" id="add-asset-modal" class="modal-toggle" />
      <div class="modal">
        <div class="modal-box">
          <h3 class="font-bold text-lg mb-4">Add New Asset</h3>
          <div class="flex flex-col gap-2">
            <span>Name</span>
            <input class="input input-bordered" ref={nameRef} />
            <span>Monthly Dividend</span>
            <input type="number" class="input input-bordered" ref={amountRef} />
            <span>Cost</span>
            <input
              type="number"
              class="input input-bordered"
              ref={costRef}
              value={0}
            />
          </div>
          <ConditionalErrorAlert error={error()} />
          <div class="modal-action">
            <label
              for="add-asset-modal"
              class="btn btn-primary btn-outline"
              ref={closeRef}
            >
              Cancel
            </label>
            <div
              class="btn btn-primary"
              onClick={() => {
                const cost = parseInt(costRef.value);
                const cash = sheet()!.current.cash;
                if (cost > cash)
                  return setError(
                    `You don't have enough cash to buy this asset. You have $${cash} but this asset costs $${cost}`
                  );
                updateSheet(sheet()!.id, {
                  "current.cash": cash - cost,
                  "current.assets": arrayUnion({
                    id: uuid(),
                    name: nameRef.value,
                    amount: Number(amountRef.value),
                  } as Asset),
                  history: arrayUnion(
                    `${new Date().toISOString()}: Bought asset ${
                      nameRef.value
                    } for $${costRef.value}`
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
