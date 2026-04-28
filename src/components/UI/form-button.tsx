"use client";

import { PiSpinnerGapThin } from "react-icons/pi";

interface Props {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  name: string;
  buttonType?: "button" | "submit" | "reset";
  isLoading?: boolean;
  disabled?: boolean;
}

export default function FormButton({
  onClick,
  name,
  buttonType = "submit",
  isLoading = false,
  disabled = false,
}: Props) {
  return (
    <button
      className={`w-full py-2 rounded-full text-center font-bold border bg-accent-yellow mt-5
      ${!disabled || isLoading ? "hover:opacity-85 active:scale-99 cursor-pointer opacity-100" : "opacity-40"}`}
      type={buttonType}
      disabled={disabled}
    >
      {!isLoading ? (
        name
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <PiSpinnerGapThin className="text-center animate-spin" size={25} />
        </div>
      )}
    </button>
  );
}
