"use client";

import { SubmitEvent, useState } from "react";
import { redirect } from "next/navigation";
import FormError from "../UI/form-error";
import Link from "next/link";
import { GrCheckbox, GrCheckboxSelected } from "react-icons/gr";
import { PiEyesLight } from "react-icons/pi";
import FormButton from "../UI/form-button";

export default function LoginForm() {
  const [form, setForm] = useState({
    phone: "+7",
    password: "",
  });
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(undefined);
    setIsLoading(true);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (response.ok) {
      redirect("/menu");
    } else if (response.status === 400) {
      const { error } = await response.json();
      setError(error);
    } else {
      console.error("Ошибка входа");
    }
    setIsLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 w-full md:w-2/3 lg:w-1/2"
    >

      {/* телефон */}
      <fieldset>
        <label className="label">
          Номер телефона <span className="text-accent-red">*</span>
        </label>
        <input
          className="input"
          type="tel"
          value={form.phone}
          placeholder="+7XXXXXXXXXX"
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </fieldset>

      {/* пароль */}
      <fieldset>
        <label className="label">
          Пароль <span className="text-accent-red">*</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            className="input"
            type={showPassword ? "text" : "password"}
            value={form.password}
            placeholder="Пока просто не менее 4 символов"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <PiEyesLight
            size={30}
            className={`cursor-pointer text-secondary-blue ${showPassword ? "scale-x-100" : "-scale-x-100"} transition duration-300`}
            onClick={() => setShowPassword((prev) => !prev)}
          />
        </div>
      </fieldset>

      <FormButton name="Войти" isLoading={isLoading}/>

      <Link
        href={"/auth/register"}
        className="link mt-2 italic h-10 flex items-center justify-center text-secondary-blue text-right"
      >
        Ещё не зарегистрированы? ⭢
      </Link>
    </form>
  );
}