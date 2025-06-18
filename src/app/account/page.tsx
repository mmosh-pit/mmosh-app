"use client";

import * as React from "react";
import { useAtom } from "jotai";

import { onboardingStep } from "../store/account";
import Step1 from "../components/Account/Step1";
import Step2 from "../components/Account/Step2";
import Step3 from "../components/Account/Step3";
import Step4 from "../components/Account/Step4";
import { data, isAuth, userWeb3Info } from "../store";
import { useRouter } from "next/navigation";

// "Onboarding"
const Account = () => {
  const router = useRouter();
  const [selectedStep, setSelectedStep] = useAtom(onboardingStep);
  const [isUserAuthenticated] = useAtom(isAuth);
  const [currentUser] = useAtom(data);
  const [profileInfo] = useAtom(userWeb3Info);

  const getStep = () => {
    if (currentUser !== null) {
      if (
        currentUser!.guest_data?.name !== "" ||
        (currentUser!.profilenft !== "" && !!currentUser!.profilenft)
      ) {
        router.replace("/chat");
      }
    }

    if (selectedStep === 0) return <Step1 />;
    if (selectedStep === 1) return <Step2 />;
    if (selectedStep === 2) return <Step3 />;
    if (selectedStep === 3) return <Step4 />;

    if (selectedStep >= 4) {
      router.replace("/chat");
    }

    return <Step1 />;
  };

  React.useEffect(() => {
    if (isUserAuthenticated) {
      setSelectedStep(currentUser?.onboarding_step || 0);
      return;
    }
  }, [isUserAuthenticated]);

  React.useEffect(() => {
    if (profileInfo?.profile.address !== undefined) {
      router.replace("/chat");
    }
  }, [profileInfo]);

  return (
    <div className="background-content flex w-full h-full justify-center overflow-y-hidden">
      {getStep()}
    </div>
  );
};

export default Account;
