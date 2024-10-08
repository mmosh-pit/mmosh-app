import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter, Poppins } from "next/font/google";
import ConfigHOC from "./components/ConfigHOC";
import Header from "./components/Header";
import "./globals.css";
import AuthOverlay from "./components/common/AuthOverlay";

const inter = Inter({ subsets: ["latin"] });

const patched = localFont({
  src: "./Patched-Medium.otf",
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
  title: "Liquid Hearts Club",
  description:
    "Go deeper. Join us on the privacy superdapp for an epic adventure beyond time, space and the death-grip of global civilization.",
  openGraph: {
    images: ["https://storage.googleapis.com/mmosh-assets/metadata.png"],
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
          <Header />
          <main className="min-h-screen">{children}</main>
          <AuthOverlay />
        </ConfigHOC>
      </body>
    </html>
  );
}
