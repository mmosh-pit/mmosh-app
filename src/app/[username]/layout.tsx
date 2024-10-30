import type { Metadata } from "next";
import "../globals.css";
import { getUserDataForMetadata } from "../lib/getUserDataForMetadata";

type Props = {
  params: { username: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const username = params.username;

  if (!username) {
    return {
      title: "Liquid Hearts Club",
      description:
        "Go deeper. Join us on the cutting edge of culture for an epic adventure beyond time, space and the death-grip of global civilization.",
      openGraph: {
        images: [
          "https://storage.googleapis.com/mmosh-assets/lhc_metadata.png",
        ],
      },
    };
  }

  // const user = await getUserDataForMetadata(username);

  // if (!user) {
  return {
    title: "Liquid Hearts Club",
    description:
      "Go deeper. Join us on the privacy superdapp for an epic adventure beyond time, space and the death-grip of global civilization.",
    openGraph: {
      images: ["https://storage.googleapis.com/mmosh-assets/metadata.png"],
    },
  };
  // }

  // return {
  //   title: `MMOSH App ${user?.profile?.username} Hideout`,
  //   description: user?.profile?.bio,
  //   openGraph: {
  //     images: [
  //       user?.profile?.image ||
  //         "https://storage.googleapis.com/mmosh-assets/metadata_image.png",
  //     ],
  //   },
  // };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="h-full">{children}</div>;
}
