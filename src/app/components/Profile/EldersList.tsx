import { fetchNFTUsername } from "@/app/lib/fetchNFTMetadata";
import { Guild } from "@/app/models/guild";
import axios from "axios";
import * as React from "react";

const EldersList = ({ profilenft }: { profilenft: string }) => {
  const [lineageList, setLineageList] = React.useState();

  const getElderValues = async () => {
    const res = await axios.get<Guild>(`/api/get-elders?profile=${profilenft}`);

    if (!res.data) return;

    const resultingLineage: any = {};

    for (const entry of Object.entries(res.data)) {
      const [key, value] = entry;

      const username = await fetchNFTUsername(value);

      resultingLineage[key] = username;
    }

    setLineageList(resultingLineage);
  };

  React.useEffect(() => {
    if (!profilenft) return;
    getElderValues();
  }, [profilenft]);

  return <></>;
};

export default EldersList;
