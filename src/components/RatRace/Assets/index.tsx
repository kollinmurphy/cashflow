/* @jsxImportSource solid-js */

import { arrayUnion } from "firebase/firestore";
import { createSignal, For, Match, Show, Switch } from "solid-js";
import { v4 as uuid } from "uuid";
import { updateSheet } from "../../../data/firestore";
import { sheetSignal } from "../../../data/signals";
import type {
  Asset as AssetType,
  OtherAsset,
  RealEstateAsset,
} from "../../../data/types";
import ConditionalErrorAlert from "../../ConditionalErrorAlert";
import Asset from "./Asset";

export default function Assets() {
  const [error, setError] = createSignal<string | null>(null);
  const [type, setType] = createSignal<AssetType["type"] | null>(null);

  const [sheet] = sheetSignal;

  let nameRef!: HTMLInputElement;
  let cashflowRef!: HTMLInputElement;
  let costRef!: HTMLInputElement;
  let downpayRef!: HTMLInputElement;
  let closeRef!: HTMLLabelElement;

  const resetForm = () => {
    setTimeout(() => {
      costRef.value = "0";
      cashflowRef.value = "0";
      nameRef.value = "";
      downpayRef.value = "0";
      setType(null);
    }, 150);
  };

  const handleAdd = () => {
    const cost = parseInt(costRef.value);
    const cash = sheet()!.current.cash;
    if (cost > cash)
      return setError(
        `You don't have enough cash to buy this asset. You have $${cash} but this asset costs $${cost}`
      );
    if (type() === "realEstate" && parseInt(downpayRef.value) > cost)
      return setError(`You can't put down more money than the asset costs.`);
    const asset: AssetType =
      type() === "realEstate"
        ? ({
            id: uuid(),
            type: "realEstate",
            downPayment: parseInt(downpayRef.value),
            mortgage: cost - parseInt(downpayRef.value),
            cost,
            name: nameRef.value,
            cashflow: parseInt(cashflowRef.value),
          } as RealEstateAsset)
        : ({
            id: uuid(),
            type: "other",
            cost,
            name: nameRef.value,
            cashflow: parseInt(cashflowRef.value),
          } as OtherAsset);
    updateSheet(sheet()!.id, {
      "current.cash": cash - cost,
      "current.assets": arrayUnion(asset as AssetType),
      history: arrayUnion(
        `${new Date().toISOString()}: Bought asset ${nameRef.value} for $${
          costRef.value
        }`
      ),
    });
    closeRef.click();
    resetForm();
  };

  return (
    <div class="border-2 border-black flex flex-col p-4 rounded-lg">
      <div class="flex flex-row justify-between items-center">
        <h3 class="text-2xl font-bold">Assets</h3>
        <label class="btn btn-primary" for="add-asset-modal">
          Add Asset
        </label>
      </div>
      <div class="divider" />
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <For
          each={sheet()?.current?.assets}
          fallback={<span class="font-bold">No assets</span>}
        >
          {(asset) => <Asset asset={asset} />}
        </For>
      </div>
      <input type="checkbox" id="add-asset-modal" class="modal-toggle" />
      <div class="modal">
        <div class="modal-box">
          <h3 class="font-bold text-lg mb-4">Add New Asset</h3>
          <div class="flex flex-col gap-2">
            <Switch>
              <Match when={!type()}>
                <div class="grid grid-cols-2 gap-3">
                  <button
                    class="btn btn-secondary"
                    onClick={() => setType("realEstate")}
                  >
                    Real Estate
                  </button>
                  <button
                    class="btn btn-secondary"
                    onClick={() => setType("other")}
                  >
                    Other
                  </button>
                </div>
              </Match>
              <Match when={type() === "realEstate"}>
                <span>Name</span>
                <input class="input input-bordered" ref={nameRef} />
                <span>Monthly Cashflow</span>
                <input
                  type="number"
                  class="input input-bordered"
                  ref={cashflowRef}
                  value={0}
                />
                <span>Cost</span>
                <input
                  type="number"
                  class="input input-bordered"
                  ref={costRef}
                  value={0}
                />
                <span>Down Payment</span>
                <input
                  type="number"
                  class="input input-bordered"
                  ref={downpayRef}
                  value={0}
                />
              </Match>
              <Match when={type() === "other"}>
                <span>Name</span>
                <input class="input input-bordered" ref={nameRef} />
                <span>Monthly Cashflow</span>
                <input
                  type="number"
                  class="input input-bordered"
                  ref={cashflowRef}
                  value={0}
                />
                <span>Cost</span>
                <input
                  type="number"
                  class="input input-bordered"
                  ref={costRef}
                  value={0}
                />
              </Match>
            </Switch>
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
            <Show when={type()}>
              <div class="btn btn-primary" onClick={handleAdd}>
                Add
              </div>
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
}
