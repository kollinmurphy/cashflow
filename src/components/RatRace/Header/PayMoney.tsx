/* @jsxImportSource solid-js */

import { Icon } from "@iconify-icon/solid";
import { createSignal } from "solid-js";
import { updateSheet } from "../../../data/firestore";
import { sheetSignal } from "../../../data/signals";
import ConditionalErrorAlert from "../../ConditionalErrorAlert";

export default function PayMoney() {
  const [sheet] = sheetSignal;
  const [error, setError] = createSignal("");

  let amountRef!: HTMLInputElement;
  let closeRef!: HTMLLabelElement;

  const resetForm = () => {
    setTimeout(() => {
      amountRef.value = "0";
      setError("");
    }, 150);
  };

  const handlePay = () => {
    const amount = parseInt(amountRef.value);
    if (!amount || amount < 0)
      return setError("Please enter a valid amount to pay.");
    const cash = sheet()!.current.cash;
    if (amount > cash)
      return setError(
        "You can't pay more than you have in cash. Please pay less."
      );
    updateSheet(sheet()!.id, {
      "current.cash": cash - amount,
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
              ref={amountRef}
              value={0}
            />
            <ConditionalErrorAlert error={error()} />
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
            <div class="btn btn-primary" onClick={handlePay}>
              Pay
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
