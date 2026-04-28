"use client";

import { SubmitEvent, useState } from "react";
import { redirect } from "next/navigation";
import FormError from "../UI/form-error";
import { GlucoseMeasurementFormErrors } from "@/lib/types";
import FormButton from "../UI/form-button";
import { getFormattedDateTime } from "@/lib/time-date-formatter";

interface Props {
  userId: number;
}

interface MeasurementData {
  user_id: number;
  measurement_date: string;
  measurement_time: string;
  amount?: number;
  comment: string;
}

export default function GlucoseMeasurementForm({ userId }: Props) {
  const [form, setForm] = useState<MeasurementData>({
    user_id: userId,
    measurement_date: getFormattedDateTime().fDate,
    measurement_time: getFormattedDateTime().fTime,
    amount: undefined,
    comment: "",
  });
  const [errors, setErrors] = useState<GlucoseMeasurementFormErrors | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors(undefined);
    setIsLoading(true);
    const response = await fetch("/api/glucose-measurements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (response.ok) {
      redirect("/menu");
    } else if (response.status === 400) {
      setErrors((await response.json()).errors);
    } else {
      console.error("Ошибка добавления данных");
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
            value={form.measurement_date}
            onChange={(e) =>
              setForm({
                ...form,
                measurement_date: getFormattedDateTime(e.target.value).fDate,
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
            value={form.measurement_time}
            onChange={(e) =>
              setForm({
                ...form,
                measurement_time: getFormattedDateTime(undefined, e.target.value).fTime,
              })
            }
          />
        </fieldset>
      </div>

      {/* количество */}
      <fieldset>
          <label className="label">Количество ммоль</label>
          <input
            className="input"
            type="number"
            step={0.1}
            min={1}
            value={form.amount}
            onChange={(e) =>
              setForm({ ...form, amount: Number(e.target.value) })
            }
          />
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

      <FormButton name="Добавить" isLoading={isLoading} />
    </form>
  );
}
