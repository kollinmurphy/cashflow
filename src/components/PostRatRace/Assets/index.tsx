/* @jsxImportSource solid-js */

import { Icon } from "@iconify-icon/solid";
import { arrayUnion } from "firebase/firestore";
import { createSignal, For } from "solid-js";
import { v4 as uuid } from "uuid";
import { updateSheet } from "../../../data/firestore";
import { sheetSignal } from "../../../data/signals";
import type { OtherAsset } from "../../../data/types";
import ConditionalErrorAlert from "../../ConditionalErrorAlert";
import Asset from "./Asset";

export default function PostRatRaceAssets() {
  const [error, setError] = createSignal<string | null>(null);

  const [sheet] = sheetSignal;

  let nameRef!: HTMLInputElement;
  let cashflowRef!: HTMLInputElement;
  let costRef!: HTMLInputElement;
  let closeRef!: HTMLLabelElement;

  const resetForm = () => {
    setTimeout(() => {
      costRef.value = "0";
      cashflowRef.value = "0";
      nameRef.value = "";
      setError(null);
    }, 150);
  };

  const handleAdd = () => {
    const cost = parseInt(costRef.value);
    const cash = sheet()!.current.postRatRace.cash;
    if (cost > cash)
      return setError(
        `You don't have enough cash to buy this asset. You have $${cash.toLocaleString(
          "en-us",
          { currency: "USD" }
        )} but this asset costs $${cost.toLocaleString("en-us", {
          currency: "USD",
        })}`
      );
    updateSheet(sheet()!.id, {
      "current.postRatRace.cash": cash - cost,
      "current.postRatRace.assets": arrayUnion({
        id: uuid(),
        type: "other",
        name: nameRef.value,
        cashflow: Number(cashflowRef.value),
      } as OtherAsset),
      history: arrayUnion(
        `${new Date().toISOString()}: Bought big asset ${nameRef.value} for $${
          costRef.value
        }`
      ),
    });
    closeRef.click();
  };

  return (
    <div class="border-2 border-black flex flex-col p-4 rounded-lg">
      <div class="flex flex-row justify-between items-center">
        <h3 class="text-2xl font-bold">Assets</h3>
        <label class="btn btn-primary" for="add-asset-modal">
          <Icon icon="material-symbols:add" class="text-xl mr-1" />
          Add
        </label>
      </div>
      <div class="divider" />
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <For
          each={sheet()?.current?.postRatRace.assets}
          fallback={
            <div class="flex flex-row justify-between items-center p-3">
              <div class="flex flex-col">
                <span class="font-bold">No assets</span>
              </div>
            </div>
          }
        >
          {(asset) => <Asset asset={asset} />}
        </For>
      </div>
      <input type="checkbox" id="add-asset-modal" class="modal-toggle" />
      <div class="modal">
        <div class="modal-box">
          <h3 class="font-bold text-lg mb-4">Add New Asset</h3>
          <div class="flex flex-col gap-2">
            <span>Name</span>
            <input class="input input-bordered focus:outline-none focus:ring-2" ref={nameRef} />
            <span>Monthly Cashflow</span>
            <input
              type="number"
              class="input input-bordered focus:outline-none focus:ring-2"
              ref={cashflowRef}
              value={0}
            />
            <span>Cost</span>
            <input
              type="number"
              class="input input-bordered focus:outline-none focus:ring-2"
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
              onClick={resetForm}
            >
              Cancel
            </label>
            <div class="btn btn-primary" onClick={handleAdd}>
              Add
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
