"use client";

import AgentPass from "@/app/components/Project/AgentPass";
import ProjectCreateStep2 from "@/app/components/Project/ProjectCreateStep2";
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

export default function ProjectCreate() {
  const wallet: any = useWallet();

  const [projectType, setProjectType] = useState([
    { label: "New Personal Agent", value: "New Personal Agent" },
  ]);
  const [selectedProjectType, setSelectedProjectType] =
    useState("New Personal Agent");

  const [options, setOptions] = useState([
    { label: "Tokenize Agent", value: "Tokenize Agent" },
  ]);
  const [selectedOption, setSelectedOption] = useState("Tokenize Agent");

  const getProjectList = async (address: any) => {
    try {
      const result = await axios.get(`/api/project/mylist?creator=${address}`);
      let newTypes = [
        { label: "New Personal Agent", value: "New Personal Agent" },
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

  const onPageChange = () => { };

  return (
    <>
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
                    if (e.target.value !== "New Personal Agent") {
                      setOptions([
                        { label: `Empower ${projectName}`, value: "Tools" },
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

        {selectedOption === "Tokenize Agent" && <AgentPass />}

        {selectedOption === "Tools" && (
          <AgentStudioToolsCreate symbol={selectedProjectType} />
        )}

        {selectedOption === "Communities" && (
          <ProjectCreateStep2 onPageChange={onPageChange} />
        )}
        {selectedOption === "Coins" && (
          <AgentCoin
            onPageChange={onPageChange}
            symbol={selectedProjectType}
          />
        )}
        {selectedOption === "step4" && (
          <ProjectCreateStep4 onPageChange={onPageChange} />
        )}
        {/* {currentStep === "step5" &&
            <ProjectCreateStep5 onPageChange={onPageChange}/>
         }
         {currentStep === "step6" &&
            <ProjectCreateStep6 onPageChange={onPageChange}/>
         } */}
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
          <div className="flex justify-center">
            <p className="text-base">
              Coming soon! Your agent will be able to offer goods and services,
              both digital and physical, and sign up personal agents as
              promotional partners for affiliate marketing programs.
            </p>
          </div>
        )}

        {selectedOption === "Teams" && (
          <div className="flex justify-center">
            <p className="text-base">
              Coming soon! You’ll be able to build and manage a team to inform
              your agent, refine the instructions, support your subscribers,
              promote your token and help out in many other ways.
            </p>
          </div>
        )}

        {selectedOption === "Instruct" && (
          <div className="flex justify-center">
            <p className="text-base">
              Coming soon! You’ll be able to refine your agent’s personality and
              instruct them to perform a wide variety of tasks.
            </p>
          </div>
        )}
        {/* {currentStep === "step10" &&
            <ProjectCreateStep10 onPageChange={onPageChange}/>
         } */}
      </div>
    </>
  );
}
