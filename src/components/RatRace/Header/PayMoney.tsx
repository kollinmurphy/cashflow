/* @jsxImportSource solid-js */

import { Icon } from "@iconify-icon/solid";
import { createSignal } from "solid-js";
import { updateSheet } from "../../../data/firestore";
import { sheetSignal } from "../../../data/signals";

export default function PayMoney() {
  const [sheet] = sheetSignal;
  const [amount, setAmount] = createSignal(0);

  let closeRef!: HTMLLabelElement;

  const resetForm = () => {
    setTimeout(() => {
      setAmount(0);
    }, 150);
  };

  const handlePay = () => {
    const cash = sheet()!.current.cash;
    updateSheet(sheet()!.id, {
      "current.cash": cash - amount(),
    });
    closeRef.click();
    resetForm();
  };

  return (
    <>
      <label
        for="pay-money-modal"
        class="btn btn-error btn-outline w-full md:w-auto"
      >
        <Icon icon="carbon:subtract" class="text-xl mr-1" />
        Pay Money
      </label>
      <input type="checkbox" id="pay-money-modal" class="modal-toggle" />
      <div class="modal">
        <div class="modal-box">
          <h3 class="font-bold text-lg mb-4">Pay Money</h3>
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
              for="pay-money-modal"
              class="btn btn-primary btn-outline"
              ref={closeRef}
              onClick={resetForm}
            >
              Cancel
            </label>
            <button
              class="btn btn-primary"
              onClick={handlePay}
              disabled={
                amount() <= 0 ||
                Number.isNaN(amount()) ||
                amount() > sheet()!.current.cash
              }
            >
              Pay
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
