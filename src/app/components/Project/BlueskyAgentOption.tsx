import * as React from "react";

import BlueskyIcon from "@/assets/icons/BlueskyIcon";
import axios from "axios";
import Input from "../common/Input";
import Button from "../common/Button";

const BlueskyAgentOption = ({ symbol }: { symbol: string }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const [blueskyHandle, setBlueskyHandle] = React.useState("");
  const [blueskyPassword, setBlueskyPassword] = React.useState("");

  const [isAddMode, setIsAddMode] = React.useState(false);

  const [blueskyConnections, setBlueskyConnections] = React.useState<
    BskyConnection[]
  >([]);

  const getBskyConnections = React.useCallback(async () => {
    const response = await axios.get(
      `/api/project/bsky-conns?symbol=${symbol}`,
    );

    setBlueskyConnections(response.data);
  }, [symbol]);

  React.useEffect(() => {
    getBskyConnections();
  }, [symbol]);

  return (
    <div className="flex flex-col items-start">
      <div className="flex items-center bg-[#D9D9D938] border-[1px] border-[#FFFFFFEB] rounded-lg">
        <BlueskyIcon /> Bluesky
      </div>

      <div
        className={`flex flex-wrap ${blueskyConnections.length === 0 ? "justify-center" : "justify-around"} md:min-w-[60%] min-w-[80%] my-2 bg-[#03000754] backdrop-filter backdrop-blur-[8px] rounded-lg p-6`}
      >
        {blueskyConnections.map((conn) => (
          <div className="flex flex-col bg-[#00000078] border-[1px] border-[#FFFFFF08] p-2">
            <p className="text-base text-white">Bluesky handle</p>

            <p className="text-sm text-white ml-2">{conn.handle}</p>

            <button className="border-[1px] border-white px-4 py-2 cursor-pointer">
              <p className="text-base text-white">Disconnect</p>
            </button>
          </div>
        ))}

        {isAddMode ? (
          <div className="flex flex-col self-center bg-[#03000754] backdrop-filter backdrop-blur-[8px] p-4">
            <h5 className="text-white max-w-[70%]">
              What Bluesky account do you want to share with your agent?
            </h5>

            <Input
              title="Bluesky Handle"
              type="text"
              value={blueskyHandle}
              onChange={(e) => setBlueskyHandle(e.target.value)}
              required={false}
              placeholder="example.bsky.social"
            />

            <div className="my-2" />

            <Input
              title="Password"
              type="text"
              value={blueskyPassword}
              onChange={(e) => setBlueskyPassword(e.target.value)}
              required={false}
              placeholder="Password"
            />

            <div className="my-2" />

            <Button
              size="small"
              title="Connect"
              action={() => { }}
              isLoading={isLoading}
              isPrimary
            />
          </div>
        ) : (
          <div className="flex items-center" onClick={() => setIsAddMode(true)}>
            <div className="rounded-full border-[1.5px] border-[#9F9F9F38] bg-[#9A9A9A12] p-1 mr-2">
              <p className="font-bold text-lg text-white">+</p>
            </div>

            <p className="text-base text-white">Another account</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlueskyAgentOption;
