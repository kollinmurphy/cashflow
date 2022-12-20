/* @jsxImportSource solid-js */

import { createSignal } from "solid-js";
import { updateSheet } from "../../../data/firestore";
import { sheetSignal } from "../../../data/signals";
import ConditionalErrorAlert from "../../ConditionalErrorAlert";

export default function AddMoney() {
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

  const handleAdd = () => {
    const amount = parseInt(amountRef.value);
    if (!amount || amount < 0)
      return setError("Please enter a valid amount to add.");
    const cash = sheet()!.current.postRatRace.cash;
    updateSheet(sheet()!.id, {
      "current.postRatRace.cash": cash + amount,
    });
    closeRef.click();
    resetForm();
  };

  return (
    <>
      <label
        for="add-money-modal-post-rat-race"
        class="btn btn-success btn-outline"
      >
        Add Money
      </label>
      <input
        type="checkbox"
        id="add-money-modal-post-rat-race"
        class="modal-toggle"
      />
      <div class="modal">
        <div class="modal-box">
          <h3 class="font-bold text-lg mb-4">Add Money</h3>
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
              for="add-money-modal-post-rat-race"
              class="btn btn-primary btn-outline"
              ref={closeRef}
              onClick={resetForm}
            >
              Cancel
            </label>
            <div class="btn btn-primary" onClick={handleAdd}>
              Add
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
