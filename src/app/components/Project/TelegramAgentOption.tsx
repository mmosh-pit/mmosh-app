import TelegramIcon from "@/assets/icons/TelegramIcon";
import * as React from "react";
import Input from "../common/Input";
import axios, { AxiosError } from "axios";
import RemoveIcon from "@/assets/icons/RemoveIcon";
import Button from "../common/Button";

const TelegramAgentOption = ({ project }: { project: string }) => {
  const [handle, setHandle] = React.useState("");
  const [status, setStatus] = React.useState("open");
  const [instructions, setInstructions] = React.useState("");

  const [telegramConnections, setTelegramConnections] = React.useState<
    TelegramConnection[]
  >([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showMsg, setShowMsg] = React.useState(false);
  const [msgClass, setMsgClass] = React.useState("");
  const [msgText, setMsgText] = React.useState("");

  const getTelegramConnections = React.useCallback(async () => {
    const response = await axios.get(
      `/api/project/project-tools?project=${project}&type=telegram`,
    );

    setTelegramConnections(
      response.data.map((val: any) => ({
        handle: val.data.handle,
        privacy: val.data.privacy,
        instructions: val.data.instructions,
      })),
    );
  }, [project]);

  React.useEffect(() => {
    getTelegramConnections();
  }, [project]);

  const createMessage = React.useCallback((message: any, type: any) => {
    window.scrollTo(0, 0);
    setMsgText(message);
    setMsgClass(type);
    setShowMsg(true);
    if (type == "success-container") {
      setTimeout(() => {
        setShowMsg(false);
      }, 4000);
    } else {
      setTimeout(() => {
        setShowMsg(false);
      }, 4000);
    }
  }, []);

  const addTool = React.useCallback(() => {
    setIsLoading(true);
    axios
      .post("/api/project/save-project-tool", {
        type: "telegram",
        project,
        data: {
          handle: handle,
          privacy: status,
          instructions,
        },
      })
      .catch((err: AxiosError) => {
        if (err.response?.data === "telegram-exists") {
          createMessage(
            "Telegram Group has already been saved",
            "danger-container",
          );
        } else {
          createMessage(
            "Unknown error ocurred, please try again",
            "danger-container",
          );
        }
      })
      .then((_) => {
        setIsLoading(false);

        setTelegramConnections((prev) => {
          const newConns = [...prev];

          newConns.push({
            handle,
            privacy: status,
            instructions,
          });
          setHandle("");
          setStatus("open");

          return newConns;
        });

        createMessage(
          "Successfully added Telegram Group to your Agent",
          "success-container",
        );
      });
  }, [project, handle, status, instructions]);

  const removeGroup = React.useCallback(async (handle: string) => {
    setIsLoading(true);
    await axios.delete(
      `/api/project/remove-telegram-tool?project=${project}&handle=${handle}`,
    );

    setIsLoading(false);

    setTelegramConnections((prev) => {
      const newConns = [...prev].filter((e) => e.handle !== handle);

      return newConns;
    });
  }, []);

  return (
    <div className="flex flex-col">
      {showMsg && (
        <div
          className={
            "message-container text-white text-center text-header-small-font-size py-5 px-3.5 mb-6 mt-2 " +
            msgClass
          }
        >
          {msgText}
        </div>
      )}

      <div className="flex flex-col items-center justify-center">
        <div className="flex items-start mb-8">
          <div className="flex items-center bg-[#D9D9D938] border-[1px] border-[#FFFFFFEB] rounded-2xl cursor-pointer px-3 py-1 mx-4">
            <TelegramIcon width={18} height={15} />{" "}
            <p className="text-base text-white ml-1"> Telegram </p>
          </div>

          <div className="flex flex-col mx-4">
            <p className="text-sm text-white">
              Set{" "}
              <a
                className="text-sm text-white underline"
                href="https://t.me/KinshipChatBot"
                target="_blank"
              >
                KinshipChatBot
              </a>{" "}
              as an admin of a public group before adding this Telegram tool to
              your agent.
            </p>

            <div className="flex items-center mt-2">
              <p className="text-sm text-white">https://t.me/</p>

              <Input
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                type="text"
                placeholder="handle"
                title=""
                required={false}
              />
            </div>
          </div>

          <div className="flex flex-col mx-4">
            <p className="text-sm text-white mb-2">
              Set the group as Gated or Open
            </p>

            <div className="flex items-center">
              <div className="flex items-center justify-center">
                <input
                  id="checkbox1"
                  type="checkbox"
                  className="radio radio-secondary candidates-checkboxes"
                  checked={status === "open"}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setStatus("open");
                      return;
                    }
                  }}
                />
                <p className="text-tiny ml-1">Open</p>
              </div>

              <div className="mx-4" />

              <div className="flex items-center justify-center">
                <input
                  id="checkbox2"
                  type="checkbox"
                  className="radio radio-secondary candidates-checkboxes"
                  checked={status === "gated"}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setStatus("gated");
                      return;
                    }
                  }}
                />
                <p className="text-tiny ml-1">Subscribers Only</p>
              </div>
            </div>
          </div>
        </div>

        <Input
          title="Instructions"
          placeholder="Enter instructions for the Agent to follow when interacting through this account."
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          type="text"
          textarea
          required={false}
        />

        <div className="my-2" />

        <div className="lg:max-w-[30%] md:max-w-[50%] max-w-[65%]">
          <Button
            size="large"
            title="Save"
            isLoading={isLoading}
            action={addTool}
            isPrimary
          />
        </div>
      </div>

      {telegramConnections.map((conn, index) => (
        <div
          className="w-full flex justify-between items-center my-2 bg-[#03000733] rounded-lg py-8 px-12 backdrop-filter backdrop-blur-[8.6px]"
          key={`${conn.handle}-${index}`}
        >
          <div className="flex flex-col w-full">
            <div className="flex items-center self-end mb-2">
              <div
                className="cursor-pointer self-end mr-3"
                onClick={() => {
                  removeGroup(conn.handle);
                }}
              >
                <RemoveIcon />
              </div>

              <p className="text-sm text-white font-bold">Delete</p>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <p className="text-sm text-white">
                  Need to be an admin in the group before you link it here
                </p>

                <p className="my-4 text-sm text-white">
                  https://t.me/{conn.handle}
                </p>
              </div>

              <div className="flex flex-col">
                <p className="text-sm text-white">Group's Privacy</p>

                <div className="flex items-center justify-center mt-4">
                  <input
                    id="checkbox3"
                    type="checkbox"
                    className="radio radio-secondary candidates-checkboxes"
                    defaultChecked
                  />
                  <p className="text-sm ml-1">
                    {conn.privacy === "open" ? "Open" : "Subscribers Only"}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-sm text-white">{conn.instructions}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TelegramAgentOption;
