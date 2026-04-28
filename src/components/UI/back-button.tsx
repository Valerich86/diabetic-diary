"use client";

import { ImArrowLeft } from "react-icons/im";
import { useRouter, usePathname } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    // router.refresh();
    router.back()
    // setTimeout(() => router.back(), 50);
  };

  return (
    <>
      {pathname !== "/" && pathname !== "/menu" && (
        <button
          className="z-40 text-primary-milk hover:opacity-90 cursor-pointer"
          onClick={handleBack}
        >
          <ImArrowLeft size={20}/>
        </button>
      )}
    </>
  );
}