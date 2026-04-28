"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FaUserCog } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function ExtraMenu({ userId }: { userId: number }) {
  const [isOpened, setIsOpened] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (
        elementRef.current &&
        !elementRef.current.contains(event.target as Node) &&
        !iconRef.current?.contains(event.target as Node)
      ) {
        setIsOpened(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [elementRef]);

  const handleSwipe = (direction: number) => {
    // Свайп влево: направление < 0, достаточно большое движение
    if (direction > 50) {
      setIsOpened(false);
    }
  };

  const handleClear = async () => {
    try {
      await fetch(`/api/all-records?userId=${userId}`, {method: "DELETE"});
      setIsOpened(false);
      router.replace("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`/api/auth/logout`);
      setIsOpened(false);
      router.replace("/auth/login");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`/api/auth/delete?userId=${userId}`, {method: "DELETE"});
      setIsOpened(false);
      router.replace("/auth/register");
    } catch (error) {
      console.error(error);
    }
  };

  const buttons = [
    { name: "Очистить данные", action: handleClear },
    { name: "Выйти из уч.записи", action: () => handleLogout() },
    { name: "Удалить уч.запись", action: handleDelete },
  ];

  return (
    <>
      <div
        ref={iconRef}
        className="absolute top-14 right-5 lg:right-25 text-primary-milk"
      >
        <button
          className="hover:opacity-90"
          onClick={() => setIsOpened(isOpened ? false : true)}
        >
          <FaUserCog size={23} />
        </button>
      </div>
      <AnimatePresence>
        {isOpened && (
          <motion.div
            ref={elementRef}
            initial={{ x: "100%" }} // Появляется слева
            animate={{ x: 0 }}
            exit={{ x: "100%" }} // Исчезает влево
            transition={{ duration: 0.1, ease: "easeOut" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(event, info) => {
              const swipeDistance = info.offset.x;
              handleSwipe(swipeDistance);
            }}
            aria-label="меню профиля"
            className={`py-5 px-5 h-[80vh] w-50 rounded-l-xl absolute right-0 top-25 z-50 bg-secondary-violet text-primary-milk
              shadow-[0px_0px_30px_25px_#7B37DC50] flex flex-col gap-5`}
          >
            {buttons.map((option, index) => (
              <button key={index} className="bg-secondary-blue shadow-[0px_0px_5px_0px_#158AEA] button text-xs" onClick={option.action}>
                {option.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
