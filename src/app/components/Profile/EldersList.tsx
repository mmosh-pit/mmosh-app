import * as React from "react";

import { fetchNFTMetadata } from "@/app/lib/fetchNFTMetadata";
import { PublicKey } from "@solana/web3.js";

const EldersList = ({ profilenft }: { profilenft: string }) => {
  const [lineageList, setLineageList] = React.useState({
    promoter: { url: "", name: "" },
    scout: { url: "", name: "" },
    recruiter: { url: "", name: "" },
    originator: { url: "", name: "" },
  });

  const getElderValues = async () => {
    const metadata = await fetchNFTMetadata(profilenft);

    console.log("Got metadata: ", metadata);

    const resultingList = {
      promoter: { url: "", name: "" },
      scout: { url: "", name: "" },
      recruiter: { url: "", name: "" },
      originator: { url: "", name: "" },
    };

    for (const attribute of metadata.attributes) {
      if (attribute.trait_type === "Promoter") {
        let url = "";

        if (PublicKey.isOnCurve(attribute.value)) {
          url = `https://solscan.io/token/${attribute.value}`;
        } else {
          url = `https://www.mmosh.app/${attribute.value}`;
        }

        resultingList.promoter.url = url;
        const promoterMetadata = await fetchNFTMetadata(attribute.value);

        if (promoterMetadata) {
          const promoterName = promoterMetadata.attributes.find(
            (attr: any) => attr.trait_type === "Full Name",
          );
          resultingList.promoter.name = promoterName.value;
        }
      }

      if (attribute.trait_type === "Scout") {
        let url = "";

        if (PublicKey.isOnCurve(attribute.value)) {
          url = `https://solscan.io/token/${attribute.value}`;
        } else {
          url = `https://www.mmosh.app/${attribute.value}`;
        }

        resultingList.scout.url = url;
        const scoutMetadata = await fetchNFTMetadata(attribute.value);

        if (scoutMetadata) {
          const scoutName = scoutMetadata.attributes.find(
            (attr: any) => attr.trait_type === "Full Name",
          );
          resultingList.scout.name = scoutName.value;
        }
      }

      if (attribute.trait_type === "Recruiter") {
        let url = "";

        if (PublicKey.isOnCurve(attribute.value)) {
          url = `https://solscan.io/token/${attribute.value}`;
        } else {
          url = `https://www.mmosh.app/${attribute.value}`;
        }

        resultingList.recruiter.url = url;
        const recruiterMetadata = await fetchNFTMetadata(attribute.value);

        if (recruiterMetadata) {
          const recruiterName = recruiterMetadata.attributes.find(
            (attr: any) => attr.trait_type === "Full Name",
          );
          resultingList.recruiter.name = recruiterName.value;
        }
      }

      if (attribute.trait_type === "Originator") {
        let url = "";

        if (PublicKey.isOnCurve(attribute.value)) {
          url = `https://solscan.io/token/${attribute.value}`;
        } else {
          url = `https://www.mmosh.app/${attribute.value}`;
        }

        resultingList.originator.url = url;

        const originatorMetadata = await fetchNFTMetadata(attribute.value);

        if (originatorMetadata) {
          const originatorName = originatorMetadata.attributes.find(
            (attr: any) => attr.trait_type === "Full Name",
          );
          resultingList.originator.name = originatorName.value;
        }
      }
    }

    setLineageList(resultingList);
  };


  React.useEffect(() => {
    if (!profilenft) return;
    getElderValues();
  }, [profilenft]);

  if (!profilenft) return;

  return (
    <div className="flex flex-col p-12">
      <h4>Elders</h4>
      <div className="w-full flex">
        <p className="text-base text-white">
          1. Promotor:{" "}
          <a href={lineageList.promoter.url}>{lineageList.promoter.name}</a>
        </p>

        <p className="text-base text-white">
          3. Recruiter:{" "}
          <a href={lineageList.recruiter.url}>{lineageList.recruiter.name}</a>
        </p>
      </div>

      <div className="w-full flex">
        <p className="text-base text-white">
          2. Scout: <a href={lineageList.scout.url}>{lineageList.scout.name}</a>
        </p>

        <p className="text-base text-white">
          4. Originator:{" "}
          <a href={lineageList.originator.url}>{lineageList.originator.name}</a>
        </p>
      </div>
    </div>
  );
};

export default EldersList;
