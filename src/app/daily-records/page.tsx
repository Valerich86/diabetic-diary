import { Metadata } from "next";
import { redirect } from "next/navigation";
import Headline from "@/components/UI/headline";
import { verifySession } from "@/lib/auth";
import { ActionList } from "@/components/lists/action-list";
import { getFormattedDateTime } from "@/lib/time-date-formatter";

export const metadata: Metadata = {
  title: "Данные за период",
  keywords: ["Данные за период", "Дневник диабетика"],
};

export default async function OneDayInfoPage({
  searchParams,
}: {
  searchParams: Promise<{ startDate: string, endDate: string }>;
}) {
  let {startDate, endDate} = await searchParams;
  const session = await verifySession();
  if (!session) redirect("/auth/login");
  const userId = session.userId;
  if (!startDate) startDate = endDate = getFormattedDateTime().fDate;

  return (
    <main
      aria-label="Ваши записи"
      className={`w-full min-h-screen my-15`}
    >
      <Headline text={`Ваши записи`} />
      <ActionList userId={userId} begin={startDate} end={endDate}/>
    </main>
  );
}
