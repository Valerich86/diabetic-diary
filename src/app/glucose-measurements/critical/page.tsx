import Headline from "@/components/UI/headline";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import GlucoseAnalysis from "@/components/glucose-critical";

export const metadata: Metadata = {
  title: "График глюкозы",
  keywords: ["График глюкозы", "Дневник диабетика"],
};

export default async function CriticalGlucoseValuesPage() {
  const session = await verifySession();
  if (!session) redirect("/auth/login");
  const userId = session.userId;

  return (
    <main
      aria-label="График глюкозы"
      className={`flex flex-col w-full my-15`}
    >
      <Headline text="График глюкозы" />
      <div className="w-full x-spacing">
        <GlucoseAnalysis userId={userId}/>
      </div>
    </main>
  );
}
