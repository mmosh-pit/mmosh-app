import * as React from "react";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";
import ImageAccountPicker from "./ImageAccountPicker";
import useCheckMobileScreen from "@/app/lib/useCheckMobileScreen";
import RichTextEditor from "./RichTextEditor";
import { useAtom } from "jotai";
import { onboardingForm, onboardingStep } from "@/app/store/account";
import client from "@/app/lib/httpClient";
import { uploadFile } from "@/app/lib/firebase";
import { storeFormAtom } from "@/app/store/signup";

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
  const [landingForm] = useAtom(storeFormAtom);

  const isMobileScreen = useCheckMobileScreen();
  const [bannerImage, setBannerImage] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

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
    setForm({ ...form, name: landingForm.name });
  }, [landingForm.name]);

  React.useEffect(() => {
    if (!profileImage) return;
    const objectUrl = URL.createObjectURL(profileImage);
    setProfilePreview(objectUrl);
  }, [profileImage]);

  const saveUserData = React.useCallback(async () => {
    setIsLoading(true);

    if (form.bio.length < 25) return;
    if (!form.name) return;
    if (!form.username) return;
    if (form.username.length < 3) return;
    if (form.username.length > 20) return;
    if (form.name.length > 50) return;

    let bannerResult = "";
    let imageResult = "";

    if (!bannerImage || !profileImage) return;

    try {
      const date = new Date().getMilliseconds();

      bannerResult = await uploadFile(
        bannerImage,
        `${form.username}-banner-${date}`,
        "banners",
      );

      imageResult = await uploadFile(
        profileImage,
        `${form.username}-guest_profile-${date}`,
        "images",
      );

      await client.put("/guest-data", {
        ...form,
        banner: bannerResult,
        picture: imageResult,
      });
    } catch (err) {
      // TODO add logic to remove image
      if (bannerResult) {
      }
      if (imageResult) {
      }
    }

    setSelectedStep(1);
    setIsLoading(false);
  }, [form, profileImage]);

  return (
    <div className="bg-[#18174750] border-[1px] border-[#FFFFFF80] rounded-lg py-8 md:px-32 px-6 flex flex-col md:w-[75%] w-[90%] mt-4">
      <div className="self-end">
        <p className="text-sm">Step 1 of 5</p>
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

      <div className="w-full flex md:flex-row flex-col mt-4">
        <div className="w-full flex flex-col md:w-[35%]">
          <div className="flex md:flex-col">
            <div className="flex flex-col">
              <p className="text-sm">Profile Picture</p>
              <div className="h-[200px] w-[200px] self-center">
                <ImageAccountPicker
                  changeImage={setProfileImage}
                  image={profilePreview}
                  rounded
                />
              </div>
            </div>

            {isMobileScreen && (
              <div className="w-full flex flex-col ml-6">
                <div className="flex flex-col">
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    title="Name"
                    helperText="Up to 50 characters, can have spaces."
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
                    helperText="Username must have between 3 and 20 characters."
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

            <div className="my-4" />

            <RichTextEditor />
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
          isLoading={isLoading}
          action={() => {
            saveUserData();
          }}
          size="small"
          isPrimary
        />
      </div>
    </div>
  );
};

export default Step1;
