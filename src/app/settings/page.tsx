"use client";
import * as React from "react";

import ProfileForm from "../components/Settings/ProfileForm";

const Settings = () => {
  return (
    <div className="flex w-full h-full py-4 px-12">
      <div className="flex flex-col py-4 px-8 w-[20%] rounded-lg bg-[#07024563] border-[1px] border-[#FFFFFF11] max-h-[60%]">
        <p className="text-lg font-bold text-center text-white mb-16">
          Settings
        </p>

        <p className="text-base text-white">Account</p>

        <div className="my-4" />

        <p className="text-base text-white">Verification</p>
      </div>

      <div className="w-full flex flex-col items-center justify-center">
        <ProfileForm />
      </div>
    </div>
  );
};

export default Settings;
