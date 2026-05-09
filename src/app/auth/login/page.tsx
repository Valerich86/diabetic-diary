import Headline from "@/components/UI/headline";
import { Metadata } from "next";
import LoginForm from "@/components/forms/login";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Вход",
  keywords: ["Вход", "Дневник диабетика"],
};

export default async function RegisterPage() {
  const session = await verifySession();
  if (session) redirect("/menu");

  return (
    <main
      aria-label="вход"
      className={`flex flex-col w-full py-15`}
    >
      <Headline text="Вход" />
      <div className="w-full x-spacing">
        <span className="text-xs text-secondary-violet">
          Чтобы использовать приложение, необходимо войти в учётную запись
        </span>
        <p className="text-accent text-xs mt-5 text-accent-red">
          * - обязательное поле
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
