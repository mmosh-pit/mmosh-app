"use client";
import MembersList from "../components/Home/MembersList";
import SearchBar from "../components/MembershipDirectory/SearchBar";

const MembersDirectory = () => {
  return (
    <div className="background-content flex flex-col max-h-full pt-20 px-12 w-full relative">
      <div className="mt-8">
        <SearchBar />
      </div>

      <MembersList />
    </div>
  );
};

export default MembersDirectory;
