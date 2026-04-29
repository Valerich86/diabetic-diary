import Headline from "@/components/UI/headline";
import { Metadata } from "next";
import GlucoseMeasurementForm from "@/components/forms/glucose-measurement";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Измерение глюкозы",
  keywords: ["Измерение глюкозы", "Дневник диабетика"],
};

export default async function AddGlucoseMeasurementPage() {
  const session = await verifySession();
  if (!session) redirect("/auth/login");
  const userId = session.userId;

  return (
    <main
      aria-label="страница измерения глюкозы"
      className={`flex flex-col w-full my-15`}
    >
      <Headline text="Добавление значения глюкозы" />
      <div className="w-full x-spacing">
        <p className="text-accent text-xs mt-5 text-accent-red">
          * - обязательное поле
        </p>
        <GlucoseMeasurementForm userId={userId}/>
      </div>
    </main>
  );
}
