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

export default function ProjectCreateStep7() {


     const gotoStep8 = () => {

     }

     const goBack = () => {
        
     }

    return (
        <div className="relative background-content">
            <div className="flex flex-col items-center justify-center w-full">
                <div className="relative w-full flex flex-col justify-center items-center pt-5">
                    <div className="max-w-md">
                        <h2 className="text-center text-white font-goudy font-normal text-xl">Launch Your Project</h2>
                        <h3 className="text-center text-white font-goudy text-sub-title-font-size pt-2.5">Step 7</h3>
                        <h3 className="text-center text-white font-goudy font-normal text-sub-title-font-size pt-1.5">Set the Vesting Schedule for your Community Coin.</h3>
                        <p className="text-para-font-size light-gray-color text-center para-line-height pt-2.5 text-light-gray leading-4">Those who receive a significant share of tokens will be required to hold the tokens for a period of time before they can be sold.</p>
                    </div>
                </div>
            </div>
            <div className="py-5 px-5 xl:px-32 lg:px-16 md:px-8">
                <div className="grid grid-cols-12">
                   <div className="col-start-4 col-span-6">
                        <div className="backdrop-container rounded-xl py-5 px-10 border border-white border-opacity-20 mb-10 ">
                            <h3 className="text-sub-title-font-size text-while font-poppins text-center pb-10">Vesting Schedule</h3>

                            <div className="grid grid-cols-3 gap-4 text-center mb-5">
                                <h5 className="text-header-small-font-size text-white">Distribution Plan</h5>
                                <h5 className="text-header-small-font-size text-white">Cliff Month</h5>
                                <h5 className="text-header-small-font-size text-white">Vesting Months</h5>
                            </div>

                            <div className="grid grid-cols-3 gap-4 text-center mb-5">
                                <p className="text-para-font-size text-white leading-10">Founder 5%</p>
                                <div className="w-12 mx-auto">
                                    <Input
                                        type="text"
                                        title=""
                                        required={false}
                                        helperText=""
                                        placeholder="0"
                                        value={""}
                                        onChange={(e) => {}}
                                    />
                                </div>
                                <div className="w-12 mx-auto">
                                <Input
                                    type="text"
                                    title=""
                                    required={false}
                                    helperText=""
                                    placeholder="0"
                                    value={""}
                                    onChange={(e) => {}}
                                />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 text-center mb-5">
                                <p className="text-para-font-size text-white  leading-10">Community 5%</p>
                                <div className="w-12 mx-auto">
                                    <Input
                                        type="text"
                                        title=""
                                        required={false}
                                        helperText=""
                                        placeholder="0"
                                        value={""}
                                        onChange={(e) => {}}
                                    />
                                </div>
                                <div className="w-12 mx-auto">
                                <Input
                                    type="text"
                                    title=""
                                    required={false}
                                    helperText=""
                                    placeholder="0"
                                    value={""}
                                    onChange={(e) => {}}
                                />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 text-center">
                                <p className="text-para-font-size text-white  leading-10">Treasury 45%</p>
                                <div className="w-12 mx-auto">
                                    <Input
                                        type="text"
                                        title=""
                                        required={false}
                                        helperText=""
                                        placeholder="0"
                                        value={""}
                                        onChange={(e) => {}}
                                    />
                                </div>
                                <div className="w-12 mx-auto">
                                <Input
                                    type="text"
                                    title=""
                                    required={false}
                                    helperText=""
                                    placeholder="0"
                                    value={""}
                                    onChange={(e) => {}}
                                />
                                </div>
                            </div>
                            
                            
                            <p className="text-header-small-font-size text-center pt-10">NOTE: Unvested tokens will be held by the MMOSH protocol until they are vested. At that time they will be released to the Founder for distribution. Vesting schedules are counted from the Listing Date.</p>

  
                        </div>
                   </div>

                </div>
                <div className="flex justify-center mt-10">
                    <button className="btn btn-link text-white no-underline" onClick={goBack}>Back</button>
                    <button className="btn btn-primary ml-10 bg-primary text-white border-none hover:bg-primary hover:text-white" onClick={gotoStep8}>Next</button>
                </div>
            </div>
        </div>
    );
}
