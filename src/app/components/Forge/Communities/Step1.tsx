import * as React from "react";

import ImagePicker from "../../ImagePicker";

const Step1 = () => {
  const [image, setImage] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState("");

  React.useEffect(() => {
    if (!image) return;
    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);
  }, [image]);

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center">
        <h3 className="text-center text-white font-goudy font-normal">
          Step 1
        </h3>
        <h4 className="text-center text-white font-goudy font-normal my-2">
          Deploy the Art and Metadata
        </h4>
        <p className="text-center text-sm mt-1">
          Set the image, name, symbol and description for your community.
        </p>
      </div>

      <div className="flex">
        <ImagePicker changeImage={setImage} image={preview} />

        <div className="flex flex-col"></div>
      </div>
    </div>
  );
};

export default Step1;
