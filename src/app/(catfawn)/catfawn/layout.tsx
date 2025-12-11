import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "300", "400", "600", "700"],
});

export const metadata: Metadata = {
  title: "CatFawn Early Access",
  description: "CatFawn app",
};

const avenir = localFont({
  src: [
    {
      path: "../../../assets/fonts/avenir-light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../../assets/fonts/avenir-regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../assets/fonts/avenir-book.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../assets/fonts/avenir-heavy.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../../assets/fonts/avenir-black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-avenir",
  display: "swap",
});

const avenirNext = localFont({
  src: [
    {
      path: "../../../assets/fonts/avenir-next/avenir-next-lT-pro-regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../assets/fonts/avenir-next/avenir-next-lT-pro-italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../../assets/fonts/avenir-next/avenir-next-lT-pro-demi.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../../assets/fonts/avenir-next/avenir-next-lT-pro-demi-italic.otf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../../../assets/fonts/avenir-next/avenir-next-lT-pro-bold.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../../assets/fonts/avenir-next/avenir-next-lT-pro-condensed.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-avenir-next",
  display: "swap",
});

export default function CatFawnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${avenir.variable} ${avenirNext.variable} antialiased`}
      >
        <div className="min-h-screen flex items-center py-5 bg-[#2b1417] text-[#FFFFFFE5]">
          <div className="max-w-[73.875rem] mx-auto">{children}</div>
        </div>
      </body>
    </html>
  );
}
