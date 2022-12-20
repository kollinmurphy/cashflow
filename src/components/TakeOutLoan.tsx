/* @jsxImportSource solid-js */

import { arrayUnion } from "firebase/firestore";
import { createSignal } from "solid-js";
import { updateSheet } from "../data/firestore";
import { sheetSignal } from "../data/signals";
import ConditionalErrorAlert from "./ConditionalErrorAlert";

export default function TakeOutLoan() {
  const [sheet] = sheetSignal;
  const [error, setError] = createSignal("");

  let amountRef!: HTMLInputElement;
  let closeRef!: HTMLLabelElement;

  return (
    <div class="flex flex-row items-center gap-4">
      <label for="take-load-modal" class="btn btn-secondary btn-outline">
        Loan
      </label>
      <input type="checkbox" id="take-load-modal" class="modal-toggle" />
      <div class="modal">
        <div class="modal-box">
          <h3 class="font-bold text-lg mb-4">Take Out Loan</h3>
          <div class="flex flex-col gap-2">
            <span>Amount</span>
            <input type="number" class="input input-bordered" ref={amountRef} />
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
                if (!amount)
                  return setError("Please enter a valid amount to add.");
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
              }}
            >
              Take Loan
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
