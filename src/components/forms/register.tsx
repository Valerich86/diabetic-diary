"use client";

import { SubmitEvent, useState } from "react";
import { redirect } from "next/navigation";
import FormError from "../UI/form-error";
import Link from "next/link";
import { GrCheckbox, GrCheckboxSelected } from "react-icons/gr";
import { RegisterFormErrors } from "@/lib/types";
import { PiEyesLight } from "react-icons/pi";
import FormButton from "../UI/form-button";

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "+7",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<RegisterFormErrors | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors(undefined);
    setIsLoading(true);
    const response = await fetch("/api/auth/register", {
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
      <fieldset>
        <label className="label">
          Имя <span className="text-accent-red">*</span>
        </label>
        <input
          className="input"
          value={form.name}
          autoFocus
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <div aria-live="polite" aria-atomic="true">
          {errors?.name &&
            errors.name.map((error: string, i) => (
              <FormError errorField={error} key={i} />
            ))}
        </div>
      </fieldset>

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
        <div aria-live="polite" aria-atomic="true">
          {errors?.phone &&
            errors.phone.map((error: string, i) => (
              <FormError errorField={error} key={i} />
            ))}
        </div>
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
        <div id="password-error" aria-live="polite" aria-atomic="true">
          {errors?.password &&
            errors.password.map((error: string, i) => (
              <FormError errorField={error} key={i} />
            ))}
        </div>
      </fieldset>

      {/* пароль 2 */}
      <fieldset>
        <label className="label">
          Повторите пароль <span className="text-accent-red">*</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            className="input"
            type={showConfirm ? "text" : "password"}
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
          />
          <PiEyesLight
            size={30}
            className={`cursor-pointer text-secondary-blue ${showConfirm ? "" : "-scale-x-100"} transition duration-300`}
            onClick={() => setShowConfirm((prev) => !prev)}
          />
        </div>
        <div id="confirmPassword-error" aria-live="polite" aria-atomic="true">
          {errors?.confirmPassword &&
            errors.confirmPassword.map((error: string, i) => (
              <FormError errorField={error} key={i} />
            ))}
        </div>
      </fieldset>

      <div className="w-full text-sm my-5 text-zinc-500">
        <label className="flex items-start">
          <div onClick={() => setPrivacyAgreed(prev => !prev)} className="mt-0.5 text-secondary-blue cursor-pointer">
            {!privacyAgreed && <GrCheckbox size={15}/>}
            {privacyAgreed && <GrCheckboxSelected size={15}/>}
          </div>
          <span className="ml-2 text-zinc-500">
            Я даю согласие на обработку моих персональных данных в соответствии
            с{" "}
            <Link
              href="/privacy-policy"
              className="text-secondary-blue"
              target="_blank"
              rel="noopener noreferrer"
            >
              Политикой конфиденциальности
            </Link>
            <span className="text-accent-red"> *</span>
          </span>
        </label>
        {errors?.policy && <FormError errorField={errors.policy} />}
      </div>

      <FormButton name="Зарегистрироваться" disabled={!privacyAgreed} isLoading={isLoading}/>

      <Link
        href={"/auth/login"}
        className="link mt-2 italic h-10 flex items-center justify-center text-secondary-blue text-right"
      >
        Уже зарегистрированы? ⭢
      </Link>
    </form>
  );
}