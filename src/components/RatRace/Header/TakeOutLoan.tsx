/* @jsxImportSource solid-js */

import { arrayUnion } from "firebase/firestore";
import { createSignal } from "solid-js";
import { updateSheet } from "../../../data/firestore";
import { sheetSignal } from "../../../data/signals";
import ConditionalErrorAlert from "../../ConditionalErrorAlert";

export default function TakeOutLoan() {
  const [sheet] = sheetSignal;
  const [error, setError] = createSignal("");

  let amountRef!: HTMLInputElement;
  let closeRef!: HTMLLabelElement;

  return (
    <>
      <label
        for="take-load-modal"
        class="btn btn-info btn-outline w-full md:w-auto"
      >
        Take Loan
      </label>
      <input type="checkbox" id="take-load-modal" class="modal-toggle" />
      <div class="modal">
        <div class="modal-box">
          <h3 class="font-bold text-lg mb-4">Take Out Loan</h3>
          <div class="flex flex-col gap-2">
            <span>Amount</span>
            <input
              type="number"
              class="input input-bordered"
              ref={amountRef}
              value={0}
            />
            <ConditionalErrorAlert error={error()} />
          </div>
          <div class="modal-action">
            <label
              for="take-load-modal"
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
                  return setError("Please enter a valid amount to add.");
                if (amount % 1000 !== 0)
                  return setError("Amount must be a multiple of $1000.");
                const cash = sheet()?.current.cash || 0;
                const loans = sheet()?.current.loans || 0;
                updateSheet(sheet()!.id, {
                  "current.cash": cash + amount,
                  "current.loans": loans + amount,
                  history: arrayUnion(
                    `Took out a loan of $${amount} from the bank.`
                  ),
                });
                closeRef.click();
                amountRef.value = "0";
              }}
            >
              Take Loan
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
