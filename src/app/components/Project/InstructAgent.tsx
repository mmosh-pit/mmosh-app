import * as React from "react";

import EditIcon from "@/assets/icons/EditIcon";
import axios from "axios";
import Input from "../common/Input";
import Button from "../common/Button";

const InstructAgent = ({ symbol }: { symbol: string }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const [isOnEdit, setIsOnEdit] = React.useState(false);
  const [systemPrompt, setSystemPrompt] = React.useState("");

  const [projectDetail, setProjectDetail] = React.useState<any>(null);

  const [showMsg, setShowMsg] = React.useState(false);
  const [msgClass, setMsgClass] = React.useState("");
  const [msgText, setMsgText] = React.useState("");

  const getProjectDetailFromAPI = React.useCallback(async () => {
    try {
      const listResult = await axios.get(
        `/api/project/detail?symbol=${symbol}`,
      );
      setProjectDetail(listResult.data);
      setSystemPrompt(listResult.data.project.system_prompt);
    } catch (error) {
      console.log(error);
      setProjectDetail(null);
    }
  }, [symbol]);

  React.useEffect(() => {
    getProjectDetailFromAPI();
  }, [symbol]);

  const getLabel = React.useCallback(() => {
    if (isOnEdit) return "Edit System Prompt";

    return "Enter the System Prompt";
  }, [isOnEdit]);

  const toggleAction = React.useCallback(async () => {
    setIsLoading(true);

    await axios.put("/api/project/update-system-prompt", {
      project: projectDetail.project.key,
      systemPrompt,
    });

    if (!isOnEdit) {
      createMessage("System Prompt saved!", "success-container");
    } else {
      createMessage("System Prompt updated!", "success-container");
    }

    setProjectDetail({
      ...projectDetail,
      project: {
        ...projectDetail.project,
        system_prompt: systemPrompt,
      },
    });

    setIsOnEdit(false);

    setIsLoading(false);
  }, [projectDetail, systemPrompt, isOnEdit]);

  const createMessage = React.useCallback((message: any, type: any) => {
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

  if (!projectDetail) return <></>;

  return (
    <>
      {showMsg && (
        <div
          className={
            "message-container text-white text-center text-header-small-font-size py-5 px-3.5 " +
            msgClass
          }
        >
          {msgText}
        </div>
      )}
      <div className="background-content flex justify-center">
        <div className="flex flex-col mt-6 items-center w-[85%] md:w-[60%]">
          <div className="w-full flex justify-between items-center py-4">
            <p className="text-base text-white">{getLabel()}</p>

            {projectDetail.project.system_prompt && (
              <button
                className="bg-[#42408442] rounded-full p-1"
                onClick={() => setIsOnEdit(true)}
              >
                <EditIcon />
              </button>
            )}
          </div>

          <Input
            textarea
            type="text"
            title=""
            value={systemPrompt}
            readonly={!isOnEdit && !!projectDetail.project.system_prompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            required={false}
            placeholder="Enter the System Prompt for your Agent"
          />

          <div className="flex mt-12">
            {!projectDetail.project.system_prompt && systemPrompt !== "" && (
              <Button
                title="Save"
                size="large"
                isPrimary
                isLoading={isLoading}
                action={toggleAction}
              />
            )}

            {projectDetail.project.system_prompt && isOnEdit && (
              <>
                <Button
                  title="Cancel"
                  size="large"
                  isPrimary={false}
                  isLoading={isLoading}
                  action={() => {
                    setIsOnEdit(false);
                    setSystemPrompt(projectDetail.data.system_prompt);
                  }}
                />

                <div className="mx-6" />

                <Button
                  title="Save"
                  size="large"
                  isPrimary
                  isLoading={isLoading}
                  action={toggleAction}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default InstructAgent;
