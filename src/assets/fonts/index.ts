import localFont from "next/font/local";

export const sfProDisplay = localFont({
  src: [
    {
      path: "./sf-bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./sf-medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./sf-regular.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-sf",
  display: "swap",
});
