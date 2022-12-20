/* @jsxImportSource solid-js */

import { createSignal } from "solid-js";
import { updateSheet } from "../../../data/firestore";
import { sheetSignal } from "../../../data/signals";
import ConditionalErrorAlert from "../../ConditionalErrorAlert";

export const Loans = () => {
  const [sheet] = sheetSignal;
  const [error, setError] = createSignal("");

  let amountRef!: HTMLInputElement;
  let closeRef!: HTMLLabelElement;

  return (
    <div class="flex flex-row justify-between items-center p-3 bg-white rounded-lg shadow-lg">
      <div class="flex flex-col items-start">
        <span class="font-bold">Loans</span>
        <span class="text-gray-400">
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
            <input type="number" class="input input-bordered" ref={amountRef} />
            <ConditionalErrorAlert error={error()} />
          </div>
          <div class="modal-action">
            <label
              for="pay-loan-modal"
              class="btn btn-primary btn-outline"
              ref={closeRef}
            >
              Cancel
            </label>
            <div
              class="btn btn-primary"
              onClick={() => {
                const amount = parseInt(amountRef.value);
                if (!amount || amount < 0)
                  return setError("Please enter a valid amount to pay.");
                if (amount % 1000 !== 0)
                  return setError("Amount must be a multiple of $1000.");
                const cash = sheet()!.current.cash;
                if (amount > cash)
                  return setError(
                    "You can't pay more than you have in cash. Please pay less."
                  );
                const loanAmount = sheet()!.current.loans;
                if (amount > loanAmount)
                  return setError(
                    "You can't pay more than you have in loans. Please pay less."
                  );
                updateSheet(sheet()!.id, {
                  "current.cash": cash - amount,
                  "current.loans": (sheet()!.current.loans || 0) - amount,
                });
                closeRef.click();
              }}
            >
              Pay Off
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
