import Headline from "@/components/UI/headline";
import { Metadata } from "next";
import InsulinInjectionForm from "@/components/forms/insulin-injection";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Добавление инсулина",
  keywords: ["Инъекция инсулина", "Дневник диабетика"],
};

export default async function AddInsulinPage() {
  const session = await verifySession();
  if (!session) redirect("/auth/login");
  const userId = session.userId;

  return (
    <main
      aria-label="страница добавления инсулина"
      className={`flex flex-col w-full my-15`}
    >
      <Headline text="Добавление инъекции инсулина" />
      <div className="w-full x-spacing">
        <p className="text-accent text-xs mt-5 text-accent-red">
          * - обязательное поле
        </p>
        <InsulinInjectionForm userId={userId}/>
      </div>
    </main>
  );
}
