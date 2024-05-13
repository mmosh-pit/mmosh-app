"use client";
import MintInvitation from "@/app/components/Forge/MintInvitation";

const Invitation = () => (
  <div className="w-full flex flex-col justify-center items-center pt-20">
    <h4 className="text-center text-white font-goudy font-normal mb-4">
      Invite your Friends to the DAO
    </h4>
    <p className="text-base text-center">
      Build up your guild and earn royalties when new members join MMOSH DAO.
    </p>

    <div className="mt-12">
      <MintInvitation />
    </div>
  </div>
);

export default Invitation;
