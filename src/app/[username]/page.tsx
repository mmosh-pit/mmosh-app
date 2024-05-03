"use client";

import Forge from "../components/Forge/Forge";
import Profile from "../components/Profile/Profile";

const Page = ({ params }: { params: { username: string } }) => {
  if (params.username === "create") {
    return <Forge />;
  }

  return <Profile username={params.username} />;
};

export default Page;
