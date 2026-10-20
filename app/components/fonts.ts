import { Bricolage_Grotesque, DM_Sans } from "next/font/google";

export const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
});
export const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});