'use client';

import { motion } from "framer-motion";
import { font_headline } from "@/lib/fonts";
import BackButton from "./back-button";

export default function Headline({ text }: { text: string }) {
  return (
    <div
      className={`x-spacing text-primary-milk fixed inset-0 h-13 flex items-center
        bg-secondary-violet border-y border-violet-400 w-full z-50
        shadow-[0px_0px_5px_0px_#7B37DC] overflow-x-hidden`}
    >
      <motion.div
        initial={{x: "-100%"}}
        animate={{x: 0}}
        className="w-full text-center lg:text-left flex gap-5 items-center"
      >
        <BackButton />
        <h1 className={`${font_headline.className} text-xl`}>
        {text}
      </h1>
      </motion.div>
    </div>
  );
}
