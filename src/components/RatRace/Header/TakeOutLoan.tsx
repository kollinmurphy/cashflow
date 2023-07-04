/* @jsxImportSource solid-js */

import { Icon } from "@iconify-icon/solid";
import { arrayUnion } from "firebase/firestore";
import { createSignal } from "solid-js";
import { updateSheet } from "../../../data/firestore";
import { sheetSignal } from "../../../data/signals";
import ConditionalErrorAlert from "../../ConditionalErrorAlert";

export default function TakeOutLoan() {
  const [sheet] = sheetSignal;
  const [amount, setAmount] = createSignal(0);

  let closeRef!: HTMLLabelElement;

  const handleTakeLoan = () => {
    const cash = sheet()?.current.cash || 0;
    const loans = sheet()?.current.loans || 0;
    updateSheet(sheet()!.id, {
      "current.cash": cash + amount(),
      "current.loans": loans + amount(),
      history: arrayUnion(`Took out a loan of $${amount()} from the bank.`),
    });
    closeRef.click();
    setTimeout(() => {
      setAmount(0);
    }, 150);
  };

  const error = () =>
    amount() <= 0 || Number.isNaN(amount()) || amount() % 1000 !== 0
      ? "Amount must be a multiple of $1000."
      : "";

  return (
    <>
      <label
        for="take-load-modal"
        class="btn btn-info btn-outline w-full md:w-auto"
      >
        <Icon icon="game-icons:two-coins" class="text-xl mr-1" />
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
              class="input input-bordered focus:outline-none focus:ring-2"
              value={amount()}
              onInput={(e) => setAmount(parseInt(e.currentTarget.value))}
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
            <button
              class="btn btn-primary"
              onClick={handleTakeLoan}
              disabled={Boolean(error())}
            >
              Take Loan
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
