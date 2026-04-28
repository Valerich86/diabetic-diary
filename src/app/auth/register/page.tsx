import Headline from "@/components/UI/headline";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import RegisterForm from "@/components/forms/register";
import { verifySession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Регистрация",
  keywords: ["Регистрация", "Дневник диабетика"],
};

export default async function RegisterPage() {
  const session = await verifySession();
  if (session) redirect("/menu");

  return (
    <main
      aria-label="регистрация"
      className={`flex flex-col w-full py-10`}
    >
      <Headline text="Регистрация" />
      <div className="w-full x-spacing">
        <span className="text-xs text-secondary-violet">
          Чтобы использовать приложение, необходимо пройти регистрацию
        </span>
        <p className="text-accent text-xs mt-5 text-accent-red">
          * - обязательное поле
        </p>
        <RegisterForm />
      </div>
    </main>
  );
}
