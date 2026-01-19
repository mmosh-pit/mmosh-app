import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ErrorContainerVW } from "@/app/(catfawn)/catfawn/components/ErrorContainer/ErrorContainerVW";
import { EarlyAccessCircleVW } from "@/app/(catfawn)/catfawn/components/EarlyAccessCircle/EarlyAccessCircleVW";

const STORAGE_KEY = "early-access-data";

interface Step1Props {
  onSuccess?: () => void;
  earlyAccessRef: any;
  setShowMsg: (data: any) => void;
  setMsgText: (data: any) => void;
  setMsgClass: (data: any) => void;
}

export const Step1: React.FC<Step1Props> = ({
  onSuccess,
  earlyAccessRef,
  setShowMsg,
  setMsgText,
  setMsgClass,
}) => {
  const router = useRouter();

  const [firstName, setFirstName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [hasChecked, setHasChecked] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const msgTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Restore from localStorage
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      const parsed = JSON.parse(stored);
      setFirstName(parsed.firstName || "");
      setEmail(parsed.email || "");
      setHasChecked(parsed.hasChecked ?? true);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const validateForm = () => {
    if (!firstName.trim()) {
      console.log("=================CHECK1==================");
      createMessage("First name is required", "error");
      return false;
    } else if (firstName.trim().length < 2) {
      console.log("=================CHECK2==================");
      createMessage("First name must be at least 2 characters", "error");
      return false;
    } else if (firstName.trim().length > 16) {
      console.log("=================CHECK3==================");
      createMessage("First name can be up to 16 characters only", "error");
      return false;
    }

    if (!email.trim()) {
      console.log("=================CHECK4==================");
      createMessage("Email is required", "error");
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(email.trim())) {
      console.log("=================CHECK5==================");
      createMessage("Please enter a valid email address", "error");
      return false;
    }

    if (!hasChecked) {
      console.log("=================CHECK6==================");
      createMessage(
        "You must agree to receive communications before continuing",
        "error"
      );
      return false;
    }

    return true;
  };

  // Submit handler (createVisitorRecord)
  const createVisitorRecord = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const response = await axios.post("/api/visitors/generate-otp", {
        type: "email",
        email: email.trim(),
      });

      if (response.data?.status) {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            firstName: firstName.trim(),
            email: email.trim(),
            hasChecked,
            hasVerifiedEmail: false,
            currentStep: "2",
          })
        );
        if (onSuccess) {
          onSuccess();
        }
      } else {
        console.log(
          "=================CHECK7==================",
          response.data?.message
        );
        createMessage(
          response.data?.message || "Something went wrong",
          "error"
        );
      }
    } catch (err: any) {
      console.log(
        "=================CHECK8==================",
        err?.response?.data?.message
      );
      createMessage(
        err?.response?.data?.message ||
          "Unable to generate OTP. Please try again.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const createMessage = (message: string, type: "error" | "success") => {
    window.scrollTo({ top: 0, behavior: "smooth" });

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
      <div ref={earlyAccessRef} className="bg-[#09073A] py-10 my-10">
        <div className="flex items-center justify-center">
          <EarlyAccessCircleVW />

          <div>
            <div className="min-h-[29.875rem] ml-[5rem] xl:w-[36.188rem] bg-[#100E59] rounded-[1.25rem] pt-[1.563rem] pb-[0.938rem] pl-[3.125rem] pe-[3.313rem] max-md:px-5 max-md:py-8">
              <h3 className="  transition duration-300 text-[1.95rem] text-center font-poppinsNew font-bold  tracking-[-1.04px] bg-[linear-gradient(143deg,#FFF_18.17%,rgba(255,255,255,0)_152.61%)] bg-clip-text text-transparent stroke-text">
                Request Early Access
              </h3>

              <p className="text-[#FFFFFFE5] text-base  my-2">
                <span className="text-white font-bold text-base">
                  Step 1 of 8: Enter your name and email address.
                </span>
                We’ll send a <br />
                link to verify it’s really you.
              </p>

              <form onSubmit={createVisitorRecord}>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Firstname*</legend>
                  <input
                    type="text"
                    className="input w-full bg-[#FFFFFF14] border-[1px] border-[#FFFFFF29]"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Email</legend>
                  <input
                    type="text"
                    className="input w-full bg-[#FFFFFF14] border-[1px] border-[#FFFFFF29]"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </fieldset>

                <label className="label">
                  <input
                    type="checkbox"
                    className="checkbox bg-[#FFFFFF14] border-[1px] border-[#FFFFFF29]"
                    checked={hasChecked}
                    onChange={(e) => setHasChecked(e.target.checked)}
                  />
                  <span className="ml-5">
                    By continuing, I agree to receive communications about the
                    Kinship Bots early access program and launch updates.
                  </span>
                </label>

                <button
                  type="submit"
                  className="btn bg-[#EB8000] hover:bg-[#EB8000] w-full text-white font-bold mt-[2rem] border-[#FF710F33] hover:border-none"
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Sending..."
                    : "Sends the security verification code"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
