"use client";
import * as React from "react";
import Image from "next/image";
import Button from "../../components/common/Button";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { storeFormAtom } from "@/app/store/signup";

const Code = () => {
  const router = useRouter();

  const [form, setForm] = useAtom(storeFormAtom);

  React.useEffect(() => {
    if (!form.name) {
      router.back();
    }
  }, []);

  return (
    <div className="w-full min-h-full flex flex-col items-center background-content pt-32 relative">
      <div className="flex flex-col items-center my-6">
        <div className="flex flex-col relative w-[250px] h-[100px] my-6">
          <Image
            src="https://storage.googleapis.com/mmosh-assets/logo_white.png"
            alt="mmosh"
            layout="fill"
          />
        </div>
        <p className="text-base mt-4"></p>
      </div>

      <div className="w-[60%] md:w-[35%] lg:w-[20%] mb-4 mt-8">
        <Button
          title="Link"
          action={() => {
            setForm({
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
            });
            window.open(
              `https://t.me/${process.env.NEXT_PUBLIC_BOT_NAME}`,
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

export default Code;