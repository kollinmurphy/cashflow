/* @jsxImportSource solid-js */

import { Icon } from "@iconify-icon/solid";
import { arrayUnion } from "firebase/firestore";
import { createSignal, For, Match, Show, Switch } from "solid-js";
import { v4 as uuid } from "uuid";
import createConfetti from "../../../data/confetti";
import { updateSheet } from "../../../data/firestore";
import { sheetSignal } from "../../../data/signals";
import {
  Asset as AssetType,
  OtherAsset,
  RealEstateAsset,
  StockAsset,
  StockName,
} from "../../../data/types";
import ConditionalErrorAlert from "../../ConditionalErrorAlert";
import Asset from "./Asset";
import Stock from "./Stock";

export default function Assets() {
  const [error, setError] = createSignal<string | null>(null);
  const [type, setType] = createSignal<AssetType["type"] | null>(null);

  const [sheet] = sheetSignal;

  const stocks = () => {
    const stocks = sheet()?.current.stocks;
    if (!stocks) return [];
    const stockNames = Object.keys(stocks);
    return stockNames
      .filter((stock) => (stocks[stock as StockName]!.shares || 0) > 0)
      .sort((a, b) => a.localeCompare(b));
  };

  const noAssets = () =>
    stocks().length === 0 && (sheet()?.current?.assets?.length || 0) === 0;

  let nameRef!: any;
  let cashflowRef!: HTMLInputElement;
  let costRef!: HTMLInputElement;
  let downpayRef!: HTMLInputElement;
  let sharesRef: HTMLInputElement | undefined;
  let closeRef!: HTMLLabelElement;

  const resetForm = () => {
    setTimeout(() => {
      if (nameRef) nameRef.value = "";
      if (costRef) costRef.value = "0";
      if (cashflowRef) cashflowRef.value = "0";
      if (downpayRef) downpayRef.value = "0";
      if (sharesRef) sharesRef.value = "0";
      setType(null);
    }, 150);
  };

  const handleAddStock = () => {
    const previous = sheet()!.current.stocks[nameRef.value as StockName];
    const previousShares = previous?.shares || 0;
    const purchasingShares = parseInt(sharesRef?.value || "0");
    if (!purchasingShares || purchasingShares < 0)
      return setError("Invalid shares");
    const totalShares = purchasingShares + previousShares;
    const price = parseInt(costRef.value);
    if (!price || price < 0) return setError("Invalid price");
    const totalPrice = price * purchasingShares;
    if (totalPrice > sheet()!.current.cash) return setError("Not enough cash");
    const avgPrice =
      ((previous?.cost || 0) + purchasingShares * price) / totalShares;
    const asset: StockAsset = {
      id: uuid(),
      type: "stock",
      name: nameRef.value,
      stock: nameRef.value,
      shares: totalShares,
      avgPrice,
      cashflow: nameRef.value === "2BIG" ? 10 : 0,
      cost: totalPrice + (previous?.cost || 0),
    };
    updateSheet(sheet()!.id, {
      "current.cash": sheet()!.current.cash - totalPrice,
      ["current.stocks." + nameRef.value]: asset,
      history: arrayUnion(
        `${new Date().toISOString()}: Added ${purchasingShares} shares of ${
          nameRef.value
        } at $${price} each`
      ),
    });
    closeRef.click();
    if (asset.cashflow > 0)
      createConfetti({ y: 0.5, x: 0.5, startVelocity: 40 });
  };

  const handleAdd = () => {
    if (type() === "stock") return handleAddStock();
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
    // return console.log(asset)
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
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Show when={noAssets()}>
          <span class="font-bold">No assets</span>
        </Show>
        <For each={sheet()?.current?.assets}>
          {(asset) => <Asset asset={asset} />}
        </For>
        <For each={stocks()}>
          {(stock) => (
            <Stock stock={sheet()?.current?.stocks[stock as StockName]!} />
          )}
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
                    onClick={() => setType("stock")}
                  >
                    <Icon
                      icon="material-symbols:show-chart-rounded"
                      class="text-xl mr-1"
                    />
                    Stocks
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
                <span>Down Payment</span>
                <input
                  type="number"
                  class="input input-bordered focus:outline-none focus:ring-2"
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
              <Match when={type() === "stock"}>
                <span>Stock</span>
                <select class="select select-bordered focus:outline-none focus:ring-2" ref={nameRef}>
                  <option value="" disabled selected>
                    Select a stock
                  </option>
                  <For each={Object.keys(StockName)}>
                    {(name) => <option value={name}>{name}</option>}
                  </For>
                </select>
                <span>Shares</span>
                <input
                  type="number"
                  class="input input-bordered focus:outline-none focus:ring-2"
                  ref={sharesRef}
                />
                <span>Price</span>
                <input
                  type="number"
                  class="input input-bordered focus:outline-none focus:ring-2"
                  ref={costRef}
                  value={1}
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
