// step3b
"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
// import toast from "react-hot-toast";

export default function IntentVC() {
  const router = useRouter();
  const [cachedData, setCachedData] = React.useState({
    email: "",
    currentStep: "",
  });

  const [intents, setIntents] = React.useState<string[]>([]);

  React.useEffect(() => {
    const stored = localStorage.getItem("catfawn-data");

    if (!stored) {
      router.replace("/");
      return;
    }

    try {
      const result = JSON.parse(stored);
      setCachedData(result);

      if (result?.currentStep && result.currentStep !== "step3/intent") {
        router.replace(`/${result.currentStep}`);
      }
    } catch {
      router.replace("/");
    }
  }, []);

  const handleIntentChange = (value: string, checked: boolean) => {
    if (checked) {
      setIntents((prev) => [...prev, value]);
    } else {
      setIntents((prev) => prev.filter((item) => item !== value));
    }
  };

  const updateIntent = async () => {
    if (intents.length === 0) {
      // toast.error("Please select at least one intent.");
      return;
    }

    try {
      const res = await axios.patch("/api/visitors/update-visitors", {
        email: cachedData.email,
        currentStep: "step3/mobile-preference",
        intent: intents,
      });

      if (res.data.status) {
        localStorage.setItem(
          "catfawn-data",
          JSON.stringify({
            ...cachedData,
            currentStep: "step3/mobile-preference",
          })
        );

        router.replace("/step3/mobile-preference");
      } else {
        // toast.error(res.data.message);
      }
    } catch (err) {
      // toast.error("Something went wrong");
    }
  };

  return (
    <div className="font-avenir grid grid-cols-1 lg:grid-cols-2 lg:gap-x-9 max-lg:gap-y-8 items-center">
      <div className="flex flex-col gap-7.5">
        <h1 className="text-[2.188rem] max-md:text-2xl font-bold leading-[110%] font-poppins max-lg:text-center bg-linear-to-r from-[#FFFFFF] to-[#FFFFFF88] bg-clip-text text-transparent">
          Join the CAT FAWN Connection <br className="max-md:hidden" />
          Early Access Circle
        </h1>

        <div className="text-base leading-[130%] max-md:text-sm font-normal max-lg:w-max max-lg:mx-auto max-md:w-auto max-lg:text-start text-wrap">
          <p>
            Be among the first to use CAT FAWN Connection
            <br />
            to change yourself, change your life, and change the world.
            <br />
            As an early access member, you&apos;ll:
          </p>

          <ul>
            <li>• Experience the app before public launch</li>
            <li>• Share insights that will shape the product</li>
            <li>
              • Join live sessions + private groups with Four Arrows & Kinship
            </li>
          </ul>
        </div>
      </div>

      <div className="min-h-[36.313rem] xl:w-[36.188rem] bg-[#271114] rounded-[1.25rem] pt-[1.563rem] pb-[0.938rem] px-12.5 max-md:px-5 max-md:py-8">
        <h2 className="font-poppins text-center text-[1.563rem] max-md:text-xl leading-[100%] font-bold bg-linear-to-r from-[#FFFFFF] to-[#FFFFFF88] bg-clip-text text-transparent">
          Request Early Access
        </h2>

        <p className="text-base max-md:text-sm font-normal leading-[130%] mt-[0.313rem]">
          Step 3 of 6: Tell Us More About Yourself <br />
          Please tell us more about yourself and how we can reach you.
        </p>

        <div className="text-sm font-bold leading-[100%] text-[#FFFFFFCC] mt-2.5">
          3b. How do you hope to use CAT-FAWN Connection?{" "}
          <span className="text-[0.688rem] font-normal">
            (select all that apply, required)
          </span>
        </div>

        <form className="min-h-[313px] mt-[0.313rem] text-base flex flex-col justify-between">
          <div className="flex flex-col gap-1 text-[rgba(255,255,255,0.9)] text-[0.813rem] leading-[110%] -tracking-[0.02em]">
            <label className="flex items-center gap-0.5">
              <input
                type="checkbox"
                className="size-[1.438rem] accent-[#402A2A] rounded-[0.313rem]"
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
                className="size-[1.438rem] accent-[#402A2A] rounded-[0.313rem]"
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
                className="size-[1.438rem] accent-[#402A2A] rounded-[0.313rem]"
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
                className="size-[1.438rem] accent-[#402A2A] rounded-[0.313rem]"
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
                className="size-[1.438rem] accent-[#402A2A] rounded-[0.313rem]"
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
                className="size-[1.438rem] accent-[#402A2A] rounded-[0.313rem]"
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
                className="size-[1.438rem] accent-[#402A2A] rounded-[0.313rem]"
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
                className="size-[1.438rem] accent-[#402A2A] rounded-[0.313rem]"
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
                className="size-[1.438rem] accent-[#402A2A] rounded-[0.313rem]"
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
                className="size-[1.438rem] accent-[#402A2A] rounded-[0.313rem]"
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
                className="size-[1.438rem] accent-[#402A2A] rounded-[0.313rem]"
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
                className="size-[1.438rem] accent-[#402A2A] rounded-[0.313rem]"
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
                className="size-[1.438rem] accent-[#402A2A] rounded-[0.313rem]"
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
                className="size-[1.438rem] accent-[#402A2A] rounded-[0.313rem]"
              />
              Other
            </label>
          </div>

          <button
            type="button"
            className="font-avenir-next w-full py-[1.063rem] bg-[#FF710F] mt-2.5 text-base leading-[100%] text-[#2C1316] font-bold rounded-[0.625rem] hover:opacity-90"
            onClick={updateIntent}
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
}
