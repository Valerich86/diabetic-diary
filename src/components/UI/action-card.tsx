"use client";

import { AiFillDelete } from "react-icons/ai";
import type { Action } from "@/lib/types";

interface Props {
  act: Action;
  refresh: boolean;
  setRefresh: (refresh: boolean) => void;
}

export default function ActionCard({ act, refresh, setRefresh }: Props) {
  const isRedZone =
    act.record_type === "Измерение глюкозы" &&
    (Number(act.detail) >= 10 || Number(act.detail) <= 3);
  const isYellowZone =
    act.record_type === "Измерение глюкозы" &&
    Number(act.detail) < 10 &&
    Number(act.detail) > 7;

  const handleDelete = async () => {
    const url =
      act.record_type === "Измерение глюкозы"
        ? `/api/glucose-measurements/`
        : act.record_type === "Приём пищи"
          ? `/api/food-intakes/`
          : `/api/insulin-injections/`;
    try {
      await fetch(url + `${act.id}`, { method: "DELETE" });
      setRefresh(!refresh);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className={`w-full border rounded-2xl relative
        ${isRedZone ? "bg-red-100" : "bg-secondary-light-blue"}`}
    >
      <button
        className={
          `absolute bottom-1 right-1 p-1 rounded-full bg-gray-500 text-primary-milk
          hover:opacity-80 cursor-pointer`
        }
        onClick={handleDelete}
      >
        <AiFillDelete />
      </button>
      <div
        className={`flex gap-2 text-primary-milk p-3 rounded-t-2xl
          ${isRedZone ? "bg-accent-red" : "bg-secondary-blue"}`}
      >
        <strong>{act.time.substring(0, 5)}</strong>
        <strong>{act.record_type}</strong>
      </div>
      <div className="p-3 rounded-b-2xl flex flex-col">
        {act.record_type === "Приём пищи" && (
          <p>
            <strong className="text-xs font-extrabold">Продукты: </strong>
            {act.detail}
          </p>
        )}
        {act.record_type === "Инъекция инсулина" && (
          <p>
            <strong className="text-xs">Поставлено: </strong>
            {act.detail} ед.
          </p>
        )}
        {act.record_type === "Измерение глюкозы" && (
          <p>
            <strong className="text-xs">Уровень глюкозы: </strong>
            {act.detail} ммоль
          </p>
        )}
        {act.extra_info && (
          <p>
            <strong className="text-xs">Размер порции: </strong>
            {act.extra_info}
          </p>
        )}
        {act.carbs != null && act.carbs !== 0 && (
          <p>
            <strong className="text-xs">Углеводы: </strong>
            {act.carbs}
          </p>
        )}
        {act.bread_units != null && act.bread_units !== 0 && (
          <p>
            <strong className="text-xs">ХЕ: </strong>
            {act.bread_units}
          </p>
        )}
        {act.comment && (
          <p>
            <strong className="text-xs">Комментарий: </strong>
            {act.comment}
          </p>
        )}
      </div>
    </div>
  );
}
