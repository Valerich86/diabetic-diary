"use client";

import { getFormattedDateTime } from "@/lib/time-date-formatter";

interface Props {
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
}

export default function SearchPeriod({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: Props) {
  return (
    <form className="w-full md:w-1/2 lg:w-1/3 flex justify-between mb-5">
      <fieldset className="w-[45%]">
        <label className="label">Начало</label>
        <input
          className="input"
          type="date"
          max={getFormattedDateTime().fDate}
          value={startDate}
          onChange={(e) =>
            setStartDate(getFormattedDateTime(e.target.value).fDate)
          }
        />
      </fieldset>
      <fieldset className="w-[45%]">
        <label className="label">Конец</label>
        <input
          className="input"
          type="date"
          min={startDate}
          max={getFormattedDateTime().fDate}
          value={endDate}
          onChange={(e) =>
            setEndDate(getFormattedDateTime(e.target.value).fDate)
          }
        />
      </fieldset>
    </form>
  );
}
