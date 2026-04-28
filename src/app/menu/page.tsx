import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Headline from "@/components/UI/headline";
import { verifySession } from "@/lib/auth";
import { getFormattedDateTime } from "@/lib/time-date-formatter";
import ExtraMenu from "@/components/UI/extra-menu";

export const metadata: Metadata = {
  title: "Сегодня",
  keywords: ["Сегодня", "Дневник диабетика"],
};

const buttons = [
  {name: "Смотреть записи", href: `/daily-records?startDate=${getFormattedDateTime().fDate}&endDate=${getFormattedDateTime().fDate}`},
  {name: "Записать приём пищи", href: "/food-intakes/add"},
  {name: "Записать инъекцию", href: "/insulin-injections/add"},
  {name: "Записать значение глюкозы", href: "/glucose-measurements/add"},
  {name: "Анализ показателей", href: "/glucose-measurements/critical"},
];

export default async function MenuPage() {
  const session = await verifySession();
  if (!session) redirect("/auth/login");
  const userName = session.userNane;
  const userId = session.userId;

  return (
    <main
      aria-label="main menu"
      className={`w-full min-h-screen flex flex-col items-center py-10 relative overflow-x-hidden`}
    >
      <ExtraMenu userId={userId}/>
      <Headline text={`${userName}, ${new Date().toLocaleDateString()}`}/>
      <div className="flex flex-col gap-10 items-center w-full lg:w-1/2 mt-10 x-spacing">
        {buttons.map((item, index) => (
        <Link href={item.href} key={index} className="w-full">
          <div className="bg-secondary-blue shadow-[0px_0px_5px_0px_#158AEA] button">
            {item.name}
          </div>
        </Link>
      ))}
      </div>
    </main>
  );
}