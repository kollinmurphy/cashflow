/* @jsxImportSource solid-js */

import { sheetSignal } from "../../data/signals";
import EndGame from "../EndGame";
import Profession from "../Profession";
import Assets from "./Assets";
import Expenses from "./Expenses";
import AddMoney from "./Header/AddMoney";
import IncomeInfo from "./Header/IncomeInfo";
import LeaveRatRace from "./Header/LeaveRatRace";
import PayDay from "./Header/PayDay";
import PayMoney from "./Header/PayMoney";
import TakeOutLoan from "./Header/TakeOutLoan";
import Liabilities from "./Liabilities";
import Stocks from "./Stocks";

export default function RatRace() {
  const [sheet, setSheet] = sheetSignal;

  return (
    <div class="flex flex-col gap-4">
      <div class="flex flex-col md:flex-row gap-3 justify-between md:items-end">
        <div class="flex flex-col gap-1">
          <Profession />
          <IncomeInfo />
        </div>
        <div class="flex flex-col md:flex-row gap-2 items-center md:items-end">
          <AddMoney />
          <PayMoney />
          <TakeOutLoan />
          <PayDay />
          <LeaveRatRace />
        </div>
      </div>
      <Assets />
      <Stocks />
      <Liabilities />
      <Expenses />
      <EndGame />
    </div>
  );
}
