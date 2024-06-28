"use client";

import ImagePicker from "@/app/components/ImagePicker";
import Button from "@/app/components/common/Button";
import Input from "@/app/components/common/Input";
import Radio from "@/app/components/common/Radio";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProjectCreateStep1() {
    const navigate = useRouter();
    const [loading, setLoading] = useState(false)
    const [showMsg, setShowMsg] = useState(false);
    const [msgClass, setMsgClass] = useState("");
    const [msgText, setMsgText] = useState("");

    const [image, setImage] = React.useState<File | null>(null);

    const [fields, setFields] = useState({
        image: {
            preview: "",
            type:""
        },
        name: "", 
        symbol: "",
        desc: "",
        passPrice: 0,
        website: "",
        telegram: "",
        twitter:"",
        priceDistribution: {
            echosystem: 3,
            curator: 2,
            creator: 70,
            promoter: 20,
            scout: 5,
        },
        invitationType: "required",
        invitationPrice: 0,
        discount: 0.0,
    })

    const [invitationTypes, setInvitationTypes] = React.useState(["required","optional","none"]);

    React.useEffect(() => {
        if (!image) return;
        const objectUrl = URL.createObjectURL(image);
        let imageObj = {
            preview: objectUrl,
            type: image.type
        }
        setFields({ ...fields, image: imageObj })
    }, [image]);


    React.useEffect(()=>{
        if(localStorage.getItem("projectstep1")) {
          let savedData:any = localStorage.getItem("projectstep1");
          setFields(JSON.parse(savedData));
        }
      },[])

    const onRadioChange = () => {
    }

    const chooseInvitationType = (currentInvitationType:any) => {
        let invitationPrice = fields.invitationPrice;
        let distribution = {
            echosystem: 3,
            curator: 2,
            creator: 70,
            promoter: 20,
            scout: 5,
         }
        if(currentInvitationType == "none") {
            distribution = {
               echosystem: 3,
               curator: 7,
               creator: 90,
               promoter: 0,
               scout: 0,
            }
            invitationPrice = 0;
        } 
        setFields({
            image: fields.image,
            name: fields.name, 
            symbol: fields.symbol,
            desc: fields.desc,
            passPrice: fields.passPrice,
            website: fields.website,
            telegram: fields.telegram,
            twitter:fields.twitter,
            priceDistribution: distribution,
            invitationType: currentInvitationType,
            invitationPrice: invitationPrice,
            discount: fields.discount,
        });
     }

     const getTotalPercentage = () => {
        return  Number(fields.priceDistribution.echosystem) +  Number(fields.priceDistribution.creator) + Number(fields.priceDistribution.curator) + Number(fields.priceDistribution.promoter) + Number(fields.priceDistribution.scout);
     }

     const createMessage = (message: any, type: any) => {
        window.scrollTo(0, 0);
        setMsgText(message);
        setMsgClass(type);
        setShowMsg(true);
        setLoading(false)
        if(type == "success-container") {
          setTimeout(() => {
            setShowMsg(false);
          }, 4000);
        } else {
          setTimeout(() => {
            setShowMsg(false);
          }, 4000);
        }
    
      };

     const validateFields = () => {
        if (fields.name.length == 0) {
          createMessage("Name is required", "danger-container");
          return false;
        }

        if (fields.name.length > 50) {
            createMessage("Name should have less than 50 characters", "danger-container");
            return false;
        }
    
        if (fields.symbol.length == 0) {
          createMessage("Symbol is required", "danger-container");
          return false;
        }

        if (fields.symbol.length > 10) {
            createMessage("Symbol should have less than 10 characters", "danger-container");
            return false;
        }
    
        if (fields.desc.length == 0) {
          createMessage("Description is required", "danger-container");
          return false;
        }

        if (fields.desc.length > 160) {
            createMessage("Description should have less than 160 characters", "danger-container");
            return false;
          }
    
        if(fields.image.preview.length == 0) {
            createMessage("Project pass Image is required", "danger-container");
            return false;
        }

        if(fields.website.length > 0 && !isValidHttpUrl(fields.website)) {
            createMessage("Invalid website url", "danger-container");
            return false;
        }

        if (fields.passPrice == 0) {
            createMessage("Pass price not mentioned", "danger-container");
            return false;
        }

        if(fields.invitationType == "required" || fields.invitationType == "optional") {
            if (fields.invitationPrice == 0) {
                createMessage("Invitation price not mentioned", "danger-container");
                return false;
            }
        }

        if(fields.invitationType == "optional") {
            if (fields.discount == 0) {
                createMessage("Discount not mentioned", "danger-container");
                return false;
            }
        }

        if(getTotalPercentage() != 100) {
            createMessage("Price distribution is not 100%", "danger-container");
            return false;
        }

        return true;
    };

    const isValidHttpUrl = (url:any) => {
        try {
          const newUrl = new URL(url);
          return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
        } catch (err) {
          return false;
        }
    }
    
    const gotoStep2 = () => {
        setLoading(true);
        if(validateFields()) {
            localStorage.setItem("projectstep1",JSON.stringify(fields));
            navigate.push("/create/project/create/step2");
        } 
    }

    const goBack = () => {
        navigate.back();
    }

     const prepareNumber = (inputValue:any) => {
        if(isNaN(inputValue)) {
            return 0
        }
        return inputValue;
     }

    return (
        <>
        {showMsg && (
            <div className={"message-container text-white text-center text-header-small-font-size py-5 px-3.5 " + msgClass}>{msgText}</div>
        )}
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
                           <ImagePicker changeImage={setImage} image={fields.image.preview} />
                        </div>
                        <div className="xl:col-span-2">
                            <div className="form-element pt-2.5">
                                <Input
                                    type="text"
                                    title="Name"
                                    required
                                    helperText="Up to 50 characters, can have spaces."
                                    placeholder="Name"
                                    value={fields.name}
                                    onChange={(e) => setFields({ ...fields, name: e.target.value })}
                                />
                            </div>
                            <div className="form-element pt-2.5">
                                <Input
                                    type="text"
                                    title="Symbol"
                                    required
                                    helperText="10 characters"
                                    placeholder="Symbol"
                                    value={fields.symbol}
                                    onChange={(e) => setFields({ ...fields, symbol: e.target.value })}
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
                                    value={fields.desc}
                                    onChange={(e) => setFields({ ...fields, desc: e.target.value })}
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
                                    value={(fields.passPrice > 0 ? fields.passPrice.toString() : "")}
                                    onChange={(e) => setFields({ ...fields, passPrice: prepareNumber(Number(e.target.value))})}
                                />
                            </div>
                            <div className="form-element pt-2.5">
                                <Input
                                    type="text"
                                    title="Project Website"
                                    required
                                    helperText=""
                                    placeholder="Project Website"
                                    value={fields.website}
                                    onChange={(e) => setFields({ ...fields, website: e.target.value})}
                                />
                            </div>
                            <div className="form-element pt-2.5">
                                <Input
                                    type="text"
                                    title="Project Telegram"
                                    required
                                    helperText=""
                                    placeholder="Project Telegram"
                                    value={fields.telegram}
                                    onChange={(e) => setFields({ ...fields, telegram: e.target.value})}
                                />
                            </div>
                            <div className="form-element pt-2.5">
                                <Input
                                    type="text"
                                    title="Project Twitter"
                                    required
                                    helperText=""
                                    placeholder="Project Twitter"
                                    value={fields.twitter}
                                    onChange={(e) => setFields({ ...fields, twitter: e.target.value})}
                                />
                            </div>
                            <div className="flex pt-2.5">
                                 <Radio title="Create a new Community Coin" checked={true} onChoose={onRadioChange} disabled={false}/>
                                 <div className="relative">
                                    <Radio title="Use an Existing Coin" checked={false} onChoose={onRadioChange} disabled={true}/>
                                    <span className="coming-soon">Coming Soon</span>
                                 </div>
                               
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
                                                    <div className={invitationTypeItem == fields.invitationType ? "invitation-type-option-item-select active" : "invitation-type-option-item-select" }>
                                                        {invitationTypeItem == fields.invitationType &&
                                                            <input type="checkbox" checked className="checkbox" />
                                                        }
                                                        {invitationTypeItem != fields.invitationType &&
                                                            <input type="checkbox" className="checkbox" />
                                                        }
                                                    </div>
                                                    <p className="text-xs text-white leading-3">{invitationTypeItem}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {fields.invitationType == "optional" &&
                                    <div className="col-span-3">
                                            <div className="profile-container-element">
                                                <Input
                                                    type="text"
                                                    title="Discount"
                                                    required
                                                    helperText=""
                                                    placeholder="%"
                                                    value={(fields.discount > 0 ? fields.discount.toString() : "")}
                                                    onChange={(e) => setFields({ ...fields, discount: prepareNumber(Number(e.target.value))})}
                                                />
                                            </div>
                                    </div>
                                }
                                {fields.invitationType != "none" &&
                                <div className="col-span-4">
                                    <div className="profile-container-element">
                                        <Input
                                            type="text"
                                            title="Mint Price for Invitation"
                                            required={false}
                                            helperText=""
                                            placeholder="0"
                                            value={(fields.invitationPrice > 0 ? fields.invitationPrice.toString() : "")}
                                            onChange={(e) => setFields({ ...fields, invitationPrice: prepareNumber(Number(e.target.value))})}
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
                                            <span className="text-header-small-font-size text-white ">MMOSH DAO {fields.priceDistribution.echosystem} %</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="project-share-royalties-info">
                                            <label className="text-xs text-white mr-2">Curator</label>
                                            <span className="text-header-small-font-size text-white">Your Promoter {fields.priceDistribution.curator} %</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex mt-2 mb-3.5">
                                    <label className="text-xs text-white leading-10 min-w-12">Creator</label>
                                    {fields.invitationType == "none" &&
                                        <span className="text-header-small-font-size text-white mx-2 leading-10">{fields.priceDistribution.creator}% </span>
                                    }
                                    {fields.invitationType != "none" &&
                                        <div className="mx-2">
                                            <input
                                                type="text"
                                                value={fields.priceDistribution.creator}
                                                onChange={(event) => {
                                                    let priceDetails = {
                                                        echosystem: 3,
                                                        curator: 2,
                                                        creator:prepareNumber(Number(event.target.value)),
                                                        promoter: fields.priceDistribution.promoter,
                                                        scout: fields.priceDistribution.scout,
                                                    };
                                                    setFields({ ...fields, priceDistribution: priceDetails})
                                                }}
                                                placeholder="0"
                                                className="input input-bordered h-10 text-base bg-black bg-opacity-[0.07] placeholder-white placeholder-opacity-[0.3] backdrop-container w-16"
                                            />
                                        </div>
                                    }
                                    <span className="text-header-small-font-size text-white leading-10">Your royalties</span>
                                </div>
                            </div>
                            {fields.invitationType != "none" &&
                                <div className="project-share-royalties-agents">
                                    <h4 className="text-header-small-font-size">Agents</h4>
                                    <div className="flex">
                                        <label className="text-xs text-white leading-10 min-w-12">Promoter</label>
                                        <div className="mx-2">
                                            <input
                                                type="text"
                                                value={fields.priceDistribution.promoter}
                                                onChange={(event) => {
                                                    let priceDetails = {
                                                        echosystem: 3,
                                                        curator: 2,
                                                        creator: fields.priceDistribution.creator,
                                                        promoter: prepareNumber(Number(event.target.value)),
                                                        scout: fields.priceDistribution.scout,
                                                    };
                                                    setFields({ ...fields, priceDistribution: priceDetails})
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
                                                value={fields.priceDistribution.scout}
                                                onChange={(event) => {
                                                    let priceDetails = {
                                                        echosystem: 3,
                                                        curator: 2,
                                                        creator: fields.priceDistribution.creator,
                                                        promoter: fields.priceDistribution.promoter,
                                                        scout: prepareNumber(Number(event.target.value)),
                                                    };
                                                    setFields({ ...fields, priceDistribution: priceDetails})
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
                    {!loading &&
                        <button className="btn btn-primary ml-10 bg-primary text-white border-none hover:bg-primary hover:text-white" onClick={gotoStep2}>Next</button>
                    }
                    {loading &&
                        <button className="btn btn-primary ml-10 bg-primary text-white border-none hover:bg-primary hover:text-white">Loading...</button>
                    }
                </div>
            </div>
        </div>
        </>

    );
}
