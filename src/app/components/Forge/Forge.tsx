import * as React from "react";
import ImagePicker from "../ImagePicker";
import axios from "axios";

const Forge = () => {
  const [image, setImage] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "",
    lastName: "",
    username: "",
    description: "",
    descriptor: "",
    noun: "",
    pronouns: "they/them",
  });

  const [error, setError] = React.useState({
    error: false,
    message: "",
  });

  const checkForUsername = React.useCallback(async () => {
    if (form.username === "create") {
      setError({
        error: true,
        message: "Username already exists!",
      });
      return;
    }

    const result = await axios.get(
      `/api/check-username?username=${form.username}`,
    );

    if (result.data) {
      setError({
        error: true,
        message: "Username already exists!",
      });
      return;
    }

    setError({
      error: false,
      message: "",
    });
  }, [form.username]);

  React.useEffect(() => {
    if (!image) return;
    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);
  }, [image]);

  return (
    <div className="relative w-full flex justify-center background-content pt-20">
      <div className="flex flex-col md:w-[70%] w-[90%]">
        <div className="self-center md:w-[45%] w-[80%]">
          <h4 className="text-center text-white font-goudy font-normal mb-8">
            Create your Profile to join the DAO
          </h4>
          <p className="text-base text-center">
            MMOSH DAO members can create their own coins, build community and
            help allocate resources to support the growth and expansion of our
            ecosystem.
          </p>
        </div>
        <div className="w-full self-start mt-12">
          <p className="text-lg text-white">About You</p>
        </div>

        <div className="w-full flex-col md:flex-row flex items-center md:items-stretch justify-around mt-4">
          <div className="flex flex-col w-[100%] sm:w-[85%] md:w-[25%] mb-4 md:mb-0">
            <p className="text-sm">
              Avatar<sup>*</sup>
              <ImagePicker changeImage={setImage} image={preview} />
            </p>
          </div>

          <div className="flex flex-col w-full md:w-[35%] xs:w-[85%]">
            <div className="flex flex-col w-full">
              <p className="text-xs text-white">
                First Name or Alias<sup>*</sup>
              </p>
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input input-bordered bg-black bg-opacity-[0.07] placeholder-white placeholder-opacity-[0.3]"
              />
              <p className="text-xs">Up to 50 characters, can have spaces.</p>
            </div>

            <div className="flex flex-col w-full">
              <p className="text-xs text-white">Last Name</p>
              <input
                type="text"
                placeholder="Name"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="input input-bordered bg-black bg-opacity-[0.07] placeholder-white placeholder-opacity-[0.3]"
              />
              <p className="text-xs">Up to 15 characters</p>
            </div>

            <div className="flex flex-col my-6">
              <p className="text-xs text-white">
                Username<sup>*</sup>
              </p>
              <input
                type="text"
                value={form.username}
                onChange={(e) =>
                  setForm({
                    ...form,
                    username: e.target.value.replace(/\s/g, ""),
                  })
                }
                onBlur={checkForUsername}
                placeholder="Username"
                className="input input-bordered bg-black bg-opacity-[0.07] placeholder-white placeholder-opacity-[0.3]"
              />
              {error.error ? (
                <p className="text-xs text-red-600">{error.message}</p>
              ) : (
                <p className="text-xs">15 characters</p>
              )}
            </div>

            <div className="flex flex-col">
              <p className="text-xs text-white">
                Pronouns<sup>*</sup>
              </p>
              <select
                className="select select-bordered bg-black bg-opacity-[0.07]"
                value={form.pronouns}
                onChange={(e) => setForm({ ...form, pronouns: e.target.value })}
              >
                <option className="bg-black" value="they/them">
                  They/Them
                </option>
                <option className="bg-black" value="she/her">
                  She/Her
                </option>
                <option className="bg-black" value="he/him">
                  He/Him
                </option>
              </select>
            </div>
          </div>

          <div className="flex flex-col mt-4 md:mt-4 w-full md:w-fit">
            <p className="text-xs text-white">Description</p>
            <textarea
              placeholder="Tell us about yourself in up to 160 characters"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="textarea textarea-bordered textarea-lg w-full md:max-w-xs bg-black bg-opacity-[0.07] text-base placeholder-white placeholder-opacity-[0.3] h-full"
            ></textarea>

            <div className="flex flex-col mt-2 w-full md:w-fit">
              <p className="text-xs text-white">Superhero Identity</p>
              <label className="text-xs">Example: Frank the Amazing Elf</label>

              <div className="flex w-full">
                <p className="text-xs text-white">The</p>
                <div className="flex flex-col">
                  <input
                    type="text"
                    value={form.descriptor}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        descriptor: e.target.value,
                      })
                    }
                    placeholder="Descriptor"
                    className="input input-bordered bg-black bg-opacity-[0.07] placeholder-white placeholder-opacity-[0.3]"
                  />
                  <label className="text-xs">Example: Amazing</label>
                </div>

                <div className="flex flex-col ml-4">
                  <input
                    type="text"
                    value={form.noun}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        noun: e.target.value,
                      })
                    }
                    placeholder="Noun"
                    className="input input-bordered bg-black bg-opacity-[0.07] placeholder-white placeholder-opacity-[0.3]"
                  />
                  <label className="text-xs">Example: Elf</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center items-center mt-20">
          <button className="bg-[#CD068E] py-4 px-4 rounded-md flex items-center">
            {isLoading ? (
              <span className="loading loading-spinner loading-lg bg-[#BEEF00]"></span>
            ) : (
              <p className="text-white font-bold text-lg ml-2">
                Mint Your Profile
              </p>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Forge;
