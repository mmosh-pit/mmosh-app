"use client";

import { useAtom } from "jotai";
import Step1 from "../components/Account/Step1";
import { onboardingStep } from "../store/account";
import Step2 from "../components/Account/Step2";
import Step3 from "../components/Account/Step3";
import Step4 from "../components/Account/Step4";

// "Onboarding"
const Account = () => {
  const [selectedStep] = useAtom(onboardingStep);

  const getStep = () => {
    if (selectedStep === 0) return <Step1 />;
    if (selectedStep === 1) return <Step2 />;
    if (selectedStep === 2) return <Step3 />;
    if (selectedStep === 3) return <Step4 />;

    return <Step1 />;
  };

  return (
    <div className="background-content flex w-full h-full justify-center overflow-y-hidden">
      {getStep()}
    </div>
  );
};

export default Account;
