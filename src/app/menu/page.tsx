import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Headline from "@/components/UI/headline";
import { verifySession } from "@/lib/auth";
import { getFormattedDateTime } from "@/lib/time-date-formatter";
import ExtraMenu from "@/components/UI/extra-menu";
import { FaClipboardList, FaChartLine } from "react-icons/fa";
import { GiHotMeal, GiLoveInjection } from "react-icons/gi";
import { LiaThermometerSolid } from "react-icons/lia";

export const metadata: Metadata = {
  title: "Сегодня",
  keywords: ["Сегодня", "Дневник диабетика"],
};

const buttons = [
  {
    name: "Смотреть записи",
    href: `/daily-records?startDate=${getFormattedDateTime().fDate}&endDate=${getFormattedDateTime().fDate}`,
    Icon: FaClipboardList,
  },
  { name: "Записать приём пищи", href: "/food-intakes/add", Icon: GiHotMeal },
  {
    name: "Записать инъекцию",
    href: "/insulin-injections/add",
    Icon: GiLoveInjection,
  },
  {
    name: "Записать значение глюкозы",
    href: "/glucose-measurements/add",
    Icon: LiaThermometerSolid,
  },
  {
    name: "График глюкозы",
    href: "/glucose-measurements/critical",
    Icon: FaChartLine,
  },
];

export default async function MenuPage() {
  const session = await verifySession();
  if (!session) redirect("/auth/login");
  const userName = session.userNane;
  const userId = session.userId;

  return (
    <main
      aria-label="main menu"
      className={`w-full min-h-screen flex flex-col items-center justify-center relative overflow-x-hidden`}
    >
      <ExtraMenu userId={userId} />
      <Headline text={`${userName}, ${new Date().toLocaleDateString('ru-RU')}`} />
      <div className="flex flex-col gap-10 items-center w-full lg:w-1/2 x-spacing">
        {buttons.map((item, index) => {
          const { Icon, ...rest } = item;
          return(
          <Link href={item.href} key={index} className="w-full">
            <div className="bg-secondary-blue shadow-[0px_0px_5px_0px_#158AEA] flex justify-center gap-3 items-center button">
              {Icon && <Icon size={20}/>}
              {item.name}
            </div>
          </Link>
        )
        })}
      </div>
    </main>
  );
}
