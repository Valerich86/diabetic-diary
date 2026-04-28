import Image from "next/image";
import { font_logo } from "../lib/fonts";
import Logo from "@/components/UI/logo";

export default function Home() {
  return (
    <main 
      aria-label="Заставка/лого" 
      className="flex w-full h-screen flex-col items-center justify-center overflow-hidden relative"
    >
      <div
        className={`bg-[url('/images/bg_1.webp')] absolute inset-0 bg-cover 
          bg-no-repeat bg-center -z-10 animate-bg`}
      ></div>
      <div className="w-[90%] lg:w-[70%]">
        <Logo />
      </div>
    </main>
  );
}
