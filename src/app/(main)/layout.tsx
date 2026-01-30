import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter, Poppins } from "next/font/google";
import Header from "./components/Header";
import "../globals.css";
// import Footer from "./components/Footer";
import ConfigHOC from "./components/ConfigHOC";
import Footer from "./footer";


const inter = Inter({ subsets: ["latin"] });

const patched = localFont({
  src: "../Patched-Medium.otf",
  display: "swap",
  variable: "--font-patched",
});

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const avenir = localFont({
  src: [
    {
      path: "../../assets/fonts/avenir/avenir-light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../assets/fonts/avenir/avenir-regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../assets/fonts/avenir/avenir-book.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../assets/fonts/avenir/avenir-heavy.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../assets/fonts/avenir/avenir-black.ttf",
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
      path: "../../assets/fonts/avenir-next/avenir-next-lT-pro-regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../assets/fonts/avenir-next/avenir-next-lT-pro-italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../assets/fonts/avenir-next/avenir-next-lT-pro-demi.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../assets/fonts/avenir-next/avenir-next-lT-pro-demi-italic.otf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../../assets/fonts/avenir-next/avenir-next-lT-pro-bold.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../assets/fonts/avenir-next/avenir-next-lT-pro-condensed.otf",
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
      path: "../../assets/fonts/avenirLTStd/AvenirLTStd-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../assets/fonts/avenirLTStd/AvenirLTStd-Roman.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../assets/fonts/avenirLTStd/AvenirLTStd-Book.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../assets/fonts/avenirLTStd/AvenirLTStd-Medium.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../assets/fonts/avenirLTStd/AvenirLTStd-Heavy.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../assets/fonts/avenirLTStd/AvenirLTStd-Black.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../../assets/fonts/avenirLTStd/AvenirLTStd-LightOblique.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../assets/fonts/avenirLTStd/AvenirLTStd-Oblique.otf",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-avenir-lt-std",
  display: "swap",
});


export const metadata: Metadata = {
  title: "Kinship Bots",
  description:
    "Kinship Intelligence is a creator co-op that serves as a calm, relational alternative to big tech—where AI supports wisdom, care, and collective action through living systems, shared spaces, and real human connection.",
  openGraph: {
    images: [
      "https://storage.googleapis.com/mmosh-assets/Kinship%20Meta%20OG.png",
    ],
    siteName: "Kinship Bots",
    title: "Kinship Intelligence — Where AI Belongs",
    description:
      "The creator cooperative for people shaping the world together. Kinship Intelligence supports and coordinates purposeful, creative, and powerful work without attention farming, value extraction or psychological manipulation.",
    url: "https://kinshipbots.com",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${patched.variable} ${avenir.variable} ${avenirNext.variable} ${avenirLTStd.variable}`}>
      <head>
        <link rel="icon" href="/mmosh.ico" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body className={`${inter.className}`}>
        <ConfigHOC>
          <main className="grow">{children}</main>
          <Footer />
        </ConfigHOC>
      </body>
    </html>
  );
}
