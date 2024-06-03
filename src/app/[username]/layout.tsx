import type { Metadata } from "next";
import "../globals.css";
import { getUserDataForMetadata } from "../lib/getUserDataForMetadata";

type Props = {
  params: { username: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const username = params.username;
  //
  // if (username === "create") {
  //   return {
  //     title: "MMOSH App Forge",
  //     description:
  //       "MMOSH: The Stoked Token. Join us for an epic adventure beyond time, space and the death-grip of global civilization. Let’s make money fun!",
  //     openGraph: {
  //       images: [
  //         "https://storage.googleapis.com/mmosh-assets/metadata_image.png",
  //       ],
  //     },
  //   };
  // }

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
  return <div className="h-full">{children}</div>;
}
