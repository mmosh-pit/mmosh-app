"use client";
import * as React from "react";
import Button from "../../components/common/Button";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { incomingReferAddress, storeFormAtom } from "@/app/store/signup";
import KinshipCodesLogin from "@/assets/icons/KinshipCodesLogin";

const Link = () => {
  const router = useRouter();

  const [form, setForm] = useAtom(storeFormAtom);

  const [referAddress] = useAtom(incomingReferAddress);

  React.useEffect(() => {
    if (!form.name) {
      router.back();
    }
  }, []);

  return (
    <div className="w-full min-h-full flex flex-col items-center background-content pt-32 relative">
      <div className="flex flex-col items-center my-6">
        <div className="flex justify-center w-[250px] h-[100px]">
          <KinshipCodesLogin />
        </div>
        <p className="text-base mt-4">
          Is a Web3 Social Network on Telegram. Activate the Kinship Codes Bot
          on Telegram to continue.
        </p>
      </div>

      <div className="w-[60%] md:w-[35%] lg:w-[20%] mb-4 mt-8">
        <Button
          title="Activate Liquid Hearts Bot"
          action={() => {
            setForm({
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
              address: "",
            });
            window.open(
              `https://t.me/${process.env.NEXT_PUBLIC_BOT_NAME}?start=${referAddress},${form.address}`,
              "_newtab",
            );
            router.replace("/");
          }}
          size="large"
          isPrimary
          isLoading={false}
        />
      </div>
    </div>
  );
};

export default Link;
