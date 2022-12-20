/* @jsxImportSource solid-js */

import { Icon } from "@iconify-icon/solid";
import { arrayUnion } from "firebase/firestore";
import { createSignal, For, Match, Show, Switch } from "solid-js";
import { v4 as uuid } from "uuid";
import createConfetti from "../../../data/confetti";
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
      if (costRef) costRef.value = "0";
      cashflowRef.value = "0";
      nameRef.value = "";
      if (downpayRef) downpayRef.value = "0";
      setType(null);
    }, 150);
  };

  const handleAdd = () => {
    const cost = parseInt(costRef.value);
    const cash = sheet()!.current.cash;
    if (cost > cash && type() === "other")
      return setError(
        `You don't have enough cash to buy this asset. You have $${cash} but this asset costs $${cost}`
      );
    if (type() === "realEstate") {
      if (parseInt(downpayRef.value) > cost)
        return setError(`You can't put down more money than the asset costs.`);
      if (parseInt(downpayRef.value) > cash)
        return setError(
          `You don't have enough cash to put down on this asset.`
        );
    }
    const payment = type() === "realEstate" ? parseInt(downpayRef.value) : cost;
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
      "current.cash": cash - payment,
      "current.assets": arrayUnion(asset as AssetType),
      history: arrayUnion(
        `${new Date().toISOString()}: Bought asset ${nameRef.value} for $${
          costRef.value
        }`
      ),
    });
    closeRef.click();
    resetForm();
    if (parseInt(cashflowRef.value) > 0)
      createConfetti({ y: 0.5, x: 0.5, startVelocity: 40 });
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
                    <Icon
                      icon="fluent:real-estate-20-filled"
                      class="text-xl mr-1"
                    />
                    Real Estate
                  </button>
                  <button
                    class="btn btn-secondary"
                    onClick={() => setType("other")}
                  >
                    <Icon icon="ph:money" class="text-xl mr-1" />
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
