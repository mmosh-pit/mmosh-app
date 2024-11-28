import * as React from "react";
import Image from "next/image";

import { BagsCoin, BagsNFT } from "@/app/store/bags";
import axios from "axios";

type Props = {
  asset: BagsNFT | BagsCoin;
};

const AssetCard = ({ asset }: Props) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [documents, setDocuments] = React.useState([]);

  const handleChangeInput = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files) return;
      if (!event.target.files.item(0)) return;

      // addFiles(event.target.files);
    },
    // eslint-disable-next-line
    [],
  );

  const triggerClick = React.useCallback(() => {
    if (!inputRef.current) return;

    inputRef.current.click();
  }, []);

  const fetchDocuments = React.useCallback(async () => {
    const response = await axios.get(
      `/api/get-documents-by-asset?addres=${asset.tokenAddress}`,
    );

    setDocuments(response.data);
  }, [asset]);

  React.useEffect(() => {
    fetchDocuments();
  }, [asset]);

  return (
    <>
      <input
        type="file"
        className="hidden"
        ref={inputRef}
        onChange={handleChangeInput}
      />
      <div className="flex p-[2px] border-[1px] border-[#353485] bg-[#09073A] rounded-lg">
        <div className="relative w-[8vmax] h-[8vmax]">
          <Image
            src={asset.image}
            alt={asset.name}
            layout="fill"
            className="rounded-lg"
          />
        </div>

        <div className="flex flex-col px-2 py-4">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <p className="text-base text-white font-semibold">{asset.name}</p>
              <p className="text-xs">{asset.symbol.toUpperCase()}</p>
            </div>

            <button
              className="border-[0.5px] border-[#9F9F9F38] bg-[#9A9A9A12] rounded-full"
              onClick={triggerClick}
            >
              <p className="text-sm text-white font-semibold">+ Add File</p>
            </button>
          </div>

          <div className="h-[5vh] overflow-y-auto"></div>
        </div>
      </div>
    </>
  );
};

export default AssetCard;
