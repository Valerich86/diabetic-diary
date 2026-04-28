import type { Metadata } from "next";
import "./globals.css";
import { font_body } from "../lib/fonts";

export const metadata: Metadata = {
  title: {
    template: "Дневник диабетика | %s",
    default: "Дневник диабетика",
  },
  keywords: ["Дневник диабетика"],
  description:
    "Дневник диабетика. Приложение для ведения записей и анализа показателей для больных диабетом 1 типа",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${font_body.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-fixed bg-linear-to-br from-white to-secondary-light-blue bg-cover text-secondary-violet">
        {children}
      </body>
    </html>
  );
}
