"use client";

import AgentPass from "@/app/components/Project/AgentPass";
import AgentTeam from "@/app/components/Project/AgentTeam";
import AgentCoin from "@/app/components/Project/AgentCoin";
import ProjectCreateStep4 from "@/app/components/Project/ProjectCreateStep4";
import ProjectCreateStep7 from "@/app/components/Project/ProjectCreateStep7";
import ProjectCreateStep8 from "@/app/components/Project/ProjectCreateStep8";
import ProjectCreateStep9 from "@/app/components/Project/ProjectCreateStep9";
import { useEffect, useState } from "react";
import Select from "@/app/components/common/Select";
import useWallet from "@/utils/wallet";
import axios from "axios";
import AgentStudioToolsCreate from "@/app/components/Project/AgentStudioToolsCreate";
import InstructAgent from "@/app/components/Project/InstructAgent";
import AgentOffer from "@/app/components/Project/AgentOffer";
import internalClient from "../lib/internalHttpClient";

export default function ProjectCreate() {
  const wallet: any = useWallet();

  const [projectType, setProjectType] = useState([
    { label: "New Personal Agent", value: "personal" },
    { label: "New Kinship Agent", value: "kinship" },
  ]);
  const [selectedProjectType, setSelectedProjectType] = useState("personal");

  const [options, setOptions] = useState([
    { label: "Deploy New Personal Agent", value: "Tokenize Agent" },
  ]);
  const [selectedOption, setSelectedOption] = useState("Tokenize Agent");
  const [showMsg, setShowMsg] = useState(false);
  const [msgClass, setMsgClass] = useState("");
  const [msgText, setMsgText] = useState("");

  const getProjectList = async (address: any) => {
    try {
      const result = await internalClient.get(
        `/api/project/mylist?creator=${address}`,
      );
      let newTypes = [
        { label: "New Personal Agent", value: "personal" },
        { label: "New Kinship Agent", value: "kinship" },
      ];
      for (let index = 0; index < result.data.length; index++) {
        const element = result.data[index];
        newTypes.push({ label: element.name, value: element.symbol });
      }
      setProjectType(newTypes);
    } catch (error) {
      console.log("getProjectList error ", error);
    }
  };

  useEffect(() => {
    if (!wallet) {
      return;
    }
    getProjectList(wallet.publicKey.toBase58());
  }, [wallet]);

  useEffect(() => {
    if (selectedProjectType === "New Personal Agent") {
      setOptions([{ label: "Tokenize Agent", value: "Tokenize Agent" }]);
    } else {
      getProjectDetailFromAPI(selectedProjectType);
    }
  }, [selectedProjectType]);

  const getProjectDetailFromAPI = async (symbol: any) => {
    try {
      const projectName = projectType.find(
        (val) => val.value === symbol,
      )?.label;
      let listResult = await axios.get(`/api/project/detail?symbol=${symbol}`);
      if (listResult.data.project.creator == wallet.publicKey.toBase58()) {
        setOptions([
          { label: `Empower ${projectName}`, value: "Tools" },
          { label: `Update ${projectName} Genesis Pass`, value: "Update" },
          { label: `Inform ${projectName}`, value: "Inform" },
          { label: "Manage Offerings", value: "Offerings" },
          {
            label: `Set ${projectName}'s Tokenomics`,
            value: "Coins",
          },
          { label: "Manage Teams", value: "Teams" },
          {
            label: `Instruct ${projectName}`,
            value: "Instruct",
          },
        ]);
      } else {
        let role = "";
        for (let index = 0; index < listResult.data.profiles.length; index++) {
          const element = listResult.data.profiles[index];
          if (element.profiles.length > 0) {
            if (element.profiles[0].wallet === wallet.publicKey.toBase58()) {
              role = element.role;
              break;
            }
          }
        }
        if (role == "Owner") {
          setOptions([
            { label: `Update ${projectName} Genesis Pass`, value: "Update" },
          ]);
        } else if (role == "Admin") {
          setOptions([{ label: "Manage Teams", value: "Teams" }]);
        } else if (role == "Treasurer") {
          setOptions([
            {
              label: `Set ${projectName}'s Tokenomics`,
              value: "Coins",
            },
          ]);
        } else if (role == "Connector") {
          setOptions([{ label: `Empower ${projectName}`, value: "Tools" }]);
        } else if (role == "Partner") {
          setOptions([{ label: "Manage Offerings", value: "Offerings" }]);
        } else if (role == "Producer") {
          setOptions([
            {
              label: `Instruct ${projectName}`,
              value: "Instruct",
            },
          ]);
        } else if (role == "Contributor") {
          setOptions([{ label: `Inform ${projectName}`, value: "Inform" }]);
        }
      }
    } catch (error) {
      setOptions([]);
    }
  };

  const onPageChange = () => { };

  const createMessage = (message: any, type: any) => {
    window.scrollTo(0, 0);
    setMsgText(message);
    setMsgClass(type);
    setShowMsg(true);
    // setLoading(false);
    // setButtonStatus("Mint")
    if (type == "success-container") {
      setTimeout(() => {
        setShowMsg(false);
      }, 4000);
    } else {
      setTimeout(() => {
        setShowMsg(false);
      }, 4000);
    }
  };

  return (
    <>
      {showMsg && (
        <div className={"message-container text-white text-center text-header-small-font-size py-5 px-3.5 " + msgClass}>{msgText}</div>
      )}
      <div className="background-content">
        <div className="flex flex-col items-center justify-center w-full">
          <div className="relative w-full flex flex-col justify-center items-center pt-10">
            <div className="max-w-md">
              <h2 className="text-center text-white font-goudy font-normal text-xl">
                Agent Studio
              </h2>
            </div>
          </div>
        </div>

        <div className="py-5 px-5 xl:px-32 lg:px-16 md:px-8">
          <div className="mb-10">
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 xl:grid-cols-4 gap-4">
              {/* <div>
                  <Select
                  value={selectedStudioType}
                  onChange={(e) =>{
                     createMessage("Design Studio currently supports the development of Projects only.", "warn-container");
                     setSelectedStudioType("Project");
                     }}
                     options={studioType}
                  />
               </div> */}
              <div className="lg:col-start-2 xl:col-start-2">
                <Select
                  value={selectedProjectType}
                  onChange={(e) => {
                    const projectName = projectType.find(
                      (val) => val.value === e.target.value,
                    )?.label;
                    if (!["personal", "kinship"].includes(e.target.value)) {
                      setOptions([
                        { label: `Empower ${projectName}`, value: "Tools" },
                        {
                          label: `Update ${projectName} Genesis Pass`,
                          value: "Update",
                        },
                        { label: `Inform ${projectName}`, value: "Inform" },
                        { label: "Manage Offerings", value: "Offerings" },
                        {
                          label: `Set ${projectName}'s Tokenomics`,
                          value: "Coins",
                        },
                        { label: "Manage Teams", value: "Teams" },
                        {
                          label: `Instruct ${projectName}`,
                          value: "Instruct",
                        },
                      ]);
                      setSelectedOption("Tools");
                    } else {
                      setOptions([
                        {
                          label: `Deploy ${projectName}`,
                          value: "Tokenize Agent",
                        },
                      ]);
                      setSelectedOption("Tokenize Agent");
                    }
                    setSelectedProjectType(e.target.value);
                  }}
                  options={projectType}
                />
              </div>
              <div>
                <Select
                  value={selectedOption}
                  onChange={(e) => {
                    setSelectedOption(e.target.value);
                  }}
                  options={options}
                />
              </div>
            </div>
          </div>
        </div>

        {selectedOption === "Tokenize Agent" && (
          <AgentPass type={selectedProjectType} />
        )}
        {selectedOption === "Update" && (
          <AgentPass symbol={selectedProjectType} type={selectedProjectType} />
        )}

        {selectedOption === "Tools" && (
          <AgentStudioToolsCreate symbol={selectedProjectType} />
        )}

        {selectedOption === "Teams" && (
          <AgentTeam onPageChange={onPageChange} symbol={selectedProjectType} />
        )}
        {selectedOption === "Coins" && (
          <AgentCoin onPageChange={onPageChange} symbol={selectedProjectType} createMessage={createMessage}  />
        )}
        {selectedOption === "step4" && (
          <ProjectCreateStep4 onPageChange={onPageChange} />
        )}
        {selectedOption === "Vesting" && (
          <ProjectCreateStep7 onPageChange={onPageChange} />
        )}
        {selectedOption === "Listing" && (
          <ProjectCreateStep8 onPageChange={onPageChange} />
        )}
        {selectedOption === "Inform" && (
          <ProjectCreateStep9 symbol={selectedProjectType} />
        )}

        {selectedOption === "Offerings" && (
          <AgentOffer symbol={selectedProjectType} />
        )}

        {selectedOption === "Instruct" && (
          <InstructAgent symbol={selectedProjectType} />
        )}
      </div>
    </>
  );
}
