import Headline from "@/components/UI/headline";
import { Metadata } from "next";
import FoodIntakeForm from "@/components/forms/food-intake";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Добавление приёма пищи",
  keywords: ["Приём пищи", "Дневник диабетика"],
};

export default async function AddFoodIntakePage() {
  const session = await verifySession();
  if (!session) redirect("/auth/login");
  const userId = session.userId;

  return (
    <main
      aria-label="страница добавления приёма пищи"
      className={`flex flex-col w-full py-10`}
    >
      <Headline text="Добавление приёма пищи" />
      <div className="w-full x-spacing">
        <p className="text-accent text-xs mt-5 text-accent-red">
          * - обязательное поле
        </p>
        <FoodIntakeForm userId={userId}/>
      </div>
    </main>
  );
}
