/* @jsxImportSource solid-js */

import { Icon } from "@iconify-icon/solid";
import { createSignal } from "solid-js";
import { updateSheet } from "../../../data/firestore";
import { sheetSignal } from "../../../data/signals";

export default function AddMoney() {
  const [sheet] = sheetSignal;
  const [amount, setAmount] = createSignal(0);

  let closeRef!: HTMLLabelElement;

  return (
    <>
      <label
        for="add-money-modal"
        class="btn btn-success btn-outline w-full md:w-auto"
      >
        <Icon icon="material-symbols:add" class="text-xl mr-1" />
        Add Money
      </label>
      <input type="checkbox" id="add-money-modal" class="modal-toggle" />
      <div class="modal">
        <div class="modal-box">
          <h3 class="font-bold text-lg mb-4">Add Money</h3>
          <div class="flex flex-col gap-2">
            <span>Amount</span>
            <input
              type="number"
              class="input input-bordered focus:outline-none focus:ring-2"
              value={amount()}
              onInput={(e) => setAmount(parseInt(e.currentTarget.value))}
            />
          </div>
          <div class="modal-action">
            <label
              for="add-money-modal"
              class="btn btn-primary btn-outline"
              ref={closeRef}
            >
              Cancel
            </label>
            <button
              class="btn btn-primary"
              disabled={amount() <= 0 || Number.isNaN(amount())}
              onClick={() => {
                const cash = sheet()!.current.cash;
                updateSheet(sheet()!.id, {
                  "current.cash": cash + amount(),
                });
                closeRef.click();
                setAmount(0);
              }}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
