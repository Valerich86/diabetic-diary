'use client';

import { motion } from "framer-motion";
import { font_headline } from "@/lib/fonts";
import BackButton from "./back-button";

export default function Headline({ text }: { text: string }) {
  return (
    <div
      className={`py-3 x-spacing text-primary-milk mb-5
        bg-secondary-violet border-y border-violet-400 w-full
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
