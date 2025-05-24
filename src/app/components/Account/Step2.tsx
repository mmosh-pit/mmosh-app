import * as React from "react";

import ArrowBack from "@/assets/icons/ArrowBack";
import Input from "../common/Input";
import Button from "../common/Button";
import { onboardingStep } from "@/app/store/account";
import { useAtom } from "jotai";

const Step2 = () => {
  const [_, setSelectedStep] = useAtom(onboardingStep);
  const [referralUsername, setReferralUsername] = React.useState("");

  return (
    <div className="bg-[#18174750] border-[1px] border-[#FFFFFF80] rounded-lg py-8 md:px-8 px-6 flex flex-col md:w-[55%] w-[70%] mt-4 h-[60%] justify-between">
      <div className="w-full flex flex-col mt-4">
        <div className="w-full flex justify-between">
          <button onClick={() => setSelectedStep(0)}>
            <ArrowBack />
          </button>

          <p className="text-sm">Step 2 of 6</p>
        </div>

        <div className="flex flex-col self-center mb-12 justify-center items-center">
          <p className="text-white font-goudy text-base text-center">
            Who Referred You?
          </p>

          <p className="text-sm text-center md:max-w-[50%] max-w-[75%]">
            Enter the username of the person who referred you, and both of you
            will receive a gift of appreciation in your Kinship Wallet that you
            can use once your Profile is verified.
          </p>
        </div>

        <div className="md:w-[50%] w-[75%] self-center">
          <Input
            title=""
            placeholder="Referral Username"
            required={false}
            type="text"
            value={referralUsername}
            onChange={(e) => setReferralUsername(e.target.value)}
          />
        </div>
      </div>

      <div className="flex mt-8 self-center">
        <Button
          title="Skip"
          isLoading={false}
          action={() => {
            setSelectedStep(2);
          }}
          size="small"
          isPrimary={false}
        />

        <div className="mx-4" />

        <Button
          title="Claim Rewards"
          isLoading={false}
          action={() => {
            setSelectedStep(2);
          }}
          size="small"
          isPrimary
        />
      </div>
    </div>
  );
};

export default Step2;
