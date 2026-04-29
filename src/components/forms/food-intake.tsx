"use client";

import { SubmitEvent, useState } from "react";
import { redirect } from "next/navigation";
import FormError from "../UI/form-error";
import { FoodIntakeFormErrors } from "@/lib/types";
import FormButton from "../UI/form-button";
import { getFormattedDateTime } from "@/lib/time-date-formatter";

interface Props {
  userId: number;
}

const options = ["обычный", "меньше обычного", "больше обычного"];

export default function FoodIntakeForm({ userId }: Props) {
  const [form, setForm] = useState({
    user_id: userId,
    meal_date: getFormattedDateTime().fDate,
    meal_time: getFormattedDateTime().fTime,
    description: "",
    portion_size: "обычный",
    carbs: 0,
    bread_units: 0,
    comment: "",
  });
  const [errors, setErrors] = useState<FoodIntakeFormErrors | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors(undefined);
    setIsLoading(true);
    const response = await fetch("/api/food-intakes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (response.ok) {
      redirect("/menu");
    } else if (response.status === 400) {
      setErrors((await response.json()).errors);
    } else {
      console.error("Ошибка регистрации");
    }
    setIsLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 w-full md:w-2/3 lg:w-1/2"
    >
      <div className="w-full flex justify-between">
        {/* дата */}
        <fieldset className="w-[45%]">
          <label className="label">
            Дата <span className="text-accent-red">*</span>
          </label>
          <input
            className="input"
            type="date"
            value={form.meal_date}
            onChange={(e) =>
              setForm({
                ...form,
                meal_date: getFormattedDateTime(e.target.value).fDate,
              })
            }
          />
        </fieldset>

        {/* время */}
        <fieldset className="w-[45%]">
          <label className="label">
            Время <span className="text-accent-red">*</span>
          </label>
          <input
            className="input"
            type="time"
            value={form.meal_time}
            onChange={(e) =>
              setForm({
                ...form,
                meal_time: getFormattedDateTime(undefined, e.target.value).fTime,
              })
            }
          />
        </fieldset>
      </div>

      {/* описание */}
      <fieldset>
        <label className="label">
          Описание <span className="text-accent-red">*</span>
        </label>
        <input
          className="input"
          autoFocus
          value={form.description}
          placeholder="Что именно съедено (до 500 символов)"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div aria-live="polite" aria-atomic="true">
          {errors?.description &&
            errors.description.map((error: string, i) => (
              <FormError errorField={error} key={i} />
            ))}
        </div>
      </fieldset>

      {/* Размер порции */}
      <fieldset>
        <label className="label">
          Размер порции <span className="text-accent-red">*</span>
        </label>
        <select
          value={form.portion_size}
          onChange={(e) => setForm({ ...form, portion_size: e.target.value })}
          className="input"
        >
          {options.map((option) => (
            <option key={option} value={option} className="rounded-2xl">
              {option}
            </option>
          ))}
        </select>
      </fieldset>

      {/* комментарий */}
      <fieldset>
        <label className="label">Комментарий</label>
        <textarea
          className="input resize-none"
          value={form.comment}
          placeholder="Для заметок... (до 1000 символов)"
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
          rows={5}
        />
        <div aria-live="polite" aria-atomic="true">
          {errors?.comment &&
            errors.comment.map((error: string, i) => (
              <FormError errorField={error} key={i} />
            ))}
        </div>
      </fieldset>

      <label className="label translate-y-2">Также можно записать</label>
      <div className="w-full flex justify-evenly border border-dashed py-5">
        {/* углеводы */}
        <fieldset className="w-[40%]">
          <label className="label">Углеводы</label>
          <input
            className="input"
            type="number"
            min={0}
            value={form.carbs}
            onChange={(e) =>
              setForm({ ...form, carbs: Number(e.target.value) })
            }
          />
        </fieldset>

        {/* ХЕ */}
        <fieldset className="w-[40%]">
          <label className="label">ХЕ</label>
          <input
            className="input"
            type="number"
            min={0}
            value={form.bread_units}
            onChange={(e) =>
              setForm({ ...form, bread_units: Number(e.target.value) })
            }
          />
        </fieldset>
      </div>

      <FormButton name="Добавить" isLoading={isLoading} />
    </form>
  );
}
