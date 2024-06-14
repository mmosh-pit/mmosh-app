import type { Metadata } from "next";
import "../globals.css";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "MMOSH App Forge",
    description:
      "MMOSH: The Stoked Token. Join us for an epic adventure beyond time, space and the death-grip of global civilization. Let’s make money fun!",
    openGraph: {
      images: [
        "https://storage.googleapis.com/mmosh-assets/metadata_image.png",
      ],
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="h-full">{children}</div>;
}
