import Image from "next/image";
import * as React from "react";

import ImageIcon from "@/assets/icons/ImageIcon";

type Props = {
  changeImage: (file: File | null) => void;
  image: string;
};

const ImagePicker = ({ changeImage, image }: Props) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleChangeInput = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files) return;
      if (!event.target.files.item(0)) return;

      changeImage(event.target.files.item(0));
    },
    // eslint-disable-next-line
    [],
  );

  const handleDrop = React.useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      changeImage(e.dataTransfer.files[0]);
    }
    // eslint-disable-next-line
  }, []);

  const handleDrag = React.useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      // setDragActive(true);
    } else if (e.type === "dragleave") {
      // setDragActive(false);
    }
  }, []);

  const handleDragLeave = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
    },
    [],
  );

  const handleDragOver = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
    },
    [],
  );

  const triggerClick = React.useCallback(() => {
    if (!inputRef.current) return;

    inputRef.current.click();
  }, []);

  return (
    <div
      onDragEnter={(e) => handleDrag(e)}
      onDragLeave={(e) => handleDragLeave(e)}
      onDragOver={(e) => handleDragOver(e)}
      onDrop={(e) => handleDrop(e)}
      className="flex justify-center w-full h-full"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        style={{ display: "none" }}
        onChange={handleChangeInput}
      />
      {image ? (
        <div className="flex flex-col">
          <div className="flex w-full md:w-[15vmax] md:h-[15vmax] w-[8vmax] h-[8vmax] relative">
            <Image src={image} alt="Identity" fill />
          </div>
          <div
            className="flex items-center relative mt-2 cursor-pointer"
            onClick={triggerClick}
          >
            <div className="p-2 border-solid border-[1px] border-white rounded-full mr-2">
              <ImageIcon />
            </div>
            <p className="text-tiny text-white">Replace Image</p>
          </div>
        </div>
      ) : (
        <div
          className="flex md:h-[15vmax] md:w-[15vmax] sm:w-[10vmax] sm:h-[10vmax] md:mb-0 flex-col justify-center items-center border-[1px] border-solid border-[#FFF] border-opacity-20 rounded-md select-none cursor-pointer p-[1vmax] md:p-[2vmax] md:p-0 bg-black bg-opacity-[0.07]"
          onClick={triggerClick}
        >
          <p className="text-sm"> 1080x1080</p>
          <p className="text-sm">Jpg, Png. Max 100 mb</p>
          <div className="relative w-[3vmax] h-[3vmax] md:w-[6vmax] md:h-[6vmax]">
            <Image src="/png.svg" alt="png" layout="fill" />
          </div>
          <p className="text-sm text-white font-normal">Drag and Drop file</p>
          <p className="text-sm text-center">
            or{" "}
            <span className="text-sm text-white font-normal">
              {" "}
              Browse media{" "}
            </span>{" "}
            on your device
          </p>
        </div>
      )}
    </div>
  );
};

export default ImagePicker;
