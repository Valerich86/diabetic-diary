import localFont from "next/font/local";
import {
  Klee_One, Caveat, Pacifico,
  Montserrat_Alternates, Montserrat
} from "next/font/google";

// export const font_default = localFont({
//   src: "../../public/fonts/grato/Grato Grotesk-Regular-Web.ttf",
// });

export const font_logo = Klee_One({
  weight: "600",
});

export const font_body = Montserrat({
  weight: "400",
});

export const font_headline = Montserrat_Alternates({
  weight: "700",
});
