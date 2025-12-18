"use client";

import Profile from "../components/Profile/Profile";

const Page = ({ params }: { params: { username: string } }) => {
  return <Profile username={params.username} />;
};

export default Page;
