"use client";

import * as React from "react";
import { useAtom } from "jotai";

import Step1 from "../components/Account/Step1";
import { onboardingStep } from "../store/account";
import Step2 from "../components/Account/Step2";
import Step3 from "../components/Account/Step3";
import Step4 from "../components/Account/Step4";
import Step5 from "../components/Account/Step5";
import Step6 from "../components/Account/Step6";
import { data, isAuth } from "../store";
import { useRouter } from "next/navigation";

// "Onboarding"
const Account = () => {
  const router = useRouter();

  const [selectedStep, setSelectedStep] = useAtom(onboardingStep);
  const [isUserAuthenticated] = useAtom(isAuth);
  const [currentUser] = useAtom(data);

  const getStep = () => {
    if (selectedStep === 0) return <Step1 />;
    if (selectedStep === 1) return <Step2 />;
    if (selectedStep === 2) return <Step3 />;
    if (selectedStep === 3) return <Step4 />;
    if (selectedStep === 4) return <Step5 />;
    // if (selectedStep === 5) return <Step6 />;

    return <Step1 />;
  };

  React.useEffect(() => {
    console.log("am I authenticated? ", isUserAuthenticated);
    if (isUserAuthenticated) {
      setSelectedStep(currentUser?.onboarding_step || 0);
      return;
    }

    // router.replace("/chat");
  }, [isUserAuthenticated]);

  return (
    <div className="background-content flex w-full h-full justify-center overflow-y-hidden">
      {getStep()}
    </div>
  );
};

export default Account;
