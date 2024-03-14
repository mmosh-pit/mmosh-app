import * as React from "react";

import { fetchNFTMetadata } from "@/app/lib/fetchNFTMetadata";

const EldersList = ({ profilenft }: { profilenft: string }) => {
  const [lineageList, setLineageList] = React.useState();

  const getElderValues = async () => {
    const metadata = await fetchNFTMetadata(profilenft);

    console.log("Got metadata: ", metadata);
  };

  React.useEffect(() => {
    if (!profilenft) return;
    getElderValues();
  }, [profilenft]);

  return <></>;
};

export default EldersList;
