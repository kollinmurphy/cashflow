/* @jsxImportSource solid-js */

import EndGame from "../EndGame";
import Profession from "../Profession";
import Assets from "./Assets";
import Expenses from "./Expenses";
import AddMoney from "./Header/AddMoney";
import Charity from "./Header/Charity";
import Downsize from "./Header/Downsize";
import IncomeInfo from "./Header/IncomeInfo";
import LeaveRatRace from "./Header/LeaveRatRace";
import PayDay from "./Header/PayDay";
import PayMoney from "./Header/PayMoney";
import TakeOutLoan from "./Header/TakeOutLoan";
import Liabilities from "./Liabilities";

export default function RatRace() {
  return (
    <div class="p-4 md:p-8 flex flex-col gap-4">
      <div class="flex flex-col md:flex-row gap-3 justify-between md:items-end">
        <div class="flex flex-col gap-1">
          <Profession />
          <IncomeInfo />
        </div>
        <div class="flex flex-col md:flex-row flex-wrap gap-2 items-center md:items-end">
          <AddMoney />
          <PayMoney />
          <Charity />
          <Downsize />
          <TakeOutLoan />
          <PayDay />
          <LeaveRatRace />
        </div>
      </div>
      <Assets />
      <Liabilities />
      <Expenses />
      <EndGame />
    </div>
  );
}
