import Image from "next/image";
import * as React from "react";

import useCheckMobileScreen from "../lib/useCheckMobileScreen";

type Props = {
  changeImage: (file: File | null) => void;
  image: string;
};

const ImagePicker = ({ changeImage, image }: Props) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const isMobile = useCheckMobileScreen();

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
      className="w-full h-full"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png"
        style={{ display: "none" }}
        onChange={handleChangeInput}
      />
      {image ? (
        <div className="flex w-full sm:h-[220px] md:h-[250px] xs:h-[150px] relative">
          <Image src={image} alt="Identity" fill />
        </div>
      ) : (
        <div
          className="flex md:h-[80%] xs:h-[150px] sm:h-[220px] xs:mb-[1.5vmax] md:mb-0 flex-col justify-center items-center border-[1px] border-solid border-[#FFF] border-opacity-20 rounded-md select-none cursor-pointer p-16 bg-black bg-opacity-[0.07]"
          onClick={triggerClick}
        >
          <p className="text-base">Jpg, Png. Max 100 mb</p>
          <Image
            src="/png.svg"
            alt="png"
            width={isMobile ? 50 : 100}
            height={isMobile ? 50 : 100}
          />
          <p className="text-sm text-white font-bold">Drag and Drop file</p>
          <p className="text-sm">
            or{" "}
            <span className="text-sm text-white font-bold"> Browse media </span>{" "}
            on your device
          </p>
        </div>
      )}
    </div>
  );
};

export default ImagePicker;
