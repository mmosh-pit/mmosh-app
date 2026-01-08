import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter, Poppins } from "next/font/google";
import "../globals.css";
import Footer from "./footer";
import ConfigHOC from "../(main)/components/ConfigHOC";
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
    <html lang="en" className={`${poppins.variable} ${patched.variable}`}>
      <head>
        <link rel="icon" href="/mmosh.ico" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body className={inter.className}>
        <ConfigHOC>
          <main className="grow">{children}</main>
          <Footer />
        </ConfigHOC>
      </body>
    </html>
  );
}
