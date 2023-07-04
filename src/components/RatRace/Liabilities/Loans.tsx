/* @jsxImportSource solid-js */

import { createSignal } from "solid-js";
import { updateSheet } from "../../../data/firestore";
import { sheetSignal } from "../../../data/signals";
import ConditionalErrorAlert from "../../ConditionalErrorAlert";

export const Loans = () => {
  const [sheet] = sheetSignal;
  const [amount, setAmount] = createSignal(0);

  let closeRef!: HTMLLabelElement;

  const resetForm = () => setAmount(0);

  const handlePayOff = () => {
    const a = amount();
    const cash = sheet()!.current.cash;
    updateSheet(sheet()!.id, {
      "current.cash": cash - a,
      "current.loans": (sheet()!.current.loans || 0) - a,
    });
    closeRef.click();
  };

  const disabled = () => Boolean(error());

  const error = () =>
    amount() > sheet()!.current.cash
      ? "You can't pay more than you have in cash."
      : amount() > sheet()!.current.loans
      ? "You can't pay more than you have in loans."
      : !amount() || amount() < 0 || amount() % 1000 !== 0
      ? "Amount must be a multiple of $1000."
      : "";

  return (
    <div class="flex flex-row justify-between items-center p-3 bg-white rounded-lg shadow-lg">
      <div class="flex flex-col items-start">
        <span class="font-bold">Loans</span>
        <span class="text-red-400">
          $
          {sheet()?.current?.loans.toLocaleString("en-us", {
            currency: "USD",
          })}
        </span>
      </div>
      <div class="flex">
        <label class="btn btn-secondary btn-sm" for="pay-loan-modal">
          Pay Off
        </label>
      </div>

      <input type="checkbox" id="pay-loan-modal" class="modal-toggle" />
      <div class="modal">
        <div class="modal-box">
          <h3 class="font-bold text-lg mb-4">Pay Off Loans</h3>
          <div class="flex flex-col gap-2">
            <span>Amount</span>
            <input
              type="number"
              class="input input-bordered focus:outline-none focus:ring-2"
              value={amount()}
              onInput={(e) => setAmount(parseInt(e.currentTarget.value))}
            />
            <ConditionalErrorAlert error={error()} />
          </div>
          <div class="modal-action">
            <label
              for="pay-loan-modal"
              class="btn btn-primary btn-outline"
              ref={closeRef}
              onClick={resetForm}
            >
              Cancel
            </label>
            <button
              class="btn btn-primary"
              onClick={handlePayOff}
              disabled={disabled()}
            >
              Pay Off
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
