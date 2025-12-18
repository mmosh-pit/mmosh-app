import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

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
        className={`${poppins.variable} ${avenir.variable} ${avenirNext.variable} antialiased select-none`}
      >
        <div className="min-h-screen flex items-center py-5 bg-[#37191D] text-[#FFFFFFE5] px-4">
          <div className="w-[73.875rem] max-lg:container mx-auto">
            <div className="font-avenir grid grid-cols-1 lg:grid-cols-2  max-lg:gap-y-8 items-center">
              <div className="flex flex-col gap-[1.875rem]">
                <h1 className="font-poppinsNew text-[2.188rem] max-md:text-2xl font-bold leading-[110%] max-lg:text-center bg-gradient-to-r from-[#FFFFFF] to-[#FFFFFF88] bg-clip-text text-transparent">
                  Join the CAT FAWN Connection <br className="max-md:hidden" />
                  Early Access Circle
                </h1>

                <div className="text-[1rem] text-[#FFFFFFE5] leading-[130%] max-md:text-sm font-normal max-lg:w-max max-lg:mx-auto max-md:w-auto max-lg:text-start text-wrap">
                  <p>
                    Be among the first to use CAT FAWN Connection
                    <br />
                    to change yourself, change your life, and change the world.
                    <br />
                    As an early access member, you&apos;ll:
                  </p>

                  <ul>
                    <li>• Experience the app before public launch</li>
                    <li>• Share insights that will shape the product</li>
                    <li>
                      • Join live sessions + private groups with Four Arrows &
                      Kinship
                    </li>
                  </ul>
                </div>
              </div>
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
