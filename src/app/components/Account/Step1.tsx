import * as React from "react";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";
import ImageAccountPicker from "./ImageAccountPicker";
import useCheckMobileScreen from "@/app/lib/useCheckMobileScreen";
import RichTextEditor from "./RichTextEditor";
import { useAtom } from "jotai";
import { onboardingForm, onboardingStep } from "@/app/store/account";

const PronounsSelectOptions = [
  {
    label: "They/Them",
    value: "they/them",
  },
  {
    label: "He/Him",
    value: "he/him",
  },
  {
    label: "She/Her",
    value: "she/her",
  },
];

const Step1 = () => {
  const isMobileScreen = useCheckMobileScreen();
  const [bannerImage, setBannerImage] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState("");

  const [profileImage, setProfileImage] = React.useState<File | null>(null);
  const [profilePreview, setProfilePreview] = React.useState("");

  const [form, setForm] = useAtom(onboardingForm);
  const [_, setSelectedStep] = useAtom(onboardingStep);

  React.useEffect(() => {
    if (!bannerImage) return;
    const objectUrl = URL.createObjectURL(bannerImage);
    setImagePreview(objectUrl);
  }, [bannerImage]);

  React.useEffect(() => {
    if (!profileImage) return;
    const objectUrl = URL.createObjectURL(profileImage);
    setProfilePreview(objectUrl);
  }, [profileImage]);

  return (
    <div className="bg-[#18174750] border-[1px] border-[#FFFFFF80] rounded-lg py-8 md:px-32 px-6 flex flex-col md:w-[75%] w-[90%] mt-4">
      <div className="self-end">
        <p className="text-sm">Step 1 of 6</p>
      </div>

      <div className="flex flex-col self-center">
        <p className="text-white font-goudy text-base text-center">
          Create your Guest Account
        </p>

        <p className="text-sm text-center">
          Introduce yourself to the community by sharing some interesting
          details about yourself.
        </p>
      </div>

      <div className="flex flex-col">
        <p className="text-sm">Banner Image</p>
        <div className="h-[300px]">
          <ImageAccountPicker
            changeImage={setBannerImage}
            image={imagePreview}
          />
        </div>
      </div>

      <div className="w-full flex mt-4">
        <div className="w-full flex flex-col md:w-[35%]">
          <div className="flex md:flex-col">
            <p className="text-sm">Profile Picture</p>
            <div className="h-[200px] w-[200px] self-center">
              <ImageAccountPicker
                changeImage={setProfileImage}
                image={profilePreview}
                rounded
              />
            </div>

            {isMobileScreen && (
              <div className="w-full flex flex-col">
                <div className="flex">
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    title="Name"
                    required
                    type="text"
                    placeholder="Name"
                  />

                  <div className="my-4" />

                  <Input
                    value={form.username}
                    onChange={(e) =>
                      setForm({ ...form, username: e.target.value })
                    }
                    title="Username"
                    required
                    type="text"
                    placeholder="Username"
                  />
                </div>
              </div>
            )}
          </div>

          {!isMobileScreen && (
            <>
              <Input
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                title="Website"
                required={false}
                type="text"
                placeholder="https://example.com"
              />

              <div className="my-4" />

              <Select
                value={form.pronouns}
                onChange={(e) => setForm({ ...form, pronouns: e.target.value })}
                options={PronounsSelectOptions}
              />
            </>
          )}
        </div>

        <div className="mx-4" />

        {!isMobileScreen && (
          <div className="w-full flex flex-col">
            <div className="w-full flex">
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                title="Name"
                required
                type="text"
                placeholder="Name"
              />

              <div className="mx-4" />

              <Input
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                title="Username"
                required
                type="text"
                placeholder="Username"
              />
            </div>

            <div className="my-4" />

            <RichTextEditor />
          </div>
        )}

        {isMobileScreen && (
          <>
            <Input
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              title="Website"
              required={false}
              type="text"
              placeholder="https://example.com"
            />

            <div className="my-4" />

            <Select
              value={form.pronouns}
              onChange={(e) => setForm({ ...form, pronouns: e.target.value })}
              options={PronounsSelectOptions}
            />
          </>
        )}
      </div>

      <div className="flex mt-8 self-center">
        <Button
          title="Skip"
          isLoading={false}
          action={() => {
            setSelectedStep(1);
          }}
          size="small"
          isPrimary={false}
        />

        <div className="mx-4" />

        <Button
          title="Save and Next"
          isLoading={false}
          action={() => {
            setSelectedStep(1);
          }}
          size="small"
          isPrimary
        />
      </div>
    </div>
  );
};

export default Step1;
