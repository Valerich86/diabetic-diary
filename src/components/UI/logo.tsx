import { font_logo } from "@/lib/fonts";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href={"/menu"}>
      <div
      className={`${font_logo.className} text-2xl lg:text-5xl pb-5 pt-3 lg:py-7 rounded-full w-full
      bg-secondary-violet border border-violet-400 text-primary-milk text-center
      shadow-[0px_0px_40px_5px_#7B37DC] animate-logo`}
    >
      <p>Дневник диабетика</p>
    </div>
    </Link>
  );
}
