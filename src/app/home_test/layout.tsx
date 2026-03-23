import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter, Poppins } from "next/font/google";
import "../globals.css";
// import Footer from "./footer";
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
  title: "Kinship Agents — The Marketplace for Cooperative AI",
  description:
    "Design, develop, and deploy intelligent agents that listen, learn, and cooperate. A decentralized marketplace for coherent, cohesive agents that care.",
  openGraph: {
    images: ["https://storage.googleapis.com/mmosh-assets/kinship_meta.png"],
    siteName: "Kinship Agents",
    title: "Build Agents. Not Apps.",
    description:
      "Design, develop, and deploy intelligent agents that listen, learn, and cooperate. A decentralized marketplace for coherent, cohesive agents that care.",
    url: "https://kinship.today",
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
        </ConfigHOC>
      </body>
    </html>
  );
}
