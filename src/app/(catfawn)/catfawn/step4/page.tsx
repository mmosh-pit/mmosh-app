// step3b
"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import MessageBanner from "@/app/(main)/components/common/MessageBanner";
import Spinner from "../components/Spinner";

export default function Step4VC() {
  const router = useRouter();
  const [cachedData, setCachedData] = React.useState({
    email: "",
    currentStep: "",
  });

  const [intents, setIntents] = React.useState<string[]>([]);

  const [showMsg, setShowMsg] = React.useState(true);
  const [msgClass, setMsgClass] = React.useState("success");
  const [msgText, setMsgText] = React.useState("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [otherIntentEnabled, setOtherIntentEnabled] = React.useState(false);
  const [otherIntentText, setOtherIntentText] = React.useState("");

  React.useEffect(() => {
    const stored = localStorage.getItem("catfawn-data");

    if (!stored) {
      router.replace("/");
      return;
    }

    try {
      const result = JSON.parse(stored);
      setCachedData(result);

      if (result?.currentStep && result.currentStep !== "catfawn/step4") {
        router.replace(`/${result.currentStep}`);
      }
    } catch {
      router.replace("/");
    }
  }, []);

  const handleIntentChange = (value: string, checked: boolean) => {
    if (value === "other") {
      setOtherIntentEnabled(checked);

      if (!checked) {
        setOtherIntentText("");
        setIntents((prev) => prev.filter((item) => item !== "other-custom"));
      }

      return;
    }

    const formatted = formatIntent(value);

    if (checked) {
      setIntents((prev) => [...prev, formatted]);
    } else {
      setIntents((prev) => prev.filter((item) => item !== formatted));
    }
  };

  const updateIntent = async () => {
    setIsLoading(true);
    if (intents.length === 0 && !otherIntentText.trim()) {
      createMessage(
        otherIntentEnabled
          ? "Please enter a valid intent to proceed."
          : "Please select at least one intent.",
        "error"
      );
      setIsLoading(false);
      return;
    }

    let finalIntents = [...intents];

    if (otherIntentEnabled) {
      if (!otherIntentText.trim()) {
        createMessage("Please enter your other Iintent.", "error");
        setIsLoading(false);
        return;
      }

      const formattedOther = formatIntent(otherIntentText);
      finalIntents.push(formattedOther);
    }

    localStorage.setItem(
      "catfawn-data",
      JSON.stringify({
        ...cachedData,
        intent: finalIntents,
        currentStep: "catfawn/step5",
      })
    );
    router.replace("/catfawn/step5");
    setIsLoading(false);
  };

  const formatIntent = (value: string) => {
    return value.trim().toLowerCase().replace(/\s+/g, "-");
  };

  const createMessage = (message: any, type: any) => {
    window.scrollTo(0, 0);
    setMsgText(message);
    setMsgClass(type);
    setShowMsg(true);
    setTimeout(() => {
      setShowMsg(false);
    }, 4000);
  };

  return (
    <>
      {showMsg && (
        <div className="w-full absolute top-0 left-1/2 -translate-x-1/2">
          <MessageBanner type={msgClass} message={msgText} />
        </div>
      )}
      <div className="min-h-[36.313rem] xl:w-[36.188rem] bg-[#271114] rounded-[1.25rem] pt-[1.563rem] pb-[0.938rem] pl-[3.125rem] pe-[2.688rem] max-md:px-5 max-md:py-8">
        <h2 className="relative font-poppinsNew text-center text-[1.563rem] max-md:text-xl leading-[100%] font-bold bg-gradient-to-r from-[#FFFFFF] to-[#FFFFFF88] bg-clip-text text-transparent">
          <div className="absolute left-0">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => {
                router.back();
              }}
            >
              <path
                d="M20 12L4 12M4 12L10 6M4 12L10 18"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          Request Early Access
        </h2>
        <p className="text-[1rem] text-[#FFFFFFE5] font-avenirNext max-md:text-sm font-bold leading-[130%] mt-[0.313rem] -tracking-[0.02em]">
          Step 4 of 15: Tell Us More About Yourself.{" "}
          <span className="font-normal font-avenir">
            How do you hope to use the CAT-FAWN Connection?{" "}
          </span>
        </p>

        <div className="text-[0.875rem] font-bold leading-[100%] text-[#FFFFFFCC] mt-[0.563rem]">
          How do you hope to use CAT-FAWN Connection?{" "}
          <span className="text-[0.6885rem] font-normal">
            (select all that apply, required)
          </span>
        </div>

        <form className="min-h-[313px] mt-[0.875rem] text-[1rem] flex flex-col justify-between">
          <div className="flex flex-col gap-1 text-[#FFFFFFE5] text-[0.813rem] leading-[110%] -tracking-[0.02em]">
            <label className="flex items-center gap-0.5">
              <input
                type="checkbox"
                className="w-[1.438rem] h-[1.438rem] rounded-[0.313rem]"
                onChange={(e) =>
                  handleIntentChange(
                    "to-face-challenges-in-my-life-work-and-relationships-with-more-clarity-presence-and-wisdom",
                    e.target.checked
                  )
                }
              />
              To face challenges in my life, work, and relationships with more
              clarity, presence, and wisdom{" "}
            </label>
            <label className="flex items-center gap-0.5">
              <input
                type="checkbox"
                className="w-[1.438rem] h-[1.438rem] rounded-[0.313rem]"
                onChange={(e) =>
                  handleIntentChange(
                    "to-turn-my-strengths-into-superpowers",
                    e.target.checked
                  )
                }
              />
              To turn my strengths into superpowers{" "}
            </label>
            <label className="flex items-center  gap-0.5">
              <input
                type="checkbox"
                className="w-[1.438rem] h-[1.438rem] rounded-[0.313rem]"
                onChange={(e) =>
                  handleIntentChange(
                    "to-create-meaningful-change-in-my-community-or-the-world",
                    e.target.checked
                  )
                }
              />
              To create meaningful change in my community or the world{" "}
            </label>
            <label className="flex items-center gap-0.5">
              <input
                type="checkbox"
                className="w-[1.438rem] h-[1.438rem] rounded-[0.313rem]"
                onChange={(e) =>
                  handleIntentChange(
                    "to-break-old-patterns-and-respond-instead-of-react",
                    e.target.checked
                  )
                }
              />
              To break old patterns and respond instead of react{" "}
            </label>
            <label className="flex items-center gap-0.5">
              <input
                type="checkbox"
                className="w-[1.438rem] h-[1.438rem] rounded-[0.313rem]"
                onChange={(e) =>
                  handleIntentChange(
                    "to-relate-to-fear-differently-seeing-it-as-a-catalyst-not-an-enemy",
                    e.target.checked
                  )
                }
              />
              To relate to fear differently – seeing it as a catalyst not an
              enemy{" "}
            </label>
            <label className="flex items-center gap-0.5">
              <input
                type="checkbox"
                className="w-[1.438rem] h-[1.438rem] rounded-[0.313rem]"
                onChange={(e) =>
                  handleIntentChange(
                    "to-strengthen-my-inner-authority-and-self-authorship",
                    e.target.checked
                  )
                }
              />
              To strengthen my inner authority and self-authorship{" "}
            </label>
            <label className="flex items-center gap-0.5">
              <input
                type="checkbox"
                className="w-[1.438rem] h-[1.438rem] rounded-[0.313rem]"
                onChange={(e) =>
                  handleIntentChange(
                    "to-use-my-words-as-sacred-intentional-powerful-communications",
                    e.target.checked
                  )
                }
              />
              To use my words as sacred, intentional, powerful communications
            </label>
            <label className="flex items-center gap-0.5">
              <input
                type="checkbox"
                className="w-[1.438rem] h-[1.438rem] rounded-[0.313rem]"
                onChange={(e) =>
                  handleIntentChange(
                    "to-remember-my-inner-nature-and-experience-the-wisdom-of-the-natural-world",
                    e.target.checked
                  )
                }
              />
              To remember my inner nature and experience the wisdom of the
              natural world{" "}
            </label>
            <label className="flex items-center gap-0.5">
              <input
                type="checkbox"
                className="w-[1.438rem] h-[1.438rem] rounded-[0.313rem]"
                onChange={(e) =>
                  handleIntentChange(
                    "to-bring-more-respect-reciprocity-and-relational-wisdom-into-my-life",
                    e.target.checked
                  )
                }
              />
              To bring more respect, reciprocity, and relational wisdom into my
              life{" "}
            </label>
            <label className="flex items-center gap-0.5">
              <input
                type="checkbox"
                className="w-[1.438rem] h-[1.438rem] rounded-[0.313rem]"
                onChange={(e) =>
                  handleIntentChange(
                    "to-support-my-healing-therapy-or-spiritual-growth",
                    e.target.checked
                  )
                }
              />
              To support my healing, therapy, or spiritual growth{" "}
            </label>
            <label className="flex items-center gap-0.5">
              <input
                type="checkbox"
                className="w-[1.438rem] h-[1.438rem] rounded-[0.313rem]"
                onChange={(e) =>
                  handleIntentChange(
                    "to-enhance-my-work-with-clients-students-or-communities",
                    e.target.checked
                  )
                }
              />
              To enhance my work with clients, students, or communities{" "}
            </label>
            <label className="flex items-center gap-0.5">
              <input
                type="checkbox"
                className="w-[1.438rem] h-[1.438rem] rounded-[0.313rem]"
                onChange={(e) =>
                  handleIntentChange(
                    "to-grow-into-a-healthier-more-powerful-version-of-myself",
                    e.target.checked
                  )
                }
              />
              To grow into a healthier, more powerful version of myself{" "}
            </label>
            <label className="flex items-center gap-0.5">
              <input
                type="checkbox"
                className="w-[1.438rem] h-[1.438rem] rounded-[0.313rem]"
                onChange={(e) =>
                  handleIntentChange(
                    "to-strengthen-my-professional-skills-and-effectiveness-at-work",
                    e.target.checked
                  )
                }
              />
              To strengthen my professional skills and effectiveness at work{" "}
            </label>
            <label className="flex items-center gap-0.5">
              <input
                type="checkbox"
                className="w-[1.438rem] h-[1.438rem] rounded-[0.313rem]"
                onChange={(e) => handleIntentChange("other", e.target.checked)}
              />
              Other
            </label>
          </div>
          {otherIntentEnabled && (
            <input
              type="text"
              value={otherIntentText}
              onChange={(e) => setOtherIntentText(e.target.value)}
              placeholder="Please share how you see yourself in the world."
              className="text-[0.813rem] w-full h-[2.375rem] pl-[0.688rem] pe-[0.625rem] py-[0.625rem] rounded-[0.313rem] bg-[#402A2A] backdrop-blur-[12.16px] border border-[#FFFFFF29] text-white focus:outline-none placeholder:text-[#FFFFFF] placeholder:opacity-60 placeholder:font-normal placeholder:leading-[140%] mt-[0.563rem]"
            />
          )}

          <button
            type="button"
            className="font-avenirNext flex justify-center items-center gap-2 w-full h-[3.125rem] py-[1.063rem] bg-[#FF710F] mt-[0.625rem] text-[1rem] leading-[100%] text-[#2C1316] font-extrabold rounded-[0.625rem] hover:opacity-90"
            onClick={updateIntent}
          >
            {isLoading && <Spinner size="sm" />} Next
          </button>
        </form>
      </div>
    </>
  );
}
