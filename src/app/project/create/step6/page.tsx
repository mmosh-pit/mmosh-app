"use client";

import ImagePicker from "@/app/components/ImagePicker";
import Button from "@/app/components/common/Button";
import Input from "@/app/components/common/Input";
import Radio from "@/app/components/common/Radio";
import Select from "@/app/components/common/Select";
import AddIcon from "@/assets/icons/AddIcon";
import Calender from "@/assets/icons/Calender";
import TimeIcon from "@/assets/icons/TimeIcon";
import React, { useState } from "react";

export default function ProjectCreateStep6() {
    const [tokenomics, setTokenomics] = useState([{
      label:"Founder",
      value:"Founder"
    },
    {
        label:"Community",
        value:"Community"
    },
    {
        label:"Treasury",
        value:"Treasury"
    },
    {
        label:"Other",
        value:"Other"
    }])
    const [selectedtype, SetSelectedType] = useState("Founder")
    const [distribution, setDistribution] = useState(1);

    const distributeAction = (type:any) => {
        if(type === "add") {
            setDistribution(distribution + 1);
        } else {
           if(distribution > 1) {
            setDistribution(distribution - 1);
           }
        }
      }

     const gotoStep7 = () => {

     }

     const goBack = () => {
        
     }

    return (
        <div className="relative background-content">
            <div className="flex flex-col items-center justify-center w-full">
                <div className="relative w-full flex flex-col justify-center items-center pt-5">
                    <div className="max-w-md">
                        <h2 className="text-center text-white font-goudy font-normal text-xl">Launch Your Project</h2>
                        <h3 className="text-center text-white font-goudy text-sub-title-font-size pt-2.5">Step 6</h3>
                        <h3 className="text-center text-white font-goudy font-normal text-sub-title-font-size pt-1.5">Set Tokenomics</h3>
                        <p className="text-para-font-size light-gray-color text-center para-line-height pt-2.5 text-light-gray leading-4">Set the token distribution plan for your Community Coin.</p>
                    </div>
                </div>
            </div>
            <div className="py-5 px-5 xl:px-32 lg:px-16 md:px-8">
                <div className="grid grid-cols-12">
                   <div className="col-start-5 col-span-4">
                        <div className="backdrop-container rounded-xl py-5 px-10 border border-white border-opacity-20 mb-10 ">
                            <h3 className="text-sub-title-font-size text-while font-poppins mb-5 text-center">Tokenomics</h3>
                            {Array.from(Array(distribution), (e, i) => (
                                <div className="mt-3.5">
                                    <div className="grid grid-cols-2 gap-4">
                                            <Select
                                            value={selectedtype}
                                            onChange={(e) =>
                                                SetSelectedType(e.target.value)
                                            }
                                            options={tokenomics}
                                            />
                                            <Input
                                                type="text"
                                                title=""
                                                required={false}
                                                helperText=""
                                                placeholder="%"
                                                value={""}
                                                onChange={(e) => {}}
                                            />
                                    </div>
                                </div>
                            ))}

                            <div className="mt-5 mb-10">
                                <div className="cursor-pointer" onClick={()=>{distributeAction("add")}}>
                                    <AddIcon />
                                </div>
                            </div>
                            <div className="border-t border-white border-opacity-20">
                                  <div className="flex justify-center pt-5">
                                       <p className="text-header-small-font-size text-white min-w-24 ">
                                       MMOSH DAO
                                       </p>
                                        <span className="text-header-small-font-size text-white">
                                        2%
                                       </span>
                                  </div>
                                  <div className="flex justify-center pt-2.5">
                                  <p className="text-header-small-font-size text-white min-w-24 ">
                                       Curator
                                       <label className="text-small-font-size text-white block"> (Founder Agent)</label>
                                       </p>
                                        <span className="text-header-small-font-size text-white">
                                        1%
                                       </span>
                                  </div>
                                  <div className="flex justify-center pt-10">
                                       <p className="text-header-small-font-size text-white min-w-24 font-bold">
                                       Total
                                       </p>
                                        <span className="text-header-small-font-size text-white font-bold">
                                        32%
                                       </span>
                                  </div>
                            </div>
                        </div>
       
               
                   </div>

                </div>
                <div className="flex justify-center mt-10">
                    <button className="btn btn-link text-white no-underline" onClick={goBack}>Back</button>
                    <button className="btn btn-primary ml-10 bg-primary text-white border-none hover:bg-primary hover:text-white" onClick={gotoStep7}>Next</button>
                </div>
            </div>
        </div>
    );
}
