import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { EarlyAccessCircleVW } from "./components/EarlyAccessCircle/EarlyAccessCircleVW";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const avenir = localFont({
  src: [
    {
      path: "../../../assets/fonts/avenir/avenir-light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../../assets/fonts/avenir/avenir-regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../assets/fonts/avenir/avenir-book.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../assets/fonts/avenir/avenir-heavy.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../../assets/fonts/avenir/avenir-black.ttf",
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

const avenirLTStd = localFont({
  src: [
    {
      path: "../../../assets/fonts/avenirLTStd/AvenirLTStd-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../../assets/fonts/avenirLTStd/AvenirLTStd-Roman.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../assets/fonts/avenirLTStd/AvenirLTStd-Book.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../assets/fonts/avenirLTStd/AvenirLTStd-Medium.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../../assets/fonts/avenirLTStd/AvenirLTStd-Heavy.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../../assets/fonts/avenirLTStd/AvenirLTStd-Black.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../../../assets/fonts/avenirLTStd/AvenirLTStd-LightOblique.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../../assets/fonts/avenirLTStd/AvenirLTStd-Oblique.otf",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-avenir-lt-std",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CatFawn Early Access",
  description: "CatFawn app",
};

export default function CatFawnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${avenir.variable} ${avenirLTStd.variable} ${avenirNext.variable} antialiased select-none`}
      >
        <div className="min-h-screen flex items-center py-5 bg-[#37191D] text-[#FFFFFFE5] p-7">
          <div className="w-[73.875rem] max-lg:container mx-auto">
            <div className="font-avenir grid grid-cols-1 lg:grid-cols-2  max-lg:gap-y-8 items-center">
              <EarlyAccessCircleVW />
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
