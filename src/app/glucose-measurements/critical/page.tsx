import Headline from "@/components/UI/headline";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import GlucoseAnalysis from "@/components/glucose-critical";

export const metadata: Metadata = {
  title: "Анализ критических значений",
  keywords: ["Анализ критических значений глюкозы", "Дневник диабетика"],
};

export default async function CriticalGlucoseValuesPage() {
  const session = await verifySession();
  if (!session) redirect("/auth/login");
  const userId = session.userId;

  return (
    <main
      aria-label="Анализ критических значений глюкозы"
      className={`flex flex-col w-full py-10`}
    >
      <Headline text="Анализ значений глюкозы" />
      <div className="w-full x-spacing">
        <GlucoseAnalysis userId={userId}/>
      </div>
    </main>
  );
}
