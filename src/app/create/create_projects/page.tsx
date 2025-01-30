"use client";

import ProjectCreateStep1 from "@/app/components/Project/ProjectCreateStep1";
import ProjectCreateStep2 from "@/app/components/Project/ProjectCreateStep2";
import ProjectCreateStep3 from "@/app/components/Project/ProjectCreateStep3";
import ProjectCreateStep4 from "@/app/components/Project/ProjectCreateStep4";
import ProjectCreateStep5 from "@/app/components/Project/ProjectCreateStep5";
import ProjectCreateStep6 from "@/app/components/Project/ProjectCreateStep6";
import ProjectCreateStep7 from "@/app/components/Project/ProjectCreateStep7";
import ProjectCreateStep8 from "@/app/components/Project/ProjectCreateStep8";
import ProjectCreateStep9 from "@/app/components/Project/ProjectCreateStep9";
import ProjectCreateStep10 from "@/app/components/Project/ProjectCreateStep10";
import { useEffect, useState } from "react";
import next from "next";
import Select from "@/app/components/common/Select";
import useWallet from "@/utils/wallet";
import axios from "axios";

export default function ProjectCreate() {
  const wallet: any = useWallet();
  const [showMsg, setShowMsg] = useState(false);
  const [msgClass, setMsgClass] = useState("");
  const [msgText, setMsgText] = useState("");

  const [studioType, setStudioType] = useState([
    { label: "Project", value: "Project" },
    { label: "EcoSystem", value: "EcoSystem" },
    { label: "Community", value: "Community" },
  ]);
  const [selectedStudioType, setSelectedStudioType] = useState("Project");

  const [projectType, setProjectType] = useState([
    { label: "New Agent", value: "New Agent" },
  ]);
  const [selectedProjectType, setSelectedProjectType] = useState("New Agent");

  const [options, setOptions] = useState([
    { label: "Agent Pass", value: "Agent Pass" },
  ]);
  const [selectedOption, setSelectedOption] = useState("Agent Pass");

  const getProjectList = async (address: any) => {
    try {
      const result = await axios.get(`/api/project/mylist?creator=${address}`);
      let newTypes = [{ label: "New Agent", value: "New Agent" }];
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

  const createMessage = (message: any, type: any) => {
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
  };

  const onPageChange = (page: any) => { };

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
                    if (e.target.value !== "New Agent") {
                      setOptions([
                        { label: "Tools", value: "Tools" },
                        { label: "Assets", value: "Assets" },
                        { label: "Intent", value: "Intent" },
                        { label: "License", value: "License" },
                        { label: "Coins", value: "Coins" },
                        { label: "Teams", value: "Teams" },
                        { label: "Communities", value: "Communities" },
                        { label: "Listing", value: "Listing" },
                        { label: "Launch", value: "Launch" },
                        { label: "Tokenomics", value: "Tokenomics" },
                        { label: "Vesting", value: "Vesting" },
                      ]);
                      setSelectedOption("Agent Coins");
                    } else {
                      setOptions([
                        { label: "Agent Pass", value: "Agent Pass" },
                      ]);
                      setSelectedOption("Agent Pass");
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

        {selectedOption === "Agent Pass" && <ProjectCreateStep1 />}
        {selectedOption === "Communities" && (
          <ProjectCreateStep2 onPageChange={onPageChange} />
        )}
        {selectedOption === "Coins" && (
          <ProjectCreateStep3
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
        {selectedOption === "Assets" && (
          <ProjectCreateStep9 symbol={selectedProjectType} />
        )}
        {/* {currentStep === "step10" &&
            <ProjectCreateStep10 onPageChange={onPageChange}/>
         } */}
      </div>
    </>
  );
}
