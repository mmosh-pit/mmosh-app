import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter, Poppins } from "next/font/google";
import ConfigHOC from "../components/ConfigHOC";
import Header from "../components/Header";
import "../globals.css";
import { getUserDataForMetadata } from "../lib/getUserDataForMetadata";

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

type Props = {
  params: { username: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const username = params.username;

  if (!username) {
    return {
      title: "MMOSH App Home",
      description:
        "MMOSH: The Stoked Token. Join us for an epic adventure beyond time, space and the death-grip of global civilization. Let’s make money fun!",
      openGraph: {
        images: [
          "https://storage.googleapis.com/mmosh-assets/metadata_image.png",
        ],
      },
    };
  }

  const user = await getUserDataForMetadata(username);

  if (!user) {
    return {
      title: "MMOSH App Home",
      description:
        "MMOSH: The Stoked Token. Join us for an epic adventure beyond time, space and the death-grip of global civilization. Let’s make money fun!",
      openGraph: {
        images: [
          "https://storage.googleapis.com/mmosh-assets/metadata_image.png",
        ],
      },
    };
  }

  return {
    title: `MMOSH App ${user?.profile?.username} Hideout`,
    description: user?.profile?.bio,
    openGraph: {
      images: [
        user?.profile?.image ||
          "https://storage.googleapis.com/mmosh-assets/metadata_image.png",
      ],
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${patched.variable}`}>
      <head>
        <link rel="icon" href="/mmosh.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <ConfigHOC>
          <Header isHome={false} />
          <div className="h-full">{children}</div>
        </ConfigHOC>
      </body>
    </html>
  );
}
