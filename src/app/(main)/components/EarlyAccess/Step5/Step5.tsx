"use client";
import { BackArrowVW } from "@/app/(catfawn)/catfawn/components/BackArrow/BackArrowVW";
import { CheckBoxVW } from "@/app/(catfawn)/catfawn/components/CheckBox/CheckBoxVW";
import { EarlyAccessCircleVW } from "@/app/(catfawn)/catfawn/components/EarlyAccessCircle/EarlyAccessCircleVW";
import { ErrorContainerVW } from "@/app/(catfawn)/catfawn/components/ErrorContainer/ErrorContainerVW";
import Spinner from "@/app/(catfawn)/catfawn/components/Spinner";
import { useRouter } from "next/navigation";
import React from "react";

export default function step5() {
  const router = useRouter();
  const [cachedData, setCachedData] = React.useState<any>({});

  const [intents, setIntents] = React.useState<string[]>([]);

  const [showMsg, setShowMsg] = React.useState(true);
  const [msgClass, setMsgClass] = React.useState("success");
  const [msgText, setMsgText] = React.useState("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [otherIntentEnabled, setOtherIntentEnabled] = React.useState(false);
  const [otherIntentText, setOtherIntentText] = React.useState("");

  const msgTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const PREDEFINED_INTENTS = [
    "to-face-challenges-in-my-life-work-and-relationships-with-more-clarity-presence-and-wisdom",
    "to-turn-my-strengths-into-superpowers",
    "to-create-meaningful-change-in-my-community-or-the-world",
    "to-break-old-patterns-and-respond-instead-of-react",
    "to-relate-to-fear-differently-seeing-it-as-a-catalyst-not-an-enemy",
    "to-strengthen-my-inner-authority-and-self-authorship",
    "to-use-my-words-as-sacred-intentional-powerful-communications",
    "to-remember-my-inner-nature-and-experience-the-wisdom-of-the-natural-world",
    "to-bring-more-respect-reciprocity-and-relational-wisdom-into-my-life",
    "to-support-my-healing-therapy-or-spiritual-growth",
    "to-enhance-my-work-with-clients-students-or-communities",
    "to-grow-into-a-healthier-more-powerful-version-of-myself",
    "to-strengthen-my-professional-skills-and-effectiveness-at-work",
  ];

  React.useEffect(() => {
    const stored = localStorage.getItem("catfawn-data");
    if (!stored) {
      return router.replace("/catfawn");
    }
    try {
      const result = JSON.parse(stored);
      setCachedData(result);
      if (Array.isArray(result.intent)) {
        setIntents(result.intent);

        const other = result.intent.find(
          (i: string) => !PREDEFINED_INTENTS.includes(formatIntent(i))
        );

        if (other) {
          setOtherIntentEnabled(true);
          setOtherIntentText(other.replace(/^other-/, "").replace(/-/g, " "));
        }
      }

      if (result?.completedSteps !== undefined && result?.completedSteps < 3) {
        router.replace(`/${result.currentStep}`);
      }
    } catch {
      router.replace("/catfawn");
    }
  }, []);

  const handleIntentChange = (value: string, checked: boolean) => {
    if (value === "other") {
      setOtherIntentEnabled(checked);
      if (!checked) setOtherIntentText("");
      return;
    }

    const formatted = formatIntent(value);

    setIntents((prev) =>
      checked
        ? Array.from(new Set([...prev, formatted]))
        : prev.filter((item) => item !== formatted)
    );
  };

  const updateIntent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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

    let finalIntents = intents.filter((intent) =>
      PREDEFINED_INTENTS.includes(intent)
    );

    if (otherIntentEnabled) {
      if (!otherIntentText.trim()) {
        createMessage("Please enter your other intent.", "error");
        setIsLoading(false);
        return;
      }

      if (!/^[A-Za-z,&\/\s-]+$/.test(otherIntentText)) {
        createMessage(
          "Only letters are allowed. Special characters are not allowed.",
          "error"
        );
        setIsLoading(false);
        return;
      }

      if (
        otherIntentText.trim().length < 3 ||
        otherIntentText.trim().length > 100
      ) {
        createMessage(
          "Other Intent must be between 3 and 100 characters.",
          "error"
        );
        setIsLoading(false);
        return;
      }

      finalIntents.push(`other-${otherIntentText.trim().replace(/\s+/g, "-")}`);
    }

    finalIntents = Array.from(new Set(finalIntents));

    localStorage.setItem(
      "catfawn-data",
      JSON.stringify({
        ...cachedData,
        intent: finalIntents,
        currentStep: "catfawn/step5",
        completedSteps:
          cachedData.completedSteps && cachedData.completedSteps < 4
            ? 4
            : cachedData.completedSteps,
      })
    );

    router.replace("/catfawn/step5");
    setIsLoading(false);
  };

  const formatIntent = (value: string) => value.trim().replace(/\s+/g, "-");

  const createMessage = (message: string, type: "error" | "success") => {
    window.scrollTo(0, 0);

    setMsgText(message);
    setMsgClass(type);
    setShowMsg(true);

    if (msgTimeoutRef.current) {
      clearTimeout(msgTimeoutRef.current);
    }

    msgTimeoutRef.current = setTimeout(() => {
      setShowMsg(false);
      msgTimeoutRef.current = null;
    }, 4000);
  };

  return (
    <>
      <ErrorContainerVW
        showMessage={showMsg}
        className={msgClass}
        messageText={msgText}
      />
      <div className="bg-[#09073A] p-10 my-10">
        <div className="flex items-center justify-center">
          <EarlyAccessCircleVW />
          <div className="min-h-[29.875rem] ml-[5rem] xl:w-[36.188rem] bg-[#100E59] rounded-[1.25rem] pt-[1.563rem] pb-[0.938rem] pl-[3.125rem] pe-[3.313rem] max-md:px-5 max-md:py-8">
            <h2 className="relative font-poppinsNew text-center text-[1.563rem] max-md:text-lg leading-[100%] font-bold bg-gradient-to-r from-[#FFFFFF] to-[#FFFFFF88] bg-clip-text text-transparent">
              <BackArrowVW onClick={() => router.replace("/catfawn/step3")} />
              Step 5 of 8: Which mobile platform do you prefer?{" "}
            </h2>
            <p className="max-sm:text-base text-[#FFFFFFE5] font-avenirNext max-md:text-sm font-bold leading-snug lg:leading-[130%] mt-[0.313rem] -tracking-[0.02em]">
              Step 5 of 8: Which mobile platform do you prefer?
            </p>

            <form
              className="min-h-[313px] mt-[0.875rem] text-[1rem] flex flex-col justify-between"
              onSubmit={updateIntent}
            >
              <div className="flex flex-col gap-1 text-[#FFFFFFE5] text-[0.813rem] font-normal leading-[110%] -tracking-[0.02em]">
                <CheckBoxVW
                  labelText="Iphone"
                  hasChecked={intents.includes(
                    formatIntent(
                      "to-face-challenges-in-my-life-work-and-relationships-with-more-clarity-presence-and-wisdom"
                    )
                  )}
                  onChange={(e) =>
                    handleIntentChange(
                      "to-face-challenges-in-my-life-work-and-relationships-with-more-clarity-presence-and-wisdom",
                      e.target.checked
                    )
                  }
                />
                <CheckBoxVW
                  labelText="Android"
                  hasChecked={intents.includes(
                    formatIntent("to-turn-my-strengths-into-superpowers")
                  )}
                  onChange={(e) =>
                    handleIntentChange(
                      "to-turn-my-strengths-into-superpowers",
                      e.target.checked
                    )
                  }
                />
              </div>
              <button
                type="submit"
                className="steps_btn_submit mt-[10.438rem] text-white font-bold btn bg-[#EB8000] border-[#FF710F33] w-full hover:bg-[#EB8000] hover:border-[#FF710F33]"
              >
                {isLoading ? <Spinner size="sm" /> : "Join Early Access"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
