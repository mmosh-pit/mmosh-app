import type { Metadata } from "next";
import "../globals.css";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Liquid Hearts Club",
    description:
      "Go deeper. Join us on the cutting edge of culture for an epic adventure beyond time, space and the death-grip of global civilization.",
    openGraph: {
      images: ["https://storage.googleapis.com/mmosh-assets/lhc_metadata.png"],
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="h-full">{children}</div>;
}
