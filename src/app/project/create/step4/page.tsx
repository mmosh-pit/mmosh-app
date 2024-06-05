"use client";

import ImagePicker from "@/app/components/ImagePicker";
import Button from "@/app/components/common/Button";
import Input from "@/app/components/common/Input";
import Radio from "@/app/components/common/Radio";
import Calender from "@/assets/icons/Calender";
import TimeIcon from "@/assets/icons/TimeIcon";
import React from "react";

export default function ProjectCreateStep4() {
     const gotoStep5 = () => {

     }

     const goBack = () => {
        
     }

    return (
        <div className="relative background-content">
            <div className="flex flex-col items-center justify-center w-full">
                <div className="relative w-full flex flex-col justify-center items-center pt-5">
                    <div className="max-w-md">
                        <h2 className="text-center text-white font-goudy font-normal text-xl">Launch Your Project</h2>
                        <h3 className="text-center text-white font-goudy text-sub-title-font-size pt-2.5">Step 4</h3>
                        <h3 className="text-center text-white font-goudy font-normal text-sub-title-font-size pt-1.5">Set Token Presale Launch and DEX Listing</h3>
                        <p className="text-para-font-size light-gray-color text-center para-line-height pt-2.5 text-light-gray leading-4">Build demand for your Community Coin with a powerful token presale and automate your DEX listings.</p>
                    </div>
                </div>
            </div>
            <div className="py-5 px-5 xl:px-32 lg:px-16 md:px-8">
                <div className="grid grid-cols-12">
                   <div className="col-start-3 col-span-8">
                        <div className="backdrop-container rounded-xl p-5 border border-white border-opacity-20 grid grid-cols-1 md:grid-cols-12 gap-4 mb-10">
                            <div className="col-span-4">
                                <div className="rounded-full gradient-container p-1.5">
                                   <img src="/profile.png" className="object-cover rounded-full w-full" />
                                </div>
                            </div>
                            <div className="col-span-4">
                                <div className="md:px-3.5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="mb-10">
                                            <label className="text-while text-header-small-font-size block">Name</label>
                                            <span className="text-while text-header-small-font-size block">Coin1</span>
                                        </div>
                                        <div className="mb-10">
                                            <label className="text-while text-header-small-font-size block">Symbol</label>
                                            <span className="text-while text-header-small-font-size block">Coin12</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="mb-10">
                                            <label className="text-while text-header-small-font-size block">Supply</label>
                                            <span className="text-while text-header-small-font-size block">12</span>
                                        </div>
                                        <div className="mb-10">
                                            <label className="text-while text-header-small-font-size block">List Price</label>
                                            <span className="text-while text-header-small-font-size block">12</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-while text-header-small-font-size block">Fully Diluted Value (FDV)</label>
                                        <span className="text-while text-header-small-font-size block">123</span>
                                    </div>
                                </div>

                            </div>
                            <div className="col-span-4">
                                <div>
                                    <label className="text-while text-header-small-font-size block">Description</label>
                                    <span className="text-while text-header-small-font-size block">Lorem ipsum dolor sit amet</span>
                                 </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                               <div className="pb-3.5">
                               <p className="text-xs text-whilte">Presale Start Date and Time</p>
                               <div className="grid grid-cols-2 gap-4">
                                   <div>
                                        <label className="input input-bordered h-10 text-base bg-black bg-opacity-[0.07] placeholder-white placeholder-opacity-[0.3] backdrop-container flex items-center gap-2 px-2">
                                        <div className="border-r border-white border-opacity-20 pr-2 h-full pt-2">
                                           <Calender />
                                        </div>
                               
                                        <input type="text" className="grow" placeholder="Start Date" />
                                        </label>
                                   </div>
                                   <div>
                                        <label className="input input-bordered h-10 text-base bg-black bg-opacity-[0.07] placeholder-white placeholder-opacity-[0.3] backdrop-container flex items-center gap-2 px-2">
                                        <div className="border-r border-white border-opacity-20 pr-2 h-full pt-2.5">
                                           <TimeIcon />
                                        </div>
                               
                                        <input type="text" className="grow" placeholder="Time" />
                                        </label>
                                   </div>
                               </div>
                               </div>
                               <div className="pb-3.5">
                               <p className="text-xs text-whilte">Presale End Date and Time</p>
                               <div className="grid grid-cols-2 gap-4">
                                   <div>
                                        <label className="input input-bordered h-10 text-base bg-black bg-opacity-[0.07] placeholder-white placeholder-opacity-[0.3] backdrop-container flex items-center gap-2 px-2">
                                        <div className="border-r border-white border-opacity-20 pr-2 h-full pt-2">
                                           <Calender />
                                        </div>
                               
                                        <input type="text" className="grow" placeholder="Start Date" />
                                        </label>
                                   </div>
                                   <div>
                                        <label className="input input-bordered h-10 text-base bg-black bg-opacity-[0.07] placeholder-white placeholder-opacity-[0.3] backdrop-container flex items-center gap-2 px-2">
                                        <div className="border-r border-white border-opacity-20 pr-2 h-full pt-2.5">
                                           <TimeIcon />
                                        </div>
                               
                                        <input type="text" className="grow" placeholder="Time" />
                                        </label>
                                   </div>
                               </div>
                               </div>
                               <div>
                               <p className="text-xs text-whilte">DEX Listing Date and Time</p>
                               <div className="grid grid-cols-2 gap-4">
                                   <div>
                                        <label className="input input-bordered h-10 text-base bg-black bg-opacity-[0.07] placeholder-white placeholder-opacity-[0.3] backdrop-container flex items-center gap-2 px-2">
                                        <div className="border-r border-white border-opacity-20 pr-2 h-full pt-2">
                                           <Calender />
                                        </div>
                               
                                        <input type="text" className="grow" placeholder="Start Date" />
                                        </label>
                                   </div>
                                   <div>
                                        <label className="input input-bordered h-10 text-base bg-black bg-opacity-[0.07] placeholder-white placeholder-opacity-[0.3] backdrop-container flex items-center gap-2 px-2">
                                        <div className="border-r border-white border-opacity-20 pr-2 h-full pt-2.5">
                                           <TimeIcon />
                                        </div>
                               
                                        <input type="text" className="grow" placeholder="Time" />
                                        </label>
                                   </div>
                               </div>
                               </div>
                            </div>
                            <div>
                                <div className="pb-3.5">
                                  <div className="grid grid-cols-3 gap-4">
                                       <div className="col-span-2">
                                            <Input
                                                type="text"
                                                title="Total Supply Allocated to Presale"
                                                required
                                                helperText=""
                                                placeholder="%"
                                                value={""}
                                                onChange={(e) => {}}
                                            />
                                       </div>
                                        <div className="col-span-1">
                                           <p className="text-right text-header-small-font-size mt-7">10,000 Coin12</p>
                                        </div>
                                  </div>

                                </div>
                                <div className="pb-3.5">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="col-span-2">
                                            <Input
                                                type="text"
                                                title="Minimum Presale Purchases Required to List on DEXs"
                                                required
                                                helperText="Minimum presale purchases must be less than or equal to total presale allocation."
                                                placeholder="%"
                                                value={""}
                                                onChange={(e) => {}}
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <p className="text-right text-header-small-font-size mt-7">10,000 Coin12</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                   </div>

                </div>
                <div className="flex justify-center mt-10">
                    <button className="btn btn-link text-white no-underline" onClick={goBack}>Back</button>
                    <button className="btn btn-primary ml-10 bg-primary text-white border-none hover:bg-primary hover:text-white" onClick={gotoStep5}>Next</button>
                </div>
            </div>
        </div>
    );
}
