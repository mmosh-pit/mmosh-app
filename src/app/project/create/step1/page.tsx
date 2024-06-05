"use client";

import ImagePicker from "@/app/components/ImagePicker";
import Button from "@/app/components/common/Button";
import Input from "@/app/components/common/Input";
import Radio from "@/app/components/common/Radio";
import React from "react";

export default function ProjectCreateStep1() {
    const [image, setImage] = React.useState<File | null>(null);
    const [preview, setPreview] = React.useState("");

    const [invitationTypes, setInvitationTypes] = React.useState(["required","optional","none"]);
    const [invitationType, setInvitationType] = React.useState("required");
    const [priceDistribution, setPriceDistribution] =  React.useState<any>({
        echosystem: 3,
        curator: 2,
        creator: 70,
        promoter: 20,
        scout: 5,
    });
    const [invitaitonPrice, setInvitationPrice] = React.useState("");
    const [discount, setDiscount] = React.useState("")

    React.useEffect(() => {
        if (!image) return;
        const objectUrl = URL.createObjectURL(image);
        setPreview(objectUrl);
    }, [image]);

    const onRadioChange = () => {
    }

    const chooseInvitationType = (currentInvitationType:any) => {
        setInvitationType(currentInvitationType)
        if(currentInvitationType == "none") {
            setPriceDistribution({
               echosystem: 3,
               curator: 7,
               creator: 90,
               promoter: 0,
               scout: 0,
            })
            setInvitationPrice("");
        } else {
            setPriceDistribution({
               echosystem: 3,
               curator: 2,
               creator: 70,
               promoter: 20,
               scout: 5,
            })
        }
     }

     const getTotalPercentage = () => {
        return  Number(priceDistribution.echosystem) +  Number(priceDistribution.creator) + Number(priceDistribution.curator) + Number(priceDistribution.promoter) + Number(priceDistribution.scout);
     }

     const gotoStep2 = () => {

     }

     const goBack = () => {
        
     }

    return (
        <div className="relative background-content">
            <div className="flex flex-col items-center justify-center w-full">
                <div className="relative w-full flex flex-col justify-center items-center pt-5">
                    <div className="max-w-md">
                        <h2 className="text-center text-white font-goudy font-normal text-xl">Launch Your Project</h2>
                        <h3 className="text-center text-white font-goudy text-sub-title-font-size pt-2.5">Step 1</h3>
                        <h3 className="text-center text-white font-goudy font-normal text-sub-title-font-size pt-1.5">Design your Project Pass</h3>
                        <p className="text-para-font-size light-gray-color text-center para-line-height pt-2.5 text-light-gray leading-4">Projects are the economic engine of Web3. Each Project has a specific purpose and leverages protocols, tokens and communities to achieve the goals set by the Project founder. The total cost of deploying your Project will be 100,000 MMOSH plus a minimum of $100 in USDC, SOL and MMOSH to provide liquidity for your project’s Community Coin. You will be able to save your work and return later to complete the process.</p>
                    </div>
                </div>
            </div>
            <div className="py-5 px-5 xl:px-32 lg:px-16 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-9 gap-4">
                        <div className="xl:col-span-2">
                           <ImagePicker changeImage={setImage} image={preview} />
                        </div>
                        <div className="xl:col-span-2">
                            <div className="form-element pt-2.5">
                                <Input
                                    type="text"
                                    title="Name"
                                    required
                                    helperText="Up to 50 characters, can have spaces."
                                    placeholder="Name"
                                    value={""}
                                    onChange={(e) => {}}
                                />
                            </div>
                            <div className="form-element pt-2.5">
                                <Input
                                    type="text"
                                    title="Symbol"
                                    required
                                    helperText="15 characters"
                                    placeholder="Symbol"
                                    value={""}
                                    onChange={(e) => {}}
                                />
                            </div>
                            <div className="form-element pt-2.5">
                                <Input
                                    textarea
                                    type="text"
                                    title="Description"
                                    required
                                    helperText=""
                                    placeholder="Describe your Community within 160 characters."
                                    value={""}
                                    onChange={(e) => {}}
                                />
                            </div>
                        </div>
                        <div className="xl:col-span-2">
                            <div className="form-element pt-2.5">
                                <Input
                                    type="text"
                                    title="Project Pass Price"
                                    required
                                    helperText=""
                                    placeholder="0"
                                    value={""}
                                    onChange={(e) => {}}
                                />
                            </div>
                            <div className="form-element pt-2.5">
                                <Input
                                    type="text"
                                    title="Project Website"
                                    required
                                    helperText=""
                                    placeholder="Project Website"
                                    value={""}
                                    onChange={(e) => {}}
                                />
                            </div>
                            <div className="form-element pt-2.5">
                                <Input
                                    type="text"
                                    title="Project Telegram"
                                    required
                                    helperText=""
                                    placeholder="Project Telegram"
                                    value={""}
                                    onChange={(e) => {}}
                                />
                            </div>
                            <div className="form-element pt-2.5">
                                <Input
                                    type="text"
                                    title="Project Twitter"
                                    required
                                    helperText=""
                                    placeholder="Project Twitter"
                                    value={""}
                                    onChange={(e) => {}}
                                />
                            </div>
                            <div className="flex pt-2.5">
                                 <Radio title="Create a new Community Coin" checked={true} onChoose={onRadioChange} disabled={false}/>
                                 <Radio title="Use an Existing Coin" checked={false} onChoose={onRadioChange} disabled={true}/>
                            </div>
                           
                        </div>
                        <div className="xl:col-span-3">
                             <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mb-5">
                                <div className="col-span-5">
                                    <div className="invitation-type-options">
                                        <p className="text-xs text-white">Invitation to Mint a Pass</p>
                                        <div className="grid grid-cols-3 gap-4 ">
                                            {invitationTypes.map((invitationTypeItem: any, index: any) => (
                                                <div className="text-center" key={index} onClick={()=>{chooseInvitationType(invitationTypeItem)}}>
                                                    <div className={invitationTypeItem == invitationType ? "invitation-type-option-item-select active" : "invitation-type-option-item-select" }>
                                                        {invitationTypeItem == invitationType &&
                                                            <input type="checkbox" checked className="checkbox" />
                                                        }
                                                        {invitationTypeItem != invitationType &&
                                                            <input type="checkbox" className="checkbox" />
                                                        }
                                                    </div>
                                                    <p className="text-xs text-white leading-3">{invitationTypeItem}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {invitationType == "optional" &&
                                    <div className="col-span-3">
                                            <div className="profile-container-element">
                                                <Input
                                                    type="text"
                                                    title="Discount"
                                                    required
                                                    helperText=""
                                                    placeholder="%"
                                                    value={""}
                                                    onChange={(e) => {}}
                                                />
                                            </div>
                                    </div>
                                }
                                {invitationType != "none" &&
                                <div className="col-span-4">
                                    <div className="profile-container-element">
                                        <Input
                                            type="text"
                                            title="Mint Price for Invitation"
                                            required={false}
                                            helperText=""
                                            placeholder="0"
                                            value={""}
                                            onChange={(e) => {}}
                                        />
                                    </div>
                                </div>
                                }
                            </div>
                       
                            <div className="project-share-royalties">
                                <h4 className="text-header-small-font-size mt-2">Set the Royalties for the Project</h4>
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-2.5">
                                    <div>
                                        <div className="project-share-royalties-info">
                                            <label className="text-xs text-white mr-2">Ecosystem</label>
                                            <span className="text-header-small-font-size text-white ">MMOSH DAO {priceDistribution.echosystem} %</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="project-share-royalties-info">
                                            <label className="text-xs text-white mr-2">Curator</label>
                                            <span className="text-header-small-font-size text-white">Your Promoter {priceDistribution.curator} %</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex mt-2 mb-3.5">
                                    <label className="text-xs text-white leading-10 min-w-12">Creator</label>
                                    {invitationType == "none" &&
                                        <span className="text-header-small-font-size text-white mx-2 leading-10">{priceDistribution.creator}% </span>
                                    }
                                    {invitationType != "none" &&
                                        <div className="mx-2">
                                            <input
                                                type="text"
                                                value={priceDistribution.creator}
                                                onChange={(event) => {
                                                    let priceDetails = {
                                                        echosystem: 3,
                                                        curator: 2,
                                                        creator: event.target.value,
                                                        promoter: priceDistribution.promoter,
                                                        scout: priceDistribution.scout,
                                                    };
                                                    setPriceDistribution(priceDetails)
                                                }}
                                                placeholder="0"
                                                className="input input-bordered h-10 text-base bg-black bg-opacity-[0.07] placeholder-white placeholder-opacity-[0.3] backdrop-container w-16"
                                            />
                                        </div>
                                    }
                                    <span className="text-header-small-font-size text-white leading-10">Your royalties</span>
                                </div>
                            </div>
                            {invitationType != "none" &&
                                <div className="project-share-royalties-agents">
                                    <h4 className="text-header-small-font-size">Agents</h4>
                                    <div className="flex">
                                        <label className="text-xs text-white leading-10 min-w-12">Promoter</label>
                                        <div className="mx-2">
                                            <input
                                                type="text"
                                                value={priceDistribution.promoter}
                                                onChange={(event) => {
                                                    let priceDetails = {
                                                        echosystem: 3,
                                                        curator: 2,
                                                        creator: priceDistribution.creator,
                                                        promoter: event.target.value,
                                                        scout: priceDistribution.scout,
                                                    };
                                                    setPriceDistribution(priceDetails)
                                                }}
                                                placeholder="0"
                                                className="input input-bordered h-10 text-base bg-black bg-opacity-[0.07] placeholder-white placeholder-opacity-[0.3] backdrop-container w-16"
                                            />
                                        </div>
                                        <span className="text-header-small-font-size text-white leading-10">Promotes your community</span>
                                    </div>
                                    <div className="flex mt-2">
                                        <label className="text-xs text-white leading-10 min-w-12">Scout</label>
                                        <div className="mx-2">
                                            <input
                                                type="text"
                                                value={priceDistribution.scout}
                                                onChange={(event) => {
                                                    let priceDetails = {
                                                        echosystem: 3,
                                                        curator: 2,
                                                        creator: priceDistribution.creator,
                                                        promoter: priceDistribution.promoter,
                                                        scout: event.target.value,
                                                    };
                                                    setPriceDistribution(priceDetails)
                                                }}
                                                placeholder="0"
                                                className="input input-bordered h-10 text-base bg-black bg-opacity-[0.07] placeholder-white placeholder-opacity-[0.3] backdrop-container w-16"
                                            />
                                        </div>
                                        <span className="text-header-small-font-size text-white">Organizes, encourages, trains and motivates Promoters</span>
                                    </div>
                                </div>
                            }

                            <div className="mt-3.5">
                                <h6><label className="text-header-small-font-size text-white font-bold mr-2">Total: </label> <span className="text-header-small-font-size text-white font-bold">{getTotalPercentage()}</span></h6>
                            </div> 
                        </div>
                </div>
                <div className="flex justify-center mt-10">
                    <button className="btn btn-link text-white no-underline" onClick={goBack}>Back</button>
                    <button className="btn btn-primary ml-10 bg-primary text-white border-none hover:bg-primary hover:text-white" onClick={gotoStep2}>Next</button>
                </div>
            </div>
        </div>
    );
}
