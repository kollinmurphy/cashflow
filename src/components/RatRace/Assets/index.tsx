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
  RatRaceAsset,
  StockAsset,
  StockName,
  StockNameType,
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

  let closeRef!: HTMLLabelElement;

  const [name, setName] = createSignal<string | StockNameType>(StockName.ON2U);
  const [cashflow, setCashflow] = createSignal(0);
  const [cost, setCost] = createSignal(0);
  const [downpay, setDownpay] = createSignal(0);
  const [shares, setShares] = createSignal(0);

  const resetForm = () => {
    setTimeout(() => {
      setName(StockName.ON2U);
      setCashflow(0);
      setCost(0);
      setDownpay(0);
      setShares(0);
      setType(null);
    }, 150);
  };

  const handleAddStock = () => {
    const previous = sheet()!.current.stocks[name() as StockNameType];
    const previousShares = previous?.shares || 0;
    const purchasingShares = shares();
    if (!purchasingShares || purchasingShares < 0)
      return setError("Invalid shares");
    const totalShares = purchasingShares + previousShares;
    const price = cost();
    if (!price || price < 0) return setError("Invalid price");
    const totalPrice = price * purchasingShares;
    if (totalPrice > sheet()!.current.cash) return setError("Not enough cash");
    const avgPrice =
      ((previous?.cost || 0) + purchasingShares * price) / totalShares;
    const asset: StockAsset = {
      id: uuid(),
      type: "stock",
      name: name(),
      stock: name() as StockName,
      shares: totalShares,
      avgPrice,
      cashflow: name() === StockName["2BIG"] ? 10 : 0,
      cost: totalPrice + (previous?.cost || 0),
    };
    updateSheet(sheet()!.id, {
      "current.cash": sheet()!.current.cash - totalPrice,
      ["current.stocks." + name()]: asset,
      history: arrayUnion(
        `${new Date().toISOString()}: Added ${purchasingShares} shares of ${name()} at $${price} each`
      ),
    });
    closeRef.click();
    if (asset.cashflow > 0)
      createConfetti({ y: 0.5, x: 0.5, startVelocity: 40 });
  };

  const handleAdd = () => {
    setError(null);
    if (type() === "stock") return handleAddStock();
    const cash = sheet()!.current.cash;

    const payment = downpay();
    const asset: RatRaceAsset = {
      id: uuid(),
      type: "other",
      downPayment: downpay(),
      mortgage: cost() - downpay(),
      cost: cost(),
      name: name(),
      cashflow: cashflow(),
    };
    updateSheet(sheet()!.id, {
      "current.cash": cash - payment,
      "current.assets": arrayUnion(asset as AssetType),
      history: arrayUnion(
        `${new Date().toISOString()}: Bought asset ${name()} for $${cost()}`
      ),
    });
    closeRef.click();
    if (cashflow() > 0) createConfetti({ y: 0.5, x: 0.5, startVelocity: 40 });
  };

  const validOther = () =>
    name() &&
    downpay() <= cost() &&
    downpay() <= sheet()!.current.cash &&
    (cashflow() || cost() || downpay());

  const validStock = () =>
    shares() > 0 && cost() > 0 && shares() * cost() <= sheet()!.current.cash;

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
                    onClick={() => {
                      setType("stock");
                      setName(StockName.ON2U);
                    }}
                  >
                    <Icon
                      icon="material-symbols:show-chart-rounded"
                      class="text-xl mr-1"
                    />
                    Stocks
                  </button>
                  <button
                    class="btn btn-secondary"
                    onClick={() => {
                      setType("other");
                      setName("");
                    }}
                  >
                    <Icon
                      icon="fluent:real-estate-20-filled"
                      class="text-xl mr-1"
                    />
                    Other
                  </button>
                </div>
              </Match>
              <Match when={type() === "other"}>
                <span>Name</span>
                <input
                  class="input input-bordered focus:outline-none focus:ring-2"
                  value={name()}
                  onInput={(e) => setName(e.currentTarget.value)}
                />
                <span>Monthly Cashflow</span>
                <input
                  type="number"
                  class="input input-bordered focus:outline-none focus:ring-2"
                  value={cashflow()}
                  onInput={(e) => setCashflow(parseInt(e.currentTarget.value))}
                />
                <span>Cost</span>
                <input
                  type="number"
                  class="input input-bordered focus:outline-none focus:ring-2"
                  value={cost()}
                  onInput={(e) => setCost(parseInt(e.currentTarget.value))}
                />
                <span>Down Payment</span>
                <input
                  type="number"
                  class="input input-bordered focus:outline-none focus:ring-2"
                  value={downpay()}
                  onInput={(e) => setDownpay(parseInt(e.currentTarget.value))}
                />
              </Match>
              <Match when={type() === "stock"}>
                <span>Stock</span>
                <select
                  class="select select-bordered focus:outline-none focus:ring-2"
                  value={name()}
                  onInput={(e) => setName(e.currentTarget.value)}
                >
                  <option value="" disabled>
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
                  value={shares()}
                  onInput={(e) => setShares(parseInt(e.currentTarget.value))}
                />
                <span>Price</span>
                <input
                  type="number"
                  class="input input-bordered focus:outline-none focus:ring-2"
                  value={cost()}
                  onInput={(e) => setCost(parseInt(e.currentTarget.value))}
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
              <button
                class="btn btn-primary"
                onClick={handleAdd}
                disabled={type() === "stock" ? !validStock() : !validOther()}
              >
                Add
              </button>
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
}
