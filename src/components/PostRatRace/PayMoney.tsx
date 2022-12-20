/* @jsxImportSource solid-js */

import { createSignal } from "solid-js";
import { updateSheet } from "../../data/firestore";
import { sheetSignal } from "../../data/signals";
import ConditionalErrorAlert from "../ConditionalErrorAlert";

export default function PayMoney() {
  const [sheet] = sheetSignal;
  const [error, setError] = createSignal("");

  let amountRef!: HTMLInputElement;
  let closeRef!: HTMLLabelElement;

  return (
    <>
      <label
        for="pay-money-modal-post-rat-race"
        class="btn btn-error btn-outline"
      >
        Pay Money
      </label>
      <input
        type="checkbox"
        id="pay-money-modal-post-rat-race"
        class="modal-toggle"
      />
      <div class="modal">
        <div class="modal-box">
          <h3 class="font-bold text-lg mb-4">Pay Money</h3>
          <div class="flex flex-col gap-2">
            <span>Amount</span>
            <input type="number" class="input input-bordered" ref={amountRef} />
            <ConditionalErrorAlert error={error()} />
          </div>
          <div class="modal-action">
            <label
              for="pay-money-modal-post-rat-race"
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
                const cash = sheet()!.current.postRatRace.cash;
                if (amount > cash)
                  return setError(
                    "You can't pay more than you have in cash. Please pay less."
                  );
                updateSheet(sheet()!.id, {
                  "current.postRatRace.cash": cash - amount,
                });
                closeRef.click();
              }}
            >
              Pay
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
