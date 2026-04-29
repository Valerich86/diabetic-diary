"use client";

import { ImArrowLeft } from "react-icons/im";
import { useRouter, usePathname } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      {pathname !== "/" && pathname !== "/menu" && (
        <button
          className="z-40 text-primary-milk hover:opacity-90 cursor-pointer"
          onClick={() => router.back()}
        >
          <ImArrowLeft size={20}/>
        </button>
      )}
    </>
  );
}